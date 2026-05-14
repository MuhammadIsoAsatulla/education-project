import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress.js';
import masteryData from '../data/mastery.json';
import heroesData from '../data/heroes.json';
import HeroCard from '../components/store/HeroCard.jsx';

export default function MasteryTestPage() {
  const { heroId } = useParams();
  const navigate = useNavigate();
  const { state, addToCollection } = useProgress();
  const [phase, setPhase] = useState('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [feedback, setFeedback] = useState(false);

  const test = masteryData[heroId];
  const hero = heroesData.find((h) => h.id === heroId);
  const alreadyOwned = (state.collection || []).includes(heroId);

  useEffect(() => {
    if (phase !== 'testing' || timeLeft === null) return;
    if (timeLeft <= 0) {
      setPhase('result');
      return;
    }
    const t = setTimeout(() => setTimeLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  if (!test || !hero) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cream">
        <p>Sinov topilmadi.</p>
      </div>
    );
  }

  function startTest() {
    setPhase('testing');
    setTimeLeft(test.timeLimit);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
  }

  function handleAnswer(idx) {
    if (feedback) return;
    setSelected(idx);
    setFeedback(true);
    const correct = idx === test.questions[current].answer;
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);
    setTimeout(() => {
      setFeedback(false);
      setSelected(null);
      if (current + 1 < test.questions.length) {
        setCurrent((c) => c + 1);
      } else {
        setPhase('result');
      }
    }, 900);
  }

  const correctCount = answers.filter(Boolean).length;
  const passed = phase === 'result' && correctCount / test.questions.length >= test.passThreshold;

  if (passed && !alreadyOwned) {
    addToCollection(heroId);
  }

  const mins = Math.floor((timeLeft || 0) / 60);
  const secs = ((timeLeft || 0) % 60).toString().padStart(2, '0');
  const pct = Math.round((correctCount / test.questions.length) * 100);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <Link to="/dokon" className="text-cream/50 hover:text-gold text-sm flex items-center gap-2 mb-8 transition-colors">
            ← Do'konga qaytish
          </Link>
          <div className="p-6 sm:p-8 bg-white/[0.03] border rounded-2xl" style={{ borderColor: `${hero.accent}40` }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-28 flex-shrink-0">
                <HeroCard hero={hero} owned={alreadyOwned} />
              </div>
              <div>
                <div className="text-amber-400 text-xs tracking-widest uppercase mb-2">Afsonaviy Sinov</div>
                <h1 className="font-serif text-2xl text-cream mb-1">{test.title}</h1>
                <p className="text-cream/60 text-sm leading-relaxed">{test.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-gold text-xl font-semibold">{test.questions.length}</div>
                <div className="text-cream/50 text-xs">Savol</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-gold text-xl font-semibold">{test.timeLimit / 60} daq</div>
                <div className="text-cream/50 text-xs">Vaqt</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-gold text-xl font-semibold">{Math.round(test.passThreshold * 100)}%</div>
                <div className="text-cream/50 text-xs">O'tish chegarasi</div>
              </div>
            </div>

            {alreadyOwned ? (
              <div className="text-center py-3 text-emerald-400 font-medium">
                Siz bu sinovni allaqachon o'tdingiz ✓
              </div>
            ) : (
              <button
                onClick={startTest}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-bg-deep font-semibold rounded-lg transition-colors"
              >
                Sinovni boshlash
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="text-7xl font-serif mb-2" style={{ color: passed ? '#f59e0b' : '#ef4444' }}>
            {correctCount}/{test.questions.length}
          </div>
          <p className="text-cream/60 text-lg mb-2">{pct}% to'g'ri</p>

          {passed ? (
            <div className="mb-6">
              <p className="text-amber-400 text-xl font-semibold mb-4">Tabriklaymiz! Siz o'tdingiz!</p>
              <div className="w-44 mx-auto">
                <HeroCard hero={hero} owned />
              </div>
              <p className="text-cream/60 text-sm mt-3">
                <span className="text-gold font-semibold">{hero.name}</span> kartochkasi to'plamingizga qo'shildi!
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-red-400 text-lg mb-2">Maqsadga erishmadingiz</p>
              <p className="text-cream/50 text-sm">
                O'tish uchun {Math.round(test.passThreshold * 100)}% kerak edi. Ertaga qayta urinib ko'ring.
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Link
              to="/dokon"
              className="px-6 py-2.5 border border-white/20 text-cream/70 rounded-lg text-sm hover:border-gold/40 hover:text-cream transition-colors"
            >
              Do'konga qaytish
            </Link>
            {!passed && (
              <button
                onClick={startTest}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-bg-deep font-semibold rounded-lg text-sm transition-colors"
              >
                Qayta urinish
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = test.questions[current];
  const progress = ((current + answers.length / test.questions.length) / test.questions.length) * 100;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-cream/50 text-sm">{current + 1} / {test.questions.length}</span>
          <div
            className={`font-mono text-base font-bold px-3 py-1 rounded-lg ${
              (timeLeft || 0) < 60 ? 'bg-red-900/30 text-red-400' : 'bg-white/5 text-gold'
            }`}
          >
            {mins}:{secs}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${(current / test.questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <p className="text-cream text-lg font-medium leading-relaxed mb-6 min-h-[3rem]">
          {q.question}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {q.options.map((opt, i) => {
            let cls =
              'w-full text-left px-5 py-3.5 rounded-lg border text-sm font-medium transition-all duration-200 ';
            if (feedback) {
              if (i === q.answer) cls += 'border-emerald-400 bg-emerald-900/30 text-emerald-300';
              else if (i === selected) cls += 'border-red-400 bg-red-900/30 text-red-300';
              else cls += 'border-white/10 bg-white/5 text-cream/30';
            } else {
              cls +=
                'border-amber-400/20 bg-white/5 text-cream hover:border-amber-400/50 hover:bg-amber-900/20 cursor-pointer';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={feedback}>
                <span className="mr-3 text-amber-400/50">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
