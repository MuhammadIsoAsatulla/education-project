import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import OrnamentDivider from './OrnamentDivider.jsx';
import GlobalSearch from './GlobalSearch.jsx';
import useAuth from '../../hooks/useAuth.js';

const ICONS = {
  allomalar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Graduation cap (mortarboard) — universal scholar/wisdom symbol */}
      <path d="M2 10l10-4 10 4-10 4-10-4z" />
      <path d="M6 12v4c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-4" />
      <path d="M22 10v6" />
      <circle cx="22" cy="17" r="0.9" fill="currentColor" />
    </svg>
  ),
  jadidlar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* Newspaper — the Jadids' main reform vehicle (Oyna, Sadoyi Turkiston). */}
      <rect x="3" y="5" width="18" height="15" rx="1" />
      <path d="M3 9 L21 9" />
      <path d="M6 12 L11 12" />
      <path d="M6 15 L11 15" />
      <path d="M6 18 L10 18" />
      <rect x="13" y="11" width="6" height="6" rx="0.5" />
    </svg>
  ),
  muzeylar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* Pavilion with dome and columns */}
      <path d="M3 21h18" />
      <path d="M5 21V11M19 21V11" />
      <path d="M9 21v-8M12 21v-8M15 21v-8" />
      <path d="M4 11h16" />
      <path d="M4 11l8-7 8 7" />
      <path d="M10 6c0-1.1.9-2 2-2s2 .9 2 2" />
      <circle cx="12" cy="3" r="0.6" fill="currentColor" />
    </svg>
  ),
  musiqa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* Two musical notes */}
      <path d="M9 17V6l10-2v11" />
      <ellipse cx="7" cy="17" rx="2.2" ry="1.8" />
      <ellipse cx="17" cy="15" rx="2.2" ry="1.8" />
      <path d="M9 8l10-2" />
    </svg>
  ),
  kinolar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* Film reel / clapper */}
      <rect x="3" y="7" width="18" height="13" rx="1" />
      <circle cx="7" cy="11" r="0.8" fill="currentColor" />
      <circle cx="12" cy="11" r="0.8" fill="currentColor" />
      <circle cx="17" cy="11" r="0.8" fill="currentColor" />
      <path d="M3 7l2-3h3l-2 3M9 7l2-3h3l-2 3M15 7l2-3h3l-2 3" />
      <path d="M10 14l4 2.5L10 19v-5z" fill="currentColor" />
    </svg>
  ),
  kitoblar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* Open book */}
      <path d="M3 5c4 0 6 1 9 3 3-2 5-3 9-3v14c-4 0-6 1-9 3-3-2-5-3-9-3V5z" />
      <path d="M12 8v14" />
      <path d="M6 9c1.5 0 2.5.5 4 1M6 12c1.5 0 2.5.5 4 1M14 10c1.5-.5 2.5-1 4-1M14 13c1.5-.5 2.5-1 4-1" />
    </svg>
  ),
  profil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* User with crown/laurel — gamified identity */}
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <path d="M9 5l1 1.5L12 5l2 1.5L15 5" />
    </svg>
  ),
};

const LINKS = [
  { to: '/allomalar', label: 'Allomalar', sub: 'Buyuk Aql Sohiblari', icon: ICONS.allomalar },
  { to: '/jadidlar', label: 'Jadidlar', sub: "Milliy Uyg'onish", icon: ICONS.jadidlar },
  { to: '/muzeylar', label: 'Muzeylar', sub: 'Virtual Sayohat', icon: ICONS.muzeylar },
  { to: '/musiqa', label: 'Musiqa', sub: 'Maqom va Karaoke', icon: ICONS.musiqa },
  { to: '/kinolar', label: 'Kinolar', sub: 'Klassik Asarlar', icon: ICONS.kinolar },
  { to: '/kitoblar', label: 'Kitoblar', sub: "Donolik Bog'i", icon: ICONS.kitoblar },
  { to: '/profil', label: 'Profil', sub: 'Mening Ziyom', icon: ICONS.profil },
];

function AuthBadge({ onNavigate }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, [open]);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        onClick={onNavigate}
        className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/50 hover:bg-gold hover:text-bg-deep text-gold rounded-full text-[11px] tracking-[2px] uppercase transition"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
        </svg>
        Kirish
      </Link>
    );
  }

  const initial = (user.name || 'M').trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 group focus:outline-none"
        aria-label="Hisob menyusi"
        aria-expanded={open}
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-gold/60 object-cover group-hover:border-gold transition"
          />
        ) : (
          <span className="w-8 h-8 rounded-full border border-gold/60 bg-bg-deep/60 flex items-center justify-center text-gold font-serif text-sm group-hover:border-gold transition">
            {initial}
          </span>
        )}
        <span className="hidden lg:inline text-cream text-xs tracking-wide max-w-[110px] truncate">
          {user.name}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`w-3 h-3 text-gold/60 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-sm border border-gold/30 bg-bg-deep/95 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
          <div className="p-3 border-b border-gold/15 flex items-center gap-3">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-gold/40 object-cover flex-shrink-0"
              />
            ) : (
              <span className="w-10 h-10 rounded-full border border-gold/40 bg-bg-mid/60 flex items-center justify-center text-gold font-serif flex-shrink-0">
                {initial}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-serif text-cream text-sm leading-tight truncate">{user.name}</p>
              {user.email && (
                <p className="text-cream-soft/50 text-[10px] truncate mt-0.5">{user.email}</p>
              )}
              <p className="text-gold/60 text-[9px] tracking-[2px] uppercase mt-0.5">
                {user.provider === 'google' ? '— Google —' : '— Mehmon —'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              navigate('/profil');
            }}
            className="w-full text-left px-4 py-2.5 text-cream-soft hover:bg-bg-mid/40 hover:text-gold text-xs tracking-[2px] uppercase transition flex items-center gap-3"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4">
              <circle cx="12" cy="9" r="3.5" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
            </svg>
            Profilim
          </button>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
              navigate('/');
            }}
            className="w-full text-left px-4 py-2.5 text-cream-soft/70 hover:bg-crimson/10 hover:text-crimson text-xs tracking-[2px] uppercase transition border-t border-gold/10 flex items-center gap-3"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Chiqish
          </button>
        </div>
      )}
    </div>
  );
}

function MobileAuthBlock({ onClose }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        onClick={onClose}
        className="mb-6 flex items-center justify-center gap-3 p-3 sm:p-4 border border-gold/50 rounded-sm bg-gold/10 text-gold tracking-[3px] uppercase hover:bg-gold hover:text-bg-deep transition text-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
        </svg>
        Kirish
      </Link>
    );
  }

  const initial = (user.name || 'M').trim().charAt(0).toUpperCase();

  return (
    <div className="mb-6 p-3 sm:p-4 border border-gold/25 rounded-sm bg-bg-mid/40 backdrop-blur flex items-center gap-3">
      {user.picture ? (
        <img
          src={user.picture}
          alt={user.name}
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-full border border-gold/40 object-cover flex-shrink-0"
        />
      ) : (
        <span className="w-12 h-12 rounded-full border border-gold/40 bg-bg-deep/60 flex items-center justify-center text-gold font-serif text-lg flex-shrink-0">
          {initial}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-serif text-cream text-base leading-tight truncate">{user.name}</p>
        {user.email && (
          <p className="text-cream-soft/50 text-[10px] truncate mt-0.5">{user.email}</p>
        )}
        <p className="text-gold/60 text-[9px] tracking-[2px] uppercase mt-0.5">
          {user.provider === 'google' ? '— Google —' : '— Mehmon —'}
        </p>
      </div>
      <button
        onClick={() => {
          signOut();
          onClose?.();
          navigate('/');
        }}
        className="text-cream-soft/70 hover:text-crimson text-[10px] tracking-[2px] uppercase transition flex-shrink-0"
        aria-label="Chiqish"
        title="Chiqish"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
      </button>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Cmd/Ctrl+Q opens the global search from anywhere.
  // "Q" = "Qidirish" in Uzbek — easier to recall than the conventional "K".
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'py-3 px-4 sm:px-6 md:px-12 shadow-[0_4px_30px_rgba(0,0,0,0.4)] bg-bg-deep/95 backdrop-blur-md border-b border-gold/20'
            : 'py-4 sm:py-5 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-bg-deep/90 via-bg-deep/55 to-transparent backdrop-blur-sm'
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 text-gold font-serif font-semibold tracking-[3px] sm:tracking-[4px] text-lg sm:text-2xl"
        >
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

        <div className="hidden lg:flex items-center gap-4 lg:gap-6">
          <ul className="flex gap-5 lg:gap-7 list-none m-0 p-0">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `relative inline-flex items-center gap-2 uppercase text-[12px] font-semibold tracking-[1.8px] transition-colors duration-300 nav-underline ${
                      isActive ? 'text-gold' : 'text-cream hover:text-gold'
                    }`
                  }
                >
                  <span className="w-4 h-4 inline-block flex-shrink-0 transition-transform group-hover:scale-110">
                    {l.icon}
                  </span>
                  <span>{l.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Global search trigger (desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Saytbo'ylab qidirish"
            title="Qidirish (Ctrl+Q)"
            className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 border border-gold/30 hover:border-gold/70 text-cream-soft hover:text-gold rounded-full text-[11px] tracking-[1.5px] uppercase transition group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="hidden lg:inline">Qidirish</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[9px] tracking-[0.5px] text-cream-soft/50 border border-gold/20 rounded">
              Ctrl Q
            </kbd>
          </button>

          <AuthBadge />
        </div>

        {/* Mobile + tablet portrait right-side controls: search + burger.
            Desktop nav with all 7 sections only renders at ≥1024 (lg:);
            on 640–1023 px (iPad portrait) the section links would crash
            into the MEROS brand, so we use the hamburger drawer instead. */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Qidirish"
            className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-gold border border-gold/40 rounded-full bg-bg-deep/60 backdrop-blur transition hover:border-gold"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <button
            className="relative w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-gold border border-gold/40 rounded-full bg-bg-deep/60 backdrop-blur transition hover:border-gold"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Yopish' : 'Menyu'}
            aria-expanded={open}
          >
          {/* Animated hamburger / X */}
          <span className="block w-4 h-3 relative">
            <span
              className={`absolute left-0 right-0 h-px bg-gold transition-all duration-300 ${
                open ? 'top-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-1/2 h-px bg-gold transition-all duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-px bg-gold transition-all duration-300 ${
                open ? 'top-1/2 -rotate-45' : 'bottom-0'
              }`}
            />
          </span>
          </button>
        </div>

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

      {/* Full-screen mobile + tablet-portrait menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[150] transition-all duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        {/* Solid gradient background */}
        <div
          className="absolute inset-0 bg-bg-deep"
          style={{
            background:
              'radial-gradient(ellipse at top, #0d2b3e 0%, #0a1f2e 60%, #051018 100%)',
          }}
        />
        {/* Decorative pattern */}
        <div className="absolute inset-0 bg-girih opacity-40 pointer-events-none" />
        {/* Spotlight glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 hidden sm:block w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.18), transparent 65%)' }}
        />
        {/* Twinkling stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-cream"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                opacity: 0.3 + Math.random() * 0.5,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Top bar: logo + close */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-gold/15">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-gold font-serif font-semibold tracking-[3px] text-lg"
          >
            <span className="w-6 h-6 inline-block">
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
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-full border border-gold/40 text-gold flex items-center justify-center bg-bg-deep/60 backdrop-blur hover:bg-gold hover:text-bg-deep transition"
            aria-label="Yopish"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path d="M6 6L18 18M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Menu content */}
        <div className="relative z-10 h-[calc(100%-72px)] flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:py-10">
            <MobileAuthBlock onClose={() => setOpen(false)} />

            <div className="text-center mb-6 sm:mb-8">
              <OrnamentDivider className="opacity-50 mb-4" />
              <div className="eyebrow text-[10px]">— YETTI HAZINA —</div>
            </div>

            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <li
                  key={l.to}
                  style={{
                    animation: open
                      ? `slideInLeft 0.5s ease ${0.1 + i * 0.06}s both`
                      : 'none',
                  }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group block px-4 py-3 rounded-sm border transition-all ${
                        isActive
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-gold/15 hover:border-gold/60 text-cream hover:bg-bg-mid/40'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Icon (left of text) */}
                        <div
                          className={`w-11 h-11 rounded-sm border flex items-center justify-center flex-shrink-0 transition ${
                            isActive
                              ? 'border-gold/60 bg-gold/15 text-gold'
                              : 'border-gold/25 bg-bg-deep/40 text-gold/80 group-hover:text-gold group-hover:border-gold/60'
                          }`}
                        >
                          <span className="w-5 h-5 inline-block">{l.icon}</span>
                        </div>

                        {/* Title + subtitle */}
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-2xl tracking-[2px] leading-tight">
                            {l.label}
                          </div>
                          <div
                            className={`font-amiri text-[10px] tracking-[3px] uppercase mt-0.5 ${
                              isActive ? 'text-gold/80' : 'text-cream-soft/60'
                            }`}
                          >
                            — {l.sub} —
                          </div>
                        </div>

                        {/* Arrow */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`w-4 h-4 flex-shrink-0 transition-transform ${
                            isActive
                              ? 'text-gold translate-x-1'
                              : 'text-gold/40 group-hover:text-gold group-hover:translate-x-1'
                          }`}
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="text-center mt-8">
              <OrnamentDivider className="opacity-50" />
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 px-6 py-4 border-t border-gold/15 text-center">
            <p className="font-serif italic text-gold/60 text-sm">
              “O‘tmishini bilmagan — kelajakka eshikni topa olmaydi.”
            </p>
            <p className="text-cream-soft/40 text-[10px] tracking-[3px] mt-1">— MEROS © 2026 —</p>
          </div>
        </div>

        <style>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-24px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>

      {/* Site-wide search overlay — opens from the navbar search button or
          via the Ctrl/Cmd+K keyboard shortcut. */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
