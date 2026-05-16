import { useMemo } from 'react';

/**
 * Decorative particles for high-tier achievements.
 * Renders nothing for tiers below `legendary`.
 */
export default function TierParticles({ tier = 'common', count = 6 }) {
  const tierConfig = useMemo(() => {
    switch (tier) {
      case 'legendary':
        return {
          enabled: true,
          color: '#d4a574',
          symbols: ['✦', '✧'],
          opacity: 0.6,
        };
      case 'mythic':
        return {
          enabled: true,
          color: '#f0abfc',
          symbols: ['✦', '✧', '✺'],
          opacity: 0.7,
        };
      case 'sohibqiron':
        return {
          enabled: true,
          color: '#fbbf24',
          symbols: ['✦', '✧', '✺', '☄'],
          opacity: 0.85,
        };
      default:
        return { enabled: false };
    }
  }, [tier]);

  const particles = useMemo(() => {
    if (!tierConfig.enabled) return [];
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 40 + Math.random() * 20;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      const sym = tierConfig.symbols[i % tierConfig.symbols.length];
      const dur = 2.5 + Math.random() * 2;
      const delay = (i / count) * dur;
      const size = 6 + Math.random() * 8;
      return { x, y, sym, dur, delay, size };
    });
  }, [tierConfig, count]);

  if (!tierConfig.enabled) return null;

  return (
    <span className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: 'translate(-50%, -50%)',
            color: tierConfig.color,
            opacity: tierConfig.opacity,
            fontSize: `${p.size}px`,
            animation: `tier-particle-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.sym}
        </span>
      ))}
    </span>
  );
}
