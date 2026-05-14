import { useState, useEffect } from 'react';
import allQuestions from '../../data/quiz.json';

function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s ^ (s >>> 15), s | 1)) >>> 0;
    s = (s ^ (s + Math.imul(s ^ (s >>> 7), s | 61))) >>> 0;
    s = (s ^ (s >>> 14)) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SCHOLAR_LABELS = {
  beruniy: 'Beruniy',
  'ibn-sino': 'Ibn Sino',
  ulugbek: "Ulug'bek",
  cholpon: "Cho'lpon",
  behbudiy: 'Behbudiy',
};

const SCHOLAR_COLORS = {
  beruniy: '#d4a574',
  'ibn-sino': '#e8c898',
  ulugbek: '#1a6b7e',
  cholpon: '#8b2635',
  behbudiy: '#0f4c5c',
};

export default function DailyQuiz({ onComplete }) {
  const [questions] = useState(() => seededShuffle(allQuestions, getDailySeed()).slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [phase, setPhase] = useState('playing');

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      advance(-1);
      return;
    }
    const t = setTimeout(() => setTimeLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  function advance(idx) {
    const correct = idx === questions[current].answer;
    const newAnswers = [...answers, correct];
    setSelected(idx);
    setPhase('feedback');
    setAnswers(newAnswers);
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setTimeLeft(30);
        setPhase('playing');
      } else {
        setPhase('result');
      }
    }, 1200);
  }

  function handleAnswer(idx) {
    if (phase !== 'playing') return;
    advance(idx);
  }

  if (phase === 'result') {
    const correctCount = answers.filter(Boolean).length;
    const coins = correctCount * 10;
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="text-7xl font-serif text-gold">{correctCount}/5</div>
        <p className="text-cream/70 text-lg">
          {correctCount === 5
            ? 'Mukammal natija!'
            : correctCount >= 3
            ? "Yaxshi o'ynadingiz!"
            : 'Keyingi safar yaxshiroq!'}
        </p>
        <div className="flex items-center gap-2 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full">
          <CoinIcon />
          <span className="text-gold text-xl font-semibold">+{coins} tanga</span>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${
                answers[i]
                  ? 'bg-emerald-900/30 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-900/20 border border-red-500/20 text-red-300'
              }`}
            >
              <span className="font-bold">{answers[i] ? '✓' : '✗'}</span>
              <span className="truncate">{q.question}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => onComplete(coins)}
          className="px-8 py-3 bg-gold text-bg-deep font-semibold rounded-lg hover:bg-gold/90 transition-colors"
        >
          Tugatish
        </button>
      </div>
    );
  }

  const q = questions[current];
  const accent = SCHOLAR_COLORS[q.scholar] || '#d4a574';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-cream/50 text-sm">{current + 1} / {questions.length}</span>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium border"
          style={{ color: accent, borderColor: `${accent}50`, background: `${accent}18` }}
        >
          {SCHOLAR_LABELS[q.scholar]}
        </span>
        <span className={`font-mono text-lg font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-gold'}`}>
          {timeLeft}s
        </span>
      </div>

      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>

      <p className="text-cream text-lg font-medium leading-relaxed min-h-[3.5rem]">{q.question}</p>

      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => {
          let cls =
            'w-full text-left px-5 py-3.5 rounded-lg border text-sm font-medium transition-all duration-200 ';
          if (phase === 'feedback') {
            if (i === q.answer)
              cls += 'border-emerald-400 bg-emerald-900/30 text-emerald-300';
            else if (i === selected)
              cls += 'border-red-400 bg-red-900/30 text-red-300';
            else cls += 'border-white/10 bg-white/5 text-cream/30';
          } else {
            cls +=
              'border-gold/20 bg-white/5 text-cream hover:border-gold/50 hover:bg-gold/10 cursor-pointer';
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}>
              <span className="mr-3 text-gold/50">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CoinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold flex-shrink-0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v10M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5S13.66 12 12 12s-3 1.12-3 2.5S10.34 17 12 17s3-1.12 3-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
