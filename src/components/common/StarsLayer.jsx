import { useMemo } from 'react';

export default function StarsLayer({ count = 80, className = '' }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 2 + 1;
      return {
        id: i,
        size,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
      };
    });
  }, [count]);

  return (
    <div className={`absolute top-0 left-0 right-0 h-[60%] overflow-hidden pointer-events-none ${className}`}>
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-cream"
          style={{
            width: s.size + 'px',
            height: s.size + 'px',
            left: s.left + '%',
            top: s.top + '%',
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}
