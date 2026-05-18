import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import useAuth from '../hooks/useAuth.js';
import useProgress from '../hooks/useProgress.js';

// Inline Google "G" logo SVG (multi-color) used inside the styled button.
function GoogleLogo({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5 0 9.5-1.9 12.9-5l-6-5.1c-2 1.4-4.4 2.1-6.9 2.1-5.2 0-9.7-3.3-11.3-8L6.2 33C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6 5.1C40 35.5 44 30 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    authReady,
    firebaseConfigured,
    signInWithGoogle,
    signInAsGuest,
  } = useAuth();
  const { state: progressState, setName: setProgressName } = useProgress();
  const [errorMsg, setErrorMsg] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  // Where to redirect after sign-in (?next=/somewhere)
  const nextPath = new URLSearchParams(location.search).get('next') || '/';

  // Already authenticated? Go straight to the destination.
  useEffect(() => {
    if (user) navigate(nextPath, { replace: true });
  }, [user, navigate, nextPath]);

  const handleGoogle = async () => {
    setErrorMsg(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // `onAuthStateChanged` will set the user; the redirect effect above does the navigate.
    } catch (err) {
      // Common codes: auth/popup-closed-by-user (user cancelled), auth/popup-blocked
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMsg("Kirish bekor qilindi.");
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg("Brauzer popup'ni bloklab qo'ydi. Ruxsat bering va qaytadan urining.");
      } else {
        setErrorMsg(err?.message || "Kirishda kutilmagan xato yuz berdi.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleGuest = (e) => {
    e?.preventDefault?.();
    const trimmed = guestName.trim();
    const authUser = signInAsGuest(trimmed || 'Mehmon');
    // Sync the chosen guest name into the local profile too, but never clobber
    // an already-set custom name.
    if (trimmed && (!progressState.name || progressState.name === 'Mehmon')) {
      setProgressName(trimmed);
    }
    if (authUser) navigate(nextPath, { replace: true });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-girih opacity-30 pointer-events-none" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,165,116,0.25), transparent 60%)',
        }}
      />
      {/* Twinkling stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-cream"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: 0.2 + Math.random() * 0.5,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-3 text-gold font-serif font-semibold tracking-[4px] text-2xl mb-6"
        >
          <span className="w-8 h-8 inline-block">
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

        {/* Card */}
        <div className="p-7 sm:p-9 rounded-sm border border-gold/30 bg-bg-mid/60 backdrop-blur shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-7">
            <OrnamentDivider className="opacity-60 mb-5" />
            <div className="eyebrow mb-3">— XUSH KELIBSIZ —</div>
            <h1
              className="font-serif text-gold-gradient leading-tight mb-3"
              style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}
            >
              MEROS sayohati
            </h1>
            <p className="font-serif italic text-cream-soft text-base">
              Hisobingiz bilan kirib, progresingizni saqlang
            </p>
          </div>

          {/* Google Sign-In */}
          {firebaseConfigured ? (
            <button
              onClick={handleGoogle}
              disabled={signingIn || !authReady}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-cream hover:bg-white text-bg-deep rounded-full text-sm font-medium tracking-wide transition shadow-[0_4px_20px_rgba(212,165,116,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {signingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
                  Kirilmoqda...
                </>
              ) : (
                <>
                  <GoogleLogo />
                  Google bilan davom etish
                </>
              )}
            </button>
          ) : (
            <div className="p-4 border border-gold/25 bg-bg-deep/40 rounded-sm">
              <div className="flex items-start gap-3">
                <span className="text-gold flex-shrink-0 mt-0.5">ⓘ</span>
                <div className="flex-1 text-sm text-cream-soft/85 leading-relaxed">
                  <p className="font-medium text-gold mb-1">Google login sozlanmagan</p>
                  <p className="text-xs text-cream-soft/60">
                    Administrator Firebase env qiymatlarini qo'shgandan keyin Google bilan kirish ishlaydi.
                    Hozircha mehmon sifatida davom etishingiz mumkin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 border border-crimson/40 bg-crimson/10 rounded-sm text-crimson/90 text-xs text-center">
              {errorMsg}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 h-px bg-gold/20" />
            <span className="text-cream-soft/40 text-[10px] tracking-[3px] uppercase">yoki</span>
            <span className="flex-1 h-px bg-gold/20" />
          </div>

          {/* Guest entry */}
          <form onSubmit={handleGuest} className="space-y-3">
            <label className="block">
              <span className="text-cream-soft/70 text-[10px] tracking-[2px] uppercase block mb-2">
                Mehmon ismi (ixtiyoriy)
              </span>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Otabek"
                maxLength={32}
                className="w-full bg-bg-deep/60 border border-gold/30 focus:border-gold/80 rounded-sm px-4 py-2.5 text-cream font-serif outline-none transition placeholder:text-cream-soft/30"
              />
            </label>
            <button
              type="submit"
              className="w-full px-5 py-3 border border-gold/40 text-cream hover:text-bg-deep hover:bg-gold hover:border-gold rounded-sm text-xs tracking-[2px] uppercase transition flex items-center justify-center gap-2"
            >
              Mehmon sifatida davom etish
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-3">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
            </button>
          </form>

          {/* Note */}
          <div className="mt-7 pt-5 border-t border-gold/15 text-center">
            <p className="text-cream-soft/55 text-[11px] leading-relaxed">
              {firebaseConfigured ? (
                <>
                  Google bilan kirsangiz, progresingiz akkountga bog'lanadi — istalgan qurilmadan
                  kirib davom ettirishingiz mumkin.<br />
                  Mehmon sifatida kirsangiz, progres faqat shu brauzerda saqlanadi.
                </>
              ) : (
                <>
                  MEROS hisobsiz ham ishlaydi — progresingiz mahalliy saqlanadi.<br />
                  Google bilan kirish faollashganda, ismingiz va rasmingiz avtomatik olinadi.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer link back home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-cream-soft/50 hover:text-gold text-[11px] tracking-[2px] uppercase transition"
          >
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </section>
  );
}
