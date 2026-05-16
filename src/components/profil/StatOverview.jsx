import { useEffect, useState } from 'react';

function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const startTs = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - startTs;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatCard({ label, value, icon, accent = '#d4a574' }) {
  const animated = useCountUp(value);
  return (
    <div
      className="relative p-5 sm:p-6 border border-gold/25 rounded-sm bg-bg-mid/40 backdrop-blur hover:border-gold/60 transition group"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-cream-soft/60 text-[10px] tracking-[2px] uppercase">{label}</span>
        <span className="text-xl opacity-70 group-hover:opacity-100 transition">{icon}</span>
      </div>
      <div className="font-serif text-gold-gradient text-3xl sm:text-4xl tabular-nums leading-none">
        {animated}
      </div>
    </div>
  );
}

export default function StatOverview({ state }) {
  const totalVisited = Object.values(state.visited || {}).reduce(
    (sum, list) => sum + list.length,
    0,
  );
  const totalFavorites = Object.values(state.favorites || {}).reduce(
    (sum, list) => sum + list.length,
    0,
  );
  const perfectQuizzes = Object.values(state.quizScores || {}).filter(
    (q) => q.score === q.total && q.total > 0,
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <StatCard label="Tashriflar" value={totalVisited} icon="✦" accent="#d4a574" />
      <StatCard label="Sevimlilar" value={totalFavorites} icon="❤" accent="#8b2635" />
      <StatCard label="Mukammal" value={perfectQuizzes} icon="✓" accent="#1a6b7e" />
      <StatCard label="Streak" value={state.streak?.current || 0} icon="✧" accent="#e8c898" />
    </div>
  );
}
