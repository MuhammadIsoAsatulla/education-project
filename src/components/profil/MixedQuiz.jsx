import { useMemo, useState } from 'react';
import viktorinalar from '../../data/viktorinalar.json';
import allomalar from '../../data/allomalar.json';
import muzeylar from '../../data/muzeylar.json';
import musiqa from '../../data/musiqa.json';
import kinolar from '../../data/kinolar.json';
import kitoblar from '../../data/kitoblar.json';
import Quiz from '../common/Quiz.jsx';
import useProgress from '../../hooks/useProgress.js';

const NAME_MAPS = {
  allomalar: Object.fromEntries(allomalar.map((a) => [a.slug, a.name])),
  muzeylar: Object.fromEntries(muzeylar.map((m) => [m.slug, m.name])),
  musiqa: Object.fromEntries(musiqa.map((m) => [m.slug, m.title])),
  kinolar: Object.fromEntries(kinolar.map((k) => [k.slug, k.title])),
  kitoblar: Object.fromEntries(kitoblar.map((k) => [k.slug, k.title])),
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPool() {
  const pool = [];
  viktorinalar.forEach((entry) => {
    const ownerName = NAME_MAPS[entry.ownerType]?.[entry.ownerId] || entry.ownerId;
    entry.questions.forEach((q, qi) => {
      pool.push({
        ...q,
        meta: {
          section: entry.ownerType,
          ownerId: entry.ownerId,
          ownerName,
          qIndex: qi,
        },
      });
    });
  });
  return pool;
}

export default function MixedQuiz({ count = 10, onClose }) {
  const { submitQuiz } = useProgress();
  const [phase, setPhase] = useState('intro'); // intro | playing | done
  const [finalScore, setFinalScore] = useState(0);

  const questions = useMemo(() => shuffle(buildPool()).slice(0, count), [count]);

  const handleComplete = (score) => {
    setFinalScore(score);
    submitQuiz('mixed-quiz-' + new Date().toISOString().slice(0, 10), score, questions.length);
    setPhase('done');
  };

  if (phase === 'intro') {
    return (
      <div className="text-center p-8 rounded-sm border border-gold/30 bg-bg-mid/40 backdrop-blur">
        <div className="eyebrow mb-3">— ARALASH VIKTORINA —</div>
        <h3 className="font-serif text-gold-gradient text-3xl mb-3">Aralash Bilim Sinovi</h3>
        <p className="font-serif italic text-cream-soft/80 mb-6 max-w-md mx-auto">
          5 bo'limdan tasodifiy {count} ta savol. Allomalar, muzeylar, musiqa, kinolar va
          kitoblar — barchasidan. Har to'g'ri javob 10 ball beradi, mukammal natija 2 bronza
          muhr beradi.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={() => setPhase('playing')} className="gold-cta">
            <span>Boshlash</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-3 border border-gold/30 text-cream-soft hover:text-gold hover:border-gold rounded-sm text-xs tracking-[2px] uppercase transition"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'playing') {
    return (
      <div>
        <Quiz
          questions={questions}
          previousBest={null}
          onComplete={handleComplete}
          onClose={onClose}
        />
      </div>
    );
  }

  // Done
  const perfect = finalScore === questions.length;
  return (
    <div className="text-center p-8 sm:p-12 rounded-sm border border-gold/30 bg-bg-mid/50 backdrop-blur">
      <div className="eyebrow mb-3">— ARALASH NATIJA —</div>
      <h3 className="font-serif text-gold-gradient text-5xl mb-3 tabular-nums">
        {finalScore} / {questions.length}
      </h3>
      <p className="font-serif italic text-cream-soft text-lg mb-3">
        {perfect
          ? 'Hayratlanarli! Barcha javoblar to\'g\'ri.'
          : finalScore >= Math.ceil(questions.length * 0.7)
          ? 'Ajoyib natija!'
          : finalScore >= Math.ceil(questions.length / 2)
          ? 'Yaxshi, lekin yana o\'rganib chiqing.'
          : 'Ko\'proq o\'rganishingiz kerak — sizga muvaffaqiyat tilaymiz.'}
      </p>
      <p className="text-gold text-sm mb-6">+{finalScore * 10} ball qo'lga kiritdingiz</p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => {
            setFinalScore(0);
            setPhase('playing');
          }}
          className="gold-cta"
        >
          <span>Qayta sinash</span>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-3 border border-gold/30 text-cream-soft hover:text-gold hover:border-gold rounded-sm text-xs tracking-[2px] uppercase transition"
          >
            Yopish
          </button>
        )}
      </div>
    </div>
  );
}
