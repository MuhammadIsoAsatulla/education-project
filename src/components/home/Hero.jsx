import StarsLayer from '../common/StarsLayer.jsx';
import RegistanSilhouette from '../common/RegistanSilhouette.jsx';

export default function Hero() {
  return (
    <section
      className="relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center bottom, var(--teal) 0%, var(--bg-deep) 70%)' }}
    >
      <StarsLayer count={90} />

      {/* Decorative top hairline with star accents */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-4/5 max-w-[800px]">
        <div className="hairline opacity-40" />
        <span className="absolute -top-3 left-[18%] text-gold text-base">✦</span>
        <span className="absolute -top-3 right-[18%] text-gold text-base">✦</span>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 mb-16 sm:mb-20">
        <div
          className="font-amiri text-gold tracking-[4px] sm:tracking-[8px] text-xs sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          — RAQAMLI MEROS PLATFORMASI —
        </div>

        <h1
          className="font-serif font-medium text-gold-gradient mb-6 sm:mb-8 leading-[0.9] opacity-0 animate-hero-title hero-title-letters"
          style={{
            fontSize: 'clamp(64px, 18vw, 180px)',
            textShadow: '0 4px 20px rgba(212, 165, 116, 0.3)',
          }}
        >
          MEROS
        </h1>

        <p
          className="font-serif italic text-cream-soft font-light max-w-2xl mx-auto mb-8 sm:mb-12 opacity-0 animate-fade-in-up px-2"
          style={{ fontSize: 'clamp(16px, 2.5vw, 26px)', animationDelay: '1.2s' }}
        >
          Asrlar sadosi — kelajak ovozi.
          <br />
          O‘zbek xalqining ma’naviy xazinasi bir joyda.
        </p>

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

      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 z-10 text-gold text-[10px] sm:text-[11px] tracking-[3px] uppercase text-center opacity-0"
        style={{
          transform: 'translateX(-50%)',
          animation: 'fadeInUpCenter 1s ease 2s forwards, bounceY 2s ease infinite 3s',
        }}
      >
        Pastga Suring
        <span className="block w-px h-8 sm:h-10 bg-gold mx-auto mt-2 sm:mt-3" />
      </div>

      <style>{`
        .hero-title-letters {
          letter-spacing: 6px;
        }
        @media (min-width: 640px) {
          .hero-title-letters { letter-spacing: 12px; }
        }
      `}</style>
    </section>
  );
}
