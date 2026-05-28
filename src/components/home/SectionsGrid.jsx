import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    to: '/allomalar', title: 'Allomalar',
    icon: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M14 14 Q14 12 16 12 L32 12 Q34 12 34 14 L34 38 Q34 40 32 40 L16 40 Q14 40 14 38Z"/><circle cx="24" cy="23" r="5"/><path d="M17 34 Q24 29 31 34"/><path d="M24 6 L24 12"/></svg>,
  },
  {
    to: '/muzeylar', title: 'Muzeylar',
    icon: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 42 L42 42"/><path d="M9 42 L9 18 M39 42 L39 18"/><path d="M15 42 L15 21 M21 42 L21 21 M27 42 L27 21 M33 42 L33 21"/><path d="M6 18 L42 18 L24 6Z"/><circle cx="24" cy="14" r="1.5" fill="currentColor"/></svg>,
  },
  {
    to: '/musiqa', title: 'Musiqa',
    icon: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3"><ellipse cx="14" cy="37" rx="6" ry="4.5"/><ellipse cx="34" cy="34" rx="6" ry="4.5"/><path d="M20 37 L20 13 L40 9 L40 34"/><path d="M20 19 L40 15"/></svg>,
  },
  {
    to: '/kinolar', title: 'Kinolar',
    icon: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="6" y="10" width="36" height="28" rx="2"/><circle cx="10" cy="15" r="1.5"/><circle cx="16" cy="15" r="1.5"/><circle cx="10" cy="33" r="1.5"/><circle cx="16" cy="33" r="1.5"/><circle cx="32" cy="15" r="1.5"/><circle cx="38" cy="15" r="1.5"/><circle cx="32" cy="33" r="1.5"/><circle cx="38" cy="33" r="1.5"/><path d="M21 19 L21 29 L30 24Z" fill="currentColor"/></svg>,
  },
  {
    to: '/kitoblar', title: 'Kitoblar',
    icon: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 9 L6 39 Q24 34 42 39 L42 9 Q24 15 6 9Z"/><path d="M24 14 L24 38"/><path d="M10 17 L20 19 M10 22 L20 24 M10 27 L20 29"/><path d="M28 19 L38 17 M28 24 L38 22 M28 29 L38 27"/></svg>,
  },
  {
    to: '/profil', title: 'Mening Ziyom',
    icon: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M24 6 L27 18 L39 18 L30 25.5 L33 37.5 L24 30 L15 37.5 L18 25.5 L9 18 L21 18Z"/><circle cx="24" cy="24" r="2.5" fill="currentColor"/></svg>,
  },
  {
    to: '/oyinlar', title: "O'yinlar",
    icon: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="6" y="15" width="36" height="22" rx="3"/><path d="M18 26 L14 26 M16 24 L16 28" strokeLinecap="round" strokeWidth="1.8"/><circle cx="30" cy="25" r="1.2" fill="currentColor"/><circle cx="34" cy="28" r="1.2" fill="currentColor"/><path d="M21 9 L27 9 L28.5 15 L19.5 15Z"/></svg>,
  },
];



export default function SectionsGrid() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        marginLeft: '-50vw',
        marginBottom: '6rem',
        background: '#18100a',
      }}
    >
      {/* Top cornice */}
      <div style={{
        height: '20px',
        background: 'linear-gradient(to bottom, #0c0804, #1c1008)',
        borderBottom: '2.5px solid rgba(212,165,116,0.4)',
      }} />

      {/* Horizontal snap scroll — fixed height so it reads as a strip, not a layout */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        gap: '8px',
        padding: '8px',
        height: '80vh',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {SECTIONS.map((s, i) => (
          <Link
            key={s.to}
            to={s.to}
            className="group section-card"
            style={{
              scrollSnapAlign: 'start',
              flexShrink: 0,
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              background: 'transparent',
              overflow: 'hidden',
            }}
          >
            {/* Scroll parchment */}
            <img
              src="/scroll.png"
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: 'scaleX(1.2)',
                transformOrigin: 'center center',
                pointerEvents: 'none',
              }}
            />

            {/* Hover warm glow over parchment */}
            <div aria-hidden="true" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,140,40,0.18), transparent)',
              pointerEvents: 'none',
            }} />

            {/* Content sits on the parchment body — below roller (top ~20%), above torn edge (bottom ~15%) */}
            <div className="relative z-10 flex flex-col items-center text-center px-3"
              style={{ marginTop: '15%', marginBottom: '20%' }}
            >
              <div
                className="mb-3 transition-all duration-400 group-hover:scale-110"
                style={{
                  width: 'clamp(42px, 5vw, 60px)',
                  height: 'clamp(42px, 5vw, 60px)',
                  color: 'rgba(55,25,5,1)',
                  filter: 'drop-shadow(0 1px 4px rgba(180,120,40,0.5))',
                }}
              >
                {s.icon}
              </div>
              <h3
                className="font-serif transition-colors duration-300 group-hover:text-gold"
                style={{
                  fontSize: 'clamp(18px, 2.2vw, 26px)',
                  fontWeight: '700',
                  color: 'rgba(45,18,3,1)',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 3px rgba(255,220,150,0.5)',
                  margin: 0,
                  lineHeight: 1.3,
                  whiteSpace: 'normal',
                  overflowWrap: 'break-word',
                  wordBreak: 'normal',
                  width: '220px',
                }}
              >
                {s.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom cornice */}
      <div style={{
        height: '20px',
        background: 'linear-gradient(to top, #0c0804, #1c1008)',
        borderTop: '2.5px solid rgba(212,165,116,0.4)',
      }} />

      <style>{`
        .section-card { width: 410px; }
        @media (max-width: 640px) { .section-card { width: 300px; } }
        .section-card::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
