import { useMemo } from 'react';

// Site-wide starry backdrop. Renders once at the root of the app and sits
// fixed behind all content so every page inherits the same animated sky as
// the homepage hero — without each page having to opt in.
//
// Why this exists separately from StarsLayer:
//  - StarsLayer is an in-flow absolute-positioned element scoped to the hero
//    (top 60% of its container). It would scroll away.
//  - GlobalBackground uses position: fixed and a viewport-sized canvas, so
//    the stars stay glued behind the user as they scroll the whole site.
//
// Stars are dimmer + sparser than the hero ones so they don't compete with
// the hero's foreground stars; they read as ambient atmosphere instead.

export default function GlobalBackground({ count = 140 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Bias toward smaller stars (Math.random()^2) so the field looks dusted,
      // not pixelated. A handful of larger sparkles add depth.
      const r = Math.random();
      const size = 0.6 + r * r * 2.2; // 0.6 → ~2.8 px
      const isGold = Math.random() < 0.18; // ~18% gold-tinted accent stars
      return {
        id: i,
        size,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 2.2 + Math.random() * 3.5,
        opacity: 0.25 + Math.random() * 0.4,
        isGold,
      };
    });
  }, [count]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        // Deep navy base — uniform color matching `--bg-deep` so any page
        // section that is transparent reveals this color seamlessly with no
        // visible step. The radial gradient that was here previously created
        // a hard line at the hero boundary.
        background: '#0a1f2e',
        zIndex: -1,
      }}
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.size + 'px',
            height: s.size + 'px',
            left: s.left + '%',
            top: s.top + '%',
            background: s.isGold ? 'rgba(212,165,116,0.85)' : 'rgba(245,235,210,0.9)',
            boxShadow: s.isGold
              ? `0 0 ${s.size * 4}px ${s.size * 1.5}px rgba(212,165,116,0.18)`
              : `0 0 ${s.size * 3}px ${s.size * 1.2}px rgba(245,235,210,0.12)`,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
