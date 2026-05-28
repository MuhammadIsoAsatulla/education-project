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
      className="relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden"
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

      {/* Crescent moon */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '11%',
          right: '14%',
          zIndex: 3,
        }}
      >
        {/* glow halo */}
        <div
          style={{
            position: 'absolute',
            inset: '-28px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(212,165,116,0.13) 0%, transparent 70%)',
          }}
        />
        {/* crescent shape via inset box-shadow */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 38% 35%, rgba(245,220,165,0.35), rgba(212,165,116,0.12))',
            boxShadow:
              'inset -14px 5px 0 rgba(3,13,24,0.97), 0 0 20px 6px rgba(212,165,116,0.08)',
          }}
        />
      </div>


      {/* Amber glow orb behind the MEROS title */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '900px',
          height: '700px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -54%)',
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(212,165,116,0.12) 0%, rgba(212,165,116,0.05) 42%, transparent 68%)',
          zIndex: 0,
        }}
      />

      {/* Top ornamental hairline */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-4/5 max-w-[800px] z-10">
        <div
          style={{
            height: '1px',
            background:
              'linear-gradient(to right, transparent, rgba(212,165,116,0.55), transparent)',
          }}
        />
        <span className="absolute -top-3 left-[18%] text-gold text-base" style={{ textShadow: '0 0 12px rgba(212,165,116,0.6)' }}>✦</span>
        <span className="absolute -top-3 right-[18%] text-gold text-base" style={{ textShadow: '0 0 12px rgba(212,165,116,0.6)' }}>✦</span>
        {/* secondary inner lines */}
        <span
          className="absolute -top-[1px] left-[22%] right-[22%] block"
          style={{
            height: '1px',
            background:
              'linear-gradient(to right, transparent, rgba(212,165,116,0.2), transparent)',
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 sm:px-6 mb-16 sm:mb-20">
        {/* Eyebrow */}
        <div
          className="font-amiri text-gold tracking-[4px] sm:tracking-[8px] text-xs sm:text-base lg:text-lg mb-5 sm:mb-7 opacity-0 animate-fade-in-up"
          style={{
            animationDelay: '0.3s',
            textShadow: '0 0 20px rgba(212,165,116,0.4)',
          }}
        >
          — RAQAMLI MEROS PLATFORMASI —
        </div>

        {/* Title */}
        <h1
          className="font-serif font-medium text-gold-gradient mb-0 leading-[0.9] opacity-0 animate-hero-title hero-title-letters"
          style={{
            fontSize: 'clamp(64px, 18vw, 180px)',
            textShadow:
              '0 0 120px rgba(212,165,116,0.55), 0 0 40px rgba(212,165,116,0.35), 0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          MEROS
        </h1>


        {/* Subtitle */}
        <p
          className="font-serif italic text-cream font-light max-w-2xl mx-auto mb-8 sm:mb-12 opacity-0 animate-fade-in-up px-2"
          style={{
            fontSize: 'clamp(16px, 2.5vw, 26px)',
            animationDelay: '1.2s',
            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            lineHeight: 1.7,
          }}
        >
          Asrlar sadosi — kelajak ovozi.
          <br />
          O'zbek xalqining ma'naviy xazinasi bir joyda.
        </p>

        {/* CTA */}
        <a
          href="#bolimlar"
          className="gold-cta opacity-0 animate-fade-in-up"
          style={{ animationDelay: '1.5s' }}
        >
          <span>Sayohatni Boshlash</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>


      <RegistanSilhouette />

      {/* Bottom page-background bleed — seamless transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, #0c0804)',
          zIndex: 5,
        }}
      />

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 z-20 flex flex-col items-center opacity-0"
        style={{
          transform: 'translateX(-50%)',
          animation: 'fadeIn 1s ease 2.5s forwards',
        }}
      >
        <span
          className="text-gold mb-3"
          style={{ fontSize: '8px', letterSpacing: '6px', textTransform: 'uppercase', opacity: 0.45 }}
        >
          Pastga
        </span>
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="22"
            height="13"
            viewBox="0 0 22 13"
            fill="none"
            style={{
              marginTop: i === 0 ? '0' : '-4px',
              animation: `chevronFade 2s ease-in-out ${i * 0.3}s infinite`,
              opacity: 0,
            }}
          >
            <path
              d="M1 1L11 11L21 1"
              stroke="rgba(212,165,116,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>

      <style>{`
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
