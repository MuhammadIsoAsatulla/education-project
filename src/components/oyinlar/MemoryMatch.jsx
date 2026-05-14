import { useState, useEffect } from 'react';
import oyinlar from '../../data/oyinlar.json';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryMatch({ onComplete }) {
  const [cards] = useState(() => shuffle(oyinlar.memoryCards));
  const [flipped, setFlipped] = useState(new Set());
  const [matched, setMatched] = useState(new Set());
  const [pending, setPending] = useState(null);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [phase, setPhase] = useState('playing');

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) setPhase('complete');
  }, [matched, cards.length]);

  function handleFlip(idx) {
    if (lock || flipped.has(idx) || matched.has(idx)) return;

    const newFlipped = new Set([...flipped, idx]);
    setFlipped(newFlipped);

    if (pending === null) {
      setPending(idx);
    } else {
      setMoves((m) => m + 1);
      setLock(true);
      if (cards[pending].pair === cards[idx].pair) {
        const newMatched = new Set([...matched, pending, idx]);
        setTimeout(() => {
          setMatched(newMatched);
          setPending(null);
          setLock(false);
        }, 500);
      } else {
        const firstIdx = pending;
        setTimeout(() => {
          setFlipped((prev) => {
            const next = new Set(prev);
            next.delete(firstIdx);
            next.delete(idx);
            return next;
          });
          setPending(null);
          setLock(false);
        }, 900);
      }
    }
  }

  const coins = phase === 'complete' ? Math.max(20, 60 - Math.max(0, moves - cards.length / 2) * 2) : 0;

  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <p className="text-gold text-2xl font-serif">Barcha juftlar topildi!</p>
        <p className="text-cream/60">{moves} ta harakat bilan</p>
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
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-sm text-cream/50">
        <span>Juftlar: {matched.size / 2} / {cards.length / 2}</span>
        <span>Harakatlar: {moves}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, idx) => {
          const isFlipped = flipped.has(idx);
          const isMatched = matched.has(idx);
          return (
            <button
              key={idx}
              onClick={() => handleFlip(idx)}
              className={`w-[4.5rem] h-[4.5rem] rounded-lg border text-[0.65rem] font-medium leading-tight text-center p-1.5 transition-all duration-300
                ${
                  isMatched
                    ? 'bg-emerald-900/40 border-emerald-500/40 text-emerald-300 cursor-default'
                    : isFlipped
                    ? 'bg-bg-mid border-gold/50 text-cream cursor-default'
                    : 'bg-white/5 border-white/10 text-transparent cursor-pointer hover:border-gold/30 hover:bg-white/8'
                }
              `}
            >
              {isFlipped || isMatched ? card.label : '?'}
            </button>
          );
        })}
      </div>
      <p className="text-cream/40 text-xs text-center mt-1">
        Juftlarni topish uchun kartochkalarni oching
      </p>
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
