import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import useAuth from '../hooks/useAuth.js';
import useProgress from '../hooks/useProgress.js';
import {
  GOOGLE_CLIENT_ID,
  decodeJwtPayload,
  isGoogleAuthConfigured,
  loadGoogleScript,
} from '../lib/googleAuth.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signInWithGoogle, signInAsGuest } = useAuth();
  const { state: progressState, setName: setProgressName } = useProgress();
  const buttonRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | unavailable | error
  const [errorMsg, setErrorMsg] = useState(null);
  const [guestName, setGuestName] = useState('');

  // Where to redirect after sign-in (?next=/somewhere)
  const nextPath = new URLSearchParams(location.search).get('next') || '/';

  // Already authenticated? Go straight to the destination.
  useEffect(() => {
    if (user) navigate(nextPath, { replace: true });
  }, [user, navigate, nextPath]);

  // Initialize Google Identity Services once.
  useEffect(() => {
    if (!isGoogleAuthConfigured()) {
      setStatus('unavailable');
      return;
    }

    let cancelled = false;

    loadGoogleScript()
      .then((google) => {
        if (cancelled) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const payload = decodeJwtPayload(response.credential);
            if (!payload) {
              setErrorMsg("Google javobini o'qib bo'lmadi. Qaytadan urinib ko'ring.");
              return;
            }
            const authUser = signInWithGoogle(payload);
            // First-time syncing: adopt the Google name as profile name if the
            // user still has the default "Mehmon".
            if (authUser && (!progressState.name || progressState.name === 'Mehmon')) {
              setProgressName(authUser.name);
            }
            navigate(nextPath, { replace: true });
          },
        });

        if (buttonRef.current) {
          // Clear any previous render before re-mounting.
          buttonRef.current.innerHTML = '';
          google.accounts.id.renderButton(buttonRef.current, {
            theme: 'filled_black',
            size: 'large',
            type: 'standard',
            shape: 'pill',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 320,
          });
        }
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(err?.message || "Google xizmatini ulab bo'lmadi.");
      });

    return () => {
      cancelled = true;
    };
    // We intentionally don't add progressState.name/setProgressName here — we only
    // want the GSI button to mount once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInWithGoogle, navigate, nextPath]);

  const handleGuest = (e) => {
    e?.preventDefault?.();
    const trimmed = guestName.trim();
    const authUser = signInAsGuest(trimmed || 'Mehmon');
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
          {isGoogleAuthConfigured() ? (
            <div className="flex justify-center mb-4 min-h-[44px]">
              {status === 'loading' && (
                <div className="flex items-center gap-3 text-cream-soft/70 text-sm">
                  <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  Google yuklanmoqda...
                </div>
              )}
              <div ref={buttonRef} className="flex justify-center" />
            </div>
          ) : (
            <div className="mb-4 p-4 border border-gold/25 bg-bg-deep/40 rounded-sm">
              <div className="flex items-start gap-3">
                <span className="text-gold flex-shrink-0 mt-0.5">ⓘ</span>
                <div className="flex-1 text-sm text-cream-soft/85 leading-relaxed">
                  <p className="font-medium text-gold mb-1">Google login sozlanmagan</p>
                  <p className="text-xs text-cream-soft/60">
                    Administrator <code className="text-gold/80 bg-bg-deep/60 px-1 py-0.5 rounded">VITE_GOOGLE_CLIENT_ID</code>{' '}
                    qiymatini qo'shgandan keyin Google bilan kirish ishlaydi. Hozirgacha mehmon
                    sifatida davom etishingiz mumkin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 border border-crimson/40 bg-crimson/10 rounded-sm text-crimson/90 text-xs text-center">
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
              MEROS hisobsiz ham ishlaydi — progresingiz mahalliy saqlanadi.<br />
              Google bilan kirsangiz, ismingiz va rasmingiz avtomatik olinadi.
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
