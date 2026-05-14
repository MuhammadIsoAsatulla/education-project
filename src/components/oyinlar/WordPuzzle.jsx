import { useState, useEffect, useCallback } from 'react';
import words from '../../data/wordpuzzle.json';

function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function getDailyWord() {
  const seed = getDailySeed();
  return words[seed % words.length];
}

function computeHints(guess, word) {
  const result = Array(5).fill('absent');
  const w = word.split('');
  const g = guess.split('');
  g.forEach((l, i) => {
    if (l === w[i]) {
      result[i] = 'correct';
      w[i] = null;
      g[i] = null;
    }
  });
  g.forEach((l, i) => {
    if (l === null) return;
    const j = w.indexOf(l);
    if (j !== -1) {
      result[i] = 'present';
      w[j] = null;
    }
  });
  return result;
}

const ROWS = 6;
const COLS = 5;

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '←'],
];

export default function WordPuzzle({ onComplete }) {
  const daily = getDailyWord();
  const word = daily.word;

  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState('');
  const [phase, setPhase] = useState('playing');
  const [error, setError] = useState(false);

  const handleKey = useCallback(
    (key) => {
      if (phase !== 'playing') return;
      if (key === '←' || key === 'BACKSPACE') {
        setCurrent((c) => c.slice(0, -1));
      } else if (key === 'ENTER') {
        if (current.length !== COLS) {
          setError(true);
          setTimeout(() => setError(false), 500);
          return;
        }
        const hints = computeHints(current, word);
        const newGuesses = [...guesses, { word: current, hints }];
        setGuesses(newGuesses);
        setCurrent('');
        if (current === word) {
          setPhase('won');
        } else if (newGuesses.length >= ROWS) {
          setPhase('lost');
        }
      } else if (/^[A-Z]$/.test(key) && current.length < COLS) {
        setCurrent((c) => c + key);
      }
    },
    [phase, current, guesses, word],
  );

  useEffect(() => {
    const handler = (e) => {
      const k = e.key.toUpperCase();
      if (k === 'BACKSPACE') handleKey('←');
      else if (k === 'ENTER') handleKey('ENTER');
      else if (/^[A-Z]$/.test(k)) handleKey(k);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const letterStates = {};
  guesses.forEach(({ word: w, hints }) => {
    w.split('').forEach((l, i) => {
      const h = hints[i];
      const cur = letterStates[l];
      if (h === 'correct') letterStates[l] = 'correct';
      else if (h === 'present' && cur !== 'correct') letterStates[l] = 'present';
      else if (h === 'absent' && !cur) letterStates[l] = 'absent';
    });
  });

  const coins =
    phase === 'won'
      ? Math.max(25, 55 - guesses.length * 5)
      : phase === 'lost'
      ? 5
      : 0;

  if (phase !== 'playing') {
    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <Grid guesses={guesses} current="" error={false} />
        <div className="text-center">
          {phase === 'won' ? (
            <p className="text-gold text-2xl font-serif">So'z topildi!</p>
          ) : (
            <div>
              <p className="text-red-400 text-lg">Urinishlar tugadi</p>
              <p className="text-cream/60 text-sm mt-1">
                To'g'ri so'z: <span className="text-gold font-bold">{word}</span>
              </p>
            </div>
          )}
          <p className="text-cream/50 text-sm mt-2 italic">{daily.hint}</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full">
          <CoinIcon />
          <span className="text-gold text-xl font-semibold">+{coins} tanga</span>
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

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-cream/50 text-sm italic text-center">Maslahat: {daily.hint}</p>
      <Grid guesses={guesses} current={current} error={error} />
      <Keyboard letterStates={letterStates} onKey={handleKey} />
    </div>
  );
}

function Grid({ guesses, current, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      {Array(ROWS)
        .fill(null)
        .map((_, row) => {
          const guess = guesses[row];
          const isCurrent = row === guesses.length;
          const letters = guess
            ? guess.word.split('')
            : isCurrent
            ? current.padEnd(COLS).split('')
            : Array(COLS).fill('');
          return (
            <div
              key={row}
              className={`flex gap-1.5 ${isCurrent && error ? 'animate-bounce' : ''}`}
            >
              {letters.map((l, col) => {
                let cls =
                  'w-12 h-12 flex items-center justify-center text-xl font-bold rounded border-2 transition-all duration-300 ';
                if (guess) {
                  const h = guess.hints[col];
                  if (h === 'correct') cls += 'bg-emerald-700 border-emerald-600 text-white';
                  else if (h === 'present') cls += 'bg-amber-700 border-amber-600 text-white';
                  else cls += 'bg-neutral-700 border-neutral-600 text-white/70';
                } else if (isCurrent && l.trim()) {
                  cls += 'border-gold/60 bg-white/5 text-cream';
                } else {
                  cls += 'border-white/15 bg-transparent text-transparent';
                }
                return (
                  <div key={col} className={cls}>
                    {l.trim()}
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}

function Keyboard({ letterStates, onKey }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {KEYBOARD_ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map((k) => {
            const state = letterStates[k];
            const isWide = k === 'ENTER' || k === '←';
            let cls = `${isWide ? 'px-2 min-w-[3rem]' : 'w-9'} h-12 rounded text-xs font-bold cursor-pointer select-none transition-colors flex items-center justify-center `;
            if (state === 'correct') cls += 'bg-emerald-700 text-white';
            else if (state === 'present') cls += 'bg-amber-700 text-white';
            else if (state === 'absent') cls += 'bg-neutral-700 text-neutral-500';
            else cls += 'bg-white/10 text-cream hover:bg-white/20';
            return (
              <button key={k} className={cls} onClick={() => onKey(k)}>
                {k}
              </button>
            );
          })}
        </div>
      ))}
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
