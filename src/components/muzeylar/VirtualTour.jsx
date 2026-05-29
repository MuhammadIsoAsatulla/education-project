import { useEffect, useRef, useState } from 'react';

/**
 * Pseudo-360° tour: the user drags horizontally to rotate through a panoramic
 * scene. Hotspots are positioned on the panorama and reveal info when clicked.
 * Until real panorama images are wired in, the scene is rendered procedurally
 * with layered SVG silhouettes — yet still produces a wow effect.
 */
export default function VirtualTour({
  scene = 'registon',
  accent = '#d4a574',
  hotspots = [],
  onComplete,
  completeThreshold = 0.75,
}) {
  const trackRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [active, setActive] = useState(null);
  const [completed, setCompleted] = useState(false);
  const drag = useRef({ active: false, startX: 0, startOffset: 0 });
  const completedRef = useRef(false); // mirrors `completed` for the effect's closure

  const SCENE_WIDTH = 2400; // logical width
  const VIEW_WIDTH = 1200;

  useEffect(() => {
    const onUp = () => (drag.current.active = false);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  // Fire onComplete EXACTLY ONCE when the user has dragged through the
  // configured fraction of the panorama (default 75%). This is what the
  // detail page listens for to award the visit/points — preventing the
  // "I got 10 points for opening the page and immediately leaving" exploit.
  useEffect(() => {
    if (completedRef.current) return;
    const fraction = (-offset) / (SCENE_WIDTH - VIEW_WIDTH);
    if (fraction >= completeThreshold) {
      completedRef.current = true;
      setCompleted(true);
      onComplete?.();
    }
  }, [offset, completeThreshold, onComplete]);

  const onDown = (e) => {
    drag.current.active = true;
    drag.current.startX = e.touches ? e.touches[0].clientX : e.clientX;
    drag.current.startOffset = offset;
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - drag.current.startX;
    const next = Math.max(-(SCENE_WIDTH - VIEW_WIDTH), Math.min(0, drag.current.startOffset + dx));
    setOffset(next);
  };

  const auto = (dir) => {
    const next = Math.max(
      -(SCENE_WIDTH - VIEW_WIDTH),
      Math.min(0, offset + dir * 200),
    );
    setOffset(next);
  };

  const progress = ((-offset) / (SCENE_WIDTH - VIEW_WIDTH)) * 100;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onTouchStart={onDown}
        onTouchMove={onMove}
        className="relative w-full h-[55vh] min-h-[260px] sm:min-h-[420px] md:min-h-[480px] overflow-hidden border border-gold/30 rounded-sm cursor-grab active:cursor-grabbing select-none touch-pan-y"
        style={{
          background:
            'linear-gradient(180deg, #0a1f2e 0%, #0d2b3e 30%, #0f4c5c 60%, #0a1f2e 100%)',
          touchAction: 'pan-y',
        }}
      >
        {/* Stars (deep sky) */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-cream"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 60 + '%',
                opacity: 0.4 + Math.random() * 0.5,
                animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Distant moon */}
        <div className="absolute top-12 left-[30%] w-24 h-24 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle at 35% 35%, #f5ebd6, transparent 70%)' }} />

        {/* Scene scroller */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            width: SCENE_WIDTH + 'px',
            transform: `translateX(${offset}px)`,
            transition: drag.current.active ? 'none' : 'transform 0.6s var(--ease-out-expo)',
          }}
        >
          {/* Architectural panorama */}
          <svg
            viewBox="0 0 2400 600"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-full"
          >
            <defs>
              <linearGradient id="domeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
                <stop offset="100%" stopColor={accent} stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a1f2e" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0a1f2e" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Ulug'bek-like (left) */}
            <g>
              <rect x="100" y="350" width="380" height="250" fill="url(#bgGrad)" />
              <path d="M100,350 L100,300 L150,300 L160,260 L320,260 L330,300 L380,300 L380,350 Z" fill="url(#bgGrad)" />
              <ellipse cx="240" cy="240" rx="60" ry="50" fill="url(#domeGrad)" />
              <line x1="240" y1="190" x2="240" y2="160" stroke={accent} strokeWidth="3" />
              {/* Iwan portal */}
              <path d="M180 600 L180 420 Q240 360 300 420 L300 600 Z" fill="rgba(212,165,116,0.15)" stroke={accent} strokeWidth="1.5" />
              <path d="M200 600 L200 440 Q240 400 280 440 L280 600 Z" fill="rgba(212,165,116,0.05)" stroke={accent} strokeWidth="0.8" />
              {/* Side towers */}
              <rect x="110" y="280" width="30" height="320" fill="url(#bgGrad)" />
              <rect x="340" y="280" width="30" height="320" fill="url(#bgGrad)" />
              <circle cx="125" cy="280" r="15" fill={accent} fillOpacity="0.4" />
              <circle cx="355" cy="280" r="15" fill={accent} fillOpacity="0.4" />
            </g>

            {/* Tilla-Kori-like (center) */}
            <g>
              <rect x="800" y="320" width="500" height="280" fill="url(#bgGrad)" />
              <path d="M800,320 L800,280 L860,280 L880,220 L1220,220 L1240,280 L1300,280 L1300,320 Z" fill="url(#bgGrad)" />
              <ellipse cx="1050" cy="180" rx="80" ry="70" fill="url(#domeGrad)" />
              <line x1="1050" y1="110" x2="1050" y2="80" stroke={accent} strokeWidth="3" />
              <path d="M900 600 L900 380 Q1050 280 1200 380 L1200 600 Z" fill="rgba(212,165,116,0.18)" stroke={accent} strokeWidth="2" />
              <path d="M940 600 L940 410 Q1050 340 1160 410 L1160 600 Z" fill="rgba(212,165,116,0.08)" stroke={accent} strokeWidth="1" />
              {/* Towers */}
              <rect x="810" y="250" width="36" height="350" fill="url(#bgGrad)" />
              <rect x="1254" y="250" width="36" height="350" fill="url(#bgGrad)" />
              <circle cx="828" cy="250" r="18" fill={accent} fillOpacity="0.5" />
              <circle cx="1272" cy="250" r="18" fill={accent} fillOpacity="0.5" />
            </g>

            {/* Sherdor-like (right) */}
            <g>
              <rect x="1700" y="340" width="420" height="260" fill="url(#bgGrad)" />
              <path d="M1700,340 L1700,290 L1760,290 L1780,250 L2040,250 L2060,290 L2120,290 L2120,340 Z" fill="url(#bgGrad)" />
              <ellipse cx="1900" cy="220" rx="70" ry="60" fill="url(#domeGrad)" />
              <line x1="1900" y1="160" x2="1900" y2="130" stroke={accent} strokeWidth="3" />
              <path d="M1780 600 L1780 410 Q1900 330 2020 410 L2020 600 Z" fill="rgba(212,165,116,0.16)" stroke={accent} strokeWidth="1.5" />
              <rect x="1710" y="270" width="32" height="330" fill="url(#bgGrad)" />
              <rect x="2078" y="270" width="32" height="330" fill="url(#bgGrad)" />
              <circle cx="1726" cy="270" r="16" fill={accent} fillOpacity="0.4" />
              <circle cx="2094" cy="270" r="16" fill={accent} fillOpacity="0.4" />
            </g>

            {/* Floor / square */}
            <rect x="0" y="600" width="2400" height="0" fill="#0a1f2e" />
            <line x1="0" y1="500" x2="2400" y2="500" stroke="rgba(212,165,116,0.1)" strokeWidth="0.5" />
            <line x1="0" y1="540" x2="2400" y2="540" stroke="rgba(212,165,116,0.06)" strokeWidth="0.5" />
          </svg>

          {/* Hotspots */}
          {hotspots.map((h) => (
            <button
              key={h.id}
              onClick={(e) => {
                e.stopPropagation();
                setActive(h);
              }}
              className="absolute group/hot"
              style={{
                left: `${(h.x / 100) * SCENE_WIDTH}px`,
                top: `${h.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="block w-12 h-12 rounded-full border-2 border-gold bg-gold/20 backdrop-blur animate-pulse" />
              <span className="absolute inset-0 flex items-center justify-center w-12 h-12 text-gold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-full border border-gold/40 group-hover/hot:scale-125 transition-transform" />
              <span className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-cream text-xs tracking-[2px] uppercase opacity-0 group-hover/hot:opacity-100 transition">
                {h.label}
              </span>
            </button>
          ))}
        </div>

        {/* Foreground vignette */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,31,46,0.6) 100%)' }} />

        {/* Compass / instructions — flips to a "completed" badge once the
            user has explored enough to earn the visit points. */}
        <div className="absolute top-4 left-4 px-4 py-2 bg-bg-deep/70 border border-gold/30 rounded-full text-gold text-[11px] tracking-[2px] uppercase backdrop-blur flex items-center gap-2">
          {completed ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3 h-3">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>Sayohat tugadi</span>
            </>
          ) : (
            <>
              <span>↔ Suring · 360°</span>
              <span className="text-cream-soft/50 tabular-nums">
                {Math.round(progress)}%
              </span>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-bg-deep/80 border border-gold/30 rounded-full px-4 py-2 backdrop-blur">
          <button onClick={() => auto(1)} className="w-9 h-9 rounded-full text-gold border border-gold/50 hover:bg-gold hover:text-bg-deep transition">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="w-40 h-1 bg-gold/20 rounded-full overflow-hidden">
            <div className="h-full bg-gold transition-all" style={{ width: progress + '%' }} />
          </div>
          <button onClick={() => auto(-1)} className="w-9 h-9 rounded-full text-gold border border-gold/50 hover:bg-gold hover:text-bg-deep transition">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Active hotspot panel */}
      {active && (
        <div
          className="mt-6 p-6 border border-gold/30 bg-bg-mid/60 backdrop-blur rounded-sm relative animate-fade-in-up"
          style={{ animationDuration: '0.4s' }}
        >
          <button
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gold/40 text-gold/70 hover:text-gold hover:border-gold transition"
            aria-label="Yopish"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          </button>
          <div className="eyebrow text-xs mb-2">— HOTSPOT —</div>
          <h4 className="font-serif text-cream text-2xl md:text-3xl mb-3">{active.label}</h4>
          <p className="text-cream-soft/85 leading-relaxed">{active.info}</p>
        </div>
      )}
    </div>
  );
}
