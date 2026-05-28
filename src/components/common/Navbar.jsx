import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const LINKS = [
  { to: '/allomalar', label: 'Allomalar' },
  { to: '/muzeylar', label: 'Muzeylar' },
  { to: '/musiqa', label: 'Musiqa' },
  { to: '/kinolar', label: 'Kinolar' },
  { to: '/kitoblar', label: 'Kitoblar' },
  { to: '/oyinlar', label: "O'yinlar" },
  { to: '/dokon', label: "Do'kon" },
  { to: '/profil', label: 'Profil' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, openAuth } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? 'bg-bg-deep/95 border-b border-gold/20 py-3 px-4 sm:px-6 md:px-12 backdrop-blur'
          : 'py-4 sm:py-5 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-bg-deep/90 to-transparent backdrop-blur-sm'
      }`}
    >
      <Link to="/" className="flex items-center gap-2 sm:gap-3 text-gold font-serif font-semibold tracking-[3px] sm:tracking-[4px] text-lg sm:text-2xl">
        <span className="w-6 h-6 sm:w-8 sm:h-8 inline-block">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="16" cy="16" r="14" />
              <path d="M16 2 L16 30 M2 16 L30 16 M6 6 L26 26 M26 6 L6 26" />
              <circle cx="16" cy="16" r="6" />
            </g>
          </svg>
        </span>
        MEROS
      </Link>

      <ul className="hidden md:flex gap-8 list-none m-0 p-0">
        {LINKS.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              className={({ isActive }) =>
                `relative uppercase text-[12px] font-semibold tracking-[1.8px] transition-colors duration-300 nav-underline ${
                  isActive ? 'text-gold' : 'text-cream hover:text-gold'
                }`
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Auth indicator — desktop only */}
      {!user && (
        <button
          onClick={openAuth}
          className="hidden md:flex items-center gap-2 text-[11px] tracking-[2px] font-semibold uppercase text-gold hover:text-cream transition-colors duration-200 nav-underline"
        >
          Kirish
        </button>
      )}

      <button
        className="md:hidden text-gold p-2"
        onClick={() => setOpen((o) => !o)}
        aria-label="menu"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {open ? (
            <path d="M6 6 L18 18 M18 6 L6 18" />
          ) : (
            <path d="M3 7h18M3 12h18M3 17h18" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-bg-deep/98 border-t border-gold/20 backdrop-blur md:hidden">
          <ul className="flex flex-col p-6 gap-4">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `block py-2 uppercase text-sm tracking-[2px] ${
                      isActive ? 'text-gold' : 'text-cream'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .nav-underline::after {
          content: '';
          position: absolute;
          left: 0; bottom: -6px;
          width: 0; height: 1px;
          background: var(--gold);
          transition: width 0.3s ease;
        }
        .nav-underline:hover::after { width: 100%; }
      `}</style>
    </nav>
  );
}
