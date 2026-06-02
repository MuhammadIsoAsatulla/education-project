import { useEffect, useMemo, useState } from 'react';
import OrnamentDivider from './OrnamentDivider.jsx';

const PHASE = {
  ASKING: 'asking',
  REVEAL: 'reveal',
  DONE: 'done',
};

// Default size of a single quiz session. If the question bank has more
// questions than this, each session pulls a random subset so retakes don't
// repeat the same set. If the bank has fewer, all questions are used.
export const DEFAULT_QUIZ_SIZE = 8;

// Helper for detail pages — figures out how many questions will actually
// be displayed in one session given a bank of size `bankSize`.
export function quizSessionSize(bankSize, maxSize = DEFAULT_QUIZ_SIZE) {
  return Math.min(maxSize, bankSize || 0);
}

// Fisher-Yates shuffle — returns a NEW array, doesn't mutate the input.
function shuffle(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function Quiz({
  questions = [],
  previousBest = null,
  onComplete,
  onClose,
  quizSize = DEFAULT_QUIZ_SIZE,
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(PHASE.ASKING);
  // Bump to re-sample the question pool on restart. We pick a random subset
  // every session so users who retake the quiz see a different mix.
  const [seed, setSeed] = useState(0);

  // The "bank" is the full questions prop; "displayed" is a random subset of
  // size min(quizSize, bank.length). Shuffling also randomises ORDER within
  // the displayed set — twice as much variety with one operation.
  const displayed = useMemo(() => {
    if (!questions.length) return [];
    const n = Math.min(quizSize, questions.length);
    return shuffle(questions).slice(0, n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, quizSize, seed]);

  const total = displayed.length;
  const current = displayed[index];

  useEffect(() => {
    if (phase !== PHASE.REVEAL) return;
    const t = setTimeout(() => {
      if (index + 1 < total) {
        setIndex(index + 1);
        setSelected(null);
        setPhase(PHASE.ASKING);
      } else {
        setPhase(PHASE.DONE);
        onComplete?.(score, total);
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [phase, index, total, score, onComplete]);

  const choose = (i) => {
    if (phase !== PHASE.ASKING) return;
    const correct = i === current.correct;
    setSelected(i);
    setScore((s) => s + (correct ? 1 : 0));
    setPhase(PHASE.REVEAL);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setPhase(PHASE.ASKING);
    // Re-shuffle the bank so the next session shows a different mix of
    // questions. If the bank ≤ quizSize, the same questions appear but in
    // a new order — still feels fresh.
    setSeed((s) => s + 1);
  };

  if (phase === PHASE.DONE) {
    const perfect = score === total;
    return (
      <div className="relative p-6 sm:p-10 md:p-12 rounded-sm border border-gold/30 bg-bg-mid/50 backdrop-blur text-center max-w-2xl mx-auto">
        <OrnamentDivider className="opacity-60 mb-5" />
        <div className="eyebrow mb-3">— NATIJA —</div>
        <h3 className="font-serif text-cream leading-tight mb-3" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>
          {score} / {total}
        </h3>
        <p className="font-serif italic text-cream-soft text-lg mb-2">
          {perfect
            ? "Tabriklaymiz! Barcha javoblar to'g'ri."
            : score >= Math.ceil(total / 2)
              ? 'Yaxshi natija — yana sinab ko\'rishingiz mumkin.'
              : 'Yana o\'rganib, qayta sinab ko\'ring.'}
        </p>
        {previousBest !== null && score > previousBest && (
          <p className="text-gold/80 text-sm mt-2">
            Yangi rekord! Avval: {previousBest}/{total}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <button onClick={restart} className="gold-cta">
            <span>Qayta sinash</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gold/40 text-cream-soft text-xs tracking-[2px] uppercase hover:text-gold hover:border-gold rounded-sm transition"
            >
              Yopish
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-5 sm:p-8 md:p-10 rounded-sm border border-gold/30 bg-bg-mid/50 backdrop-blur max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="eyebrow text-xs">— SAVOL {index + 1} / {total} —</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gold/60 hover:text-gold text-xs tracking-[2px] uppercase"
            aria-label="Yopish"
          >
            ✕
          </button>
        )}
      </div>

      <div className="h-1 bg-bg-deep rounded-full overflow-hidden border border-gold/20 mb-8">
        <div
          className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-all duration-500"
          style={{ width: `${((index + (phase === PHASE.REVEAL ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <h3 className="font-serif text-cream text-xl sm:text-2xl md:text-3xl leading-snug mb-8">
        {current.q}
      </h3>

      <div className="grid gap-3">
        {current.options.map((opt, i) => {
          const isCorrect = phase === PHASE.REVEAL && i === current.correct;
          const isWrongPick = phase === PHASE.REVEAL && i === selected && i !== current.correct;
          const baseClass =
            'group w-full text-left px-5 py-4 rounded-sm border transition-all duration-300 flex items-center gap-4';
          const stateClass = isCorrect
            ? 'border-emerald-400/70 bg-emerald-500/15 text-cream'
            : isWrongPick
              ? 'border-crimson/70 bg-crimson/15 text-cream'
              : phase === PHASE.REVEAL
                ? 'border-gold/15 text-cream-soft/60 cursor-not-allowed'
                : 'border-gold/30 text-cream-soft hover:border-gold hover:text-cream hover:bg-bg-deep/40';
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={phase !== PHASE.ASKING}
              className={`${baseClass} ${stateClass}`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-serif text-sm ${
                  isCorrect
                    ? 'border-emerald-400 bg-emerald-500/30'
                    : isWrongPick
                      ? 'border-crimson bg-crimson/30'
                      : 'border-gold/40'
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm sm:text-base">{opt}</span>
              {isCorrect && <span className="text-emerald-300 text-sm">✓</span>}
              {isWrongPick && <span className="text-crimson text-sm">✕</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-cream-soft/60">
        <span>Joriy ball: <span className="text-gold">{score}</span></span>
        {previousBest !== null && (
          <span>Avvalgi natija: {previousBest}/{total}</span>
        )}
      </div>
    </div>
  );
}
