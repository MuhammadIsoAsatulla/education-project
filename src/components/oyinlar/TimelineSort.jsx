import { useState } from 'react';
import oyinlar from '../../data/oyinlar.json';

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

const SCHOLAR_COLORS = {
  beruniy: '#d4a574',
  'ibn-sino': '#e8c898',
  ulugbek: '#1a6b7e',
  cholpon: '#8b2635',
  behbudiy: '#0f4c5c',
};

export default function TimelineSort({ onComplete }) {
  const seed = getDailySeed();
  const [events] = useState(() => {
    const selected = seededShuffle(oyinlar.timelineEvents, seed).slice(0, 6);
    return seededShuffle(selected, seed + 1);
  });
  const [order, setOrder] = useState(() => events.map((_, i) => i));
  const [phase, setPhase] = useState('playing');
  const [result, setResult] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);

  function moveItem(from, to) {
    if (from === to) return;
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function checkAnswer() {
    const correctOrder = [...order].sort((a, b) => events[a].year - events[b].year);
    let correct = 0;
    order.forEach((eventIdx, pos) => {
      if (eventIdx === correctOrder[pos]) correct++;
    });
    const coins = correct * 10;
    setResult({ correct, total: order.length, coins, correctOrder });
    setPhase('result');
  }

  if (phase === 'result') {
    return (
      <div className="flex flex-col items-center gap-5 py-4 max-w-md mx-auto w-full">
        <p className="text-gold text-2xl font-serif">
          {result.correct}/{result.total} to'g'ri
        </p>
        <div className="flex items-center gap-2 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full">
          <CoinIcon />
          <span className="text-gold text-xl font-semibold">+{result.coins} tanga</span>
        </div>
        <div className="w-full">
          <p className="text-cream/50 text-xs text-center mb-2">To'g'ri ketma-ketlik:</p>
          <div className="flex flex-col gap-1.5">
            {result.correctOrder.map((eventIdx, pos) => (
              <div
                key={pos}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-gold font-mono text-sm w-12 flex-shrink-0">
                  {events[eventIdx].year}
                </span>
                <span className="text-cream text-sm">{events[eventIdx].text}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => onComplete(result.coins)}
          className="px-8 py-3 bg-gold text-bg-deep font-semibold rounded-lg hover:bg-gold/90 transition-colors"
        >
          Tugatish
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
      <p className="text-cream/50 text-sm text-center">
        Voqealarni qadimdan yangiga qarab tartibga soling
      </p>
      <div className="flex flex-col gap-2">
        {order.map((eventIdx, pos) => (
          <div
            key={eventIdx}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={() => setDragFrom(pos)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragFrom !== null) moveItem(dragFrom, pos);
              setDragFrom(null);
            }}
            onDragEnd={() => setDragFrom(null)}
          >
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button
                onClick={() => pos > 0 && moveItem(pos, pos - 1)}
                disabled={pos === 0}
                className="text-gold/40 hover:text-gold disabled:opacity-20 text-[10px] leading-none"
              >
                ▲
              </button>
              <button
                onClick={() => pos < order.length - 1 && moveItem(pos, pos + 1)}
                disabled={pos === order.length - 1}
                className="text-gold/40 hover:text-gold disabled:opacity-20 text-[10px] leading-none"
              >
                ▼
              </button>
            </div>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: SCHOLAR_COLORS[events[eventIdx].scholar] || '#d4a574' }}
            />
            <span className="text-cream text-sm flex-1 leading-snug">{events[eventIdx].text}</span>
            <span className="text-cream/30 text-xs flex-shrink-0">{pos + 1}</span>
          </div>
        ))}
      </div>
      <button
        onClick={checkAnswer}
        className="px-8 py-3 bg-gold text-bg-deep font-semibold rounded-lg hover:bg-gold/90 transition-colors"
      >
        Tekshirish
      </button>
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
