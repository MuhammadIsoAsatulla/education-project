import StarsLayer from '../common/StarsLayer.jsx';
import RegistanSilhouette from '../common/RegistanSilhouette.jsx';

/* Scattered feature stars — larger, gold-tinted sparkles */
const FEATURE_STARS = [
  { top: '7%',  left: '9%',  size: 3.5, delay: 0.2, gold: true  },
  { top: '14%', left: '72%', size: 4,   delay: 1.1, gold: false },
  { top: '28%', left: '88%', size: 3,   delay: 0.7, gold: true  },
  { top: '19%', left: '40%', size: 2.5, delay: 1.8, gold: false },
  { top: '38%', left: '5%',  size: 3,   delay: 0.4, gold: true  },
  { top: '42%', left: '93%', size: 2.5, delay: 1.5, gold: false },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-[100svh] flex flex-col justify-start items-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 150% 90% at 50% 114%, rgba(155,90,20,0.32) 0%, #0a2d40 14%, #071a2e 36%, #040f1c 60%, #030a14 100%)',
      }}
    >
      {/* Stars */}
      <StarsLayer count={130} />

      {/* Feature sparkle stars — gold-tinted, larger */}
      {FEATURE_STARS.map((s, i) => (
        <span
          key={i}
          className="absolute pointer-events-none rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: s.size + 'px',
            height: s.size + 'px',
            background: s.gold
              ? 'rgba(212,165,116,0.9)'
              : 'rgba(245,235,210,0.85)',
            boxShadow: s.gold
              ? `0 0 ${s.size * 5}px ${s.size * 2.5}px rgba(212,165,116,0.35)`
              : `0 0 ${s.size * 4}px ${s.size * 2}px rgba(245,235,210,0.2)`,
            animation: `twinkle ${2.2 + i * 0.45}s ease-in-out ${s.delay}s infinite`,
            zIndex: 2,
          }}
        />
      ))}

      {/* Amber glow orb behind the MEROS title */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '900px',
          height: '700px',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(212,165,116,0.12) 0%, rgba(212,165,116,0.05) 42%, transparent 68%)',
          zIndex: 0,
        }}
      />

      {/* Frosted focus — softly blurs the busy building ONLY behind the text.
          The radial mask feathers the edges so there is no visible panel. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          backdropFilter: 'blur(3.2px)',
          WebkitBackdropFilter: 'blur(3.2px)',
          WebkitMaskImage:
            'radial-gradient(ellipse 58% 42% at 50% 38%, #000 0%, #000 42%, transparent 76%)',
          maskImage:
            'radial-gradient(ellipse 58% 42% at 50% 38%, #000 0%, #000 42%, transparent 76%)',
        }}
      />

      {/* Local contrast — feathered darkening centered behind the title & subtitle
          (lightest at the edges so the mosque keeps its glow) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background:
            'radial-gradient(ellipse 72% 50% at 50% 38%, rgba(3,9,18,0.46) 0%, rgba(3,9,18,0.30) 40%, rgba(3,9,18,0.12) 64%, transparent 82%)',
        }}
      />

      {/* Top ornamental divider — connects both sides of the page */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-[1150px] z-10">
        <div
          style={{
            height: '1px',
            background:
              'linear-gradient(to right, transparent, rgba(214,164,74,0.4) 18%, rgba(214,164,74,0.4) 82%, transparent)',
          }}
        />
        <span className="absolute -top-3 left-[15%] text-gold text-base" style={{ textShadow: '0 0 16px rgba(214,164,74,0.9)' }}>✦</span>
        <span className="absolute -top-3 right-[15%] text-gold text-base" style={{ textShadow: '0 0 16px rgba(214,164,74,0.9)' }}>✦</span>
      </div>

      {/* Hero content — title floats high above the architecture */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 pt-[12vh] sm:pt-[13vh]">
        {/* Eyebrow */}
        <div
          className="font-amiri text-gold tracking-[4px] sm:tracking-[8px] text-xs sm:text-base lg:text-lg opacity-0 animate-fade-in-up"
          style={{
            animationDelay: '0.3s',
            textShadow: '0 0 20px rgba(212,165,116,0.4)',
          }}
        >
          — RAQAMLI MEROS PLATFORMASI —
        </div>

        {/* Title */}
        <h1
          className="font-serif font-medium hero-meros mb-0 leading-[0.9] opacity-0 animate-hero-title hero-title-letters"
          style={{
            fontSize: 'clamp(88px, 12vw, 260px)',
            marginTop: '40px',
            WebkitTextStroke: '0.5px rgba(30,22,8,0.28)',
            textShadow:
              '0 2px 6px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.5), 0 0 26px rgba(255,228,140,0.55), 0 0 60px rgba(255,210,90,0.30)',
          }}
        >
          MEROS
        </h1>

        {/* Subtitle — sits in open air beneath the title */}
        <p
          className="font-serif italic text-cream font-medium max-w-2xl mx-auto opacity-0 animate-fade-in-up px-2"
          style={{
            fontSize: 'clamp(16px, 2.5vw, 26px)',
            animationDelay: '1.2s',
            textShadow: '0 1px 2px rgba(0,0,0,0.75), 0 2px 14px rgba(0,0,0,0.65)',
            lineHeight: 1.7,
            marginTop: '30px',
            letterSpacing: '0.015em',
          }}
        >
          Asrlar sadosi — kelajak ovozi.
          <br />
          O'zbek xalqining ma'naviy xazinasi bir joyda.
        </p>

        {/* CTA */}
        <a
          href="#bolimlar"
          className="hero-cta opacity-0 animate-fade-in-up"
          style={{ animationDelay: '1.5s', marginTop: '38px' }}
        >
          <span>Sayohatni Boshlash</span>
        </a>
      </div>

      <RegistanSilhouette />

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 z-20 flex flex-col items-center opacity-0"
        style={{
          transform: 'translateX(-50%)',
          animation: 'fadeIn 1s ease 2.5s forwards',
        }}
      >
        <span
          className="mb-3"
          style={{
            fontSize: '9px',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: '#fdf3df',
            opacity: 0.9,
            fontWeight: 600,
            textShadow: '0 1px 5px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)',
          }}
        >
          Pastga
        </span>
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="24"
            height="14"
            viewBox="0 0 22 13"
            fill="none"
            style={{
              marginTop: i === 0 ? '0' : '-4px',
              animation: `chevronFade 2s ease-in-out ${i * 0.3}s infinite`,
              opacity: 0,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.85))',
            }}
          >
            <path
              d="M1 1L11 11L21 1"
              stroke="rgba(255,248,232,0.95)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>

      <style>{`
        /* MEROS word — luxe gold gradient with a soft glow */
        .hero-meros {
          background: linear-gradient(180deg, #fff7d4 0%, #ffea90 44%, #ffd95e 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        /* Hero CTA — glassy gold outline button */
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 16px 38px;
          border: 1px solid rgba(214,164,74,0.85);
          color: #f2d293;
          background: rgba(6,12,20,0.38);
          text-shadow: 0 1px 3px rgba(0,0,0,0.75);
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
        }
        .hero-cta:hover {
          background: rgba(214,164,74,0.16);
          border-color: rgba(214,164,74,1);
          color: #ffe7b0;
        }
        .hero-title-letters { letter-spacing: 6px; }
        @media (min-width: 640px) {
          .hero-title-letters { letter-spacing: 16px; }
        }
        @keyframes chevronFade {
          0% { opacity: 0; transform: translateY(-6px); }
          35% { opacity: 0.85; transform: translateY(0); }
          75% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 0; transform: translateY(6px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
