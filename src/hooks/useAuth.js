import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage.js';
import { apiFetch, getToken, setToken, probeApi } from '../lib/api.js';

/**
 * Unified auth state for the MEROS frontend.
 *
 *   - Google sign-in: GIS prompts for an account → backend verifies the
 *     id_token → backend issues a MEROS JWT → that JWT lives in
 *     localStorage and is sent on every /api/* call.
 *   - Guest sign-in: name-only, stored locally, no server round-trip.
 *
 *   Shape of `user` (consumed by Navbar, ProfilPage, Leaderboard, etc.):
 *     { id, uid?, name, email, picture, provider: 'google'|'guest', signedInAt }
 *
 * `isGoogleUser` means "signed in with Google AND backend reachable" —
 * the rest of the app uses it to decide whether to sync progress to the
 * server or keep using localStorage.
 */

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Track GIS script load globally so multiple useAuth instances don't each
// re-inject the same <script>.
let gisLoadPromise = null;

function loadGoogleScript() {
  if (gisLoadPromise) return gisLoadPromise;
  if (typeof window === 'undefined') return Promise.reject(new Error('no-window'));
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  gisLoadPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(window.google);
    s.onerror = () => {
      gisLoadPromise = null;
      reject(new Error('gis-load-failed'));
    };
    document.head.appendChild(s);
  });
  return gisLoadPromise;
}

export default function useAuth() {
  const [guestUser, setGuestUser] = useLocalStorage('meros:auth', null);
  const [serverUser, setServerUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);

  const isConfigured = !!GOOGLE_CLIENT_ID;

  // On mount: probe the API and, if a JWT is already stored, hydrate the
  // server user from /api/users/me/full. If the token is bad the apiFetch
  // helper auto-clears it.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await probeApi();
      if (cancelled) return;
      setApiAvailable(ok);
      const token = getToken();
      if (!ok || !token) {
        setAuthReady(true);
        return;
      }
      try {
        const me = await apiFetch('/api/users/me/full', { auth: 'required' });
        if (cancelled) return;
        setServerUser({
          id: me.uid,
          uid: me.uid,
          name: me.name || 'Foydalanuvchi',
          email: me.email,
          picture: me.picture,
          provider: 'google',
          signedInAt: Date.now(),
        });
      } catch {
        /* token invalid → already cleared by apiFetch; user signs in again */
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isConfigured) {
      throw new Error('Google login is not configured (set VITE_GOOGLE_CLIENT_ID).');
    }
    const ok = await probeApi();
    if (!ok) {
      throw new Error("Backend mavjud emas. Iltimos, keyinroq urinib ko'ring.");
    }
    const google = await loadGoogleScript();
    // Wrap GIS callback in a promise so the caller can `await` sign-in.
    const credential = await new Promise((resolve, reject) => {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => {
          if (resp?.credential) resolve(resp.credential);
          else reject(new Error('no-credential'));
        },
        ux_mode: 'popup',
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // `prompt()` shows the account chooser. If the user has previously
      // dismissed the prompt or the browser blocks it, GIS reports
      // `isNotDisplayed` — we fall back to a manual button click via the
      // `oauth2.initTokenClient` flow? GIS doesn't allow that for id_tokens.
      // We surface the failure so LoginPage can render an error.
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
          reject(new Error('prompt-suppressed'));
        }
      });
    });
    // Exchange the Google id_token for a MEROS JWT.
    const data = await apiFetch('/api/auth/google', {
      method: 'POST',
      body: { id_token: credential },
      auth: 'none',
    });
    setToken(data.token);
    setServerUser({
      id: data.user.uid,
      uid: data.user.uid,
      name: data.user.name,
      email: data.user.email,
      picture: data.user.picture,
      provider: 'google',
      signedInAt: Date.now(),
    });
    setGuestUser(null);
    setApiAvailable(true);
  }, [isConfigured, setGuestUser]);

  const signInAsGuest = useCallback(
    (name) => {
      const next = {
        id: 'guest-' + Date.now().toString(36),
        name: (name && name.trim()) || 'Mehmon',
        email: null,
        picture: null,
        provider: 'guest',
        signedInAt: Date.now(),
      };
      setGuestUser(next);
      return next;
    },
    [setGuestUser],
  );

  const signOut = useCallback(async () => {
    setToken(null);
    setServerUser(null);
    setGuestUser(null);
    // Best-effort GIS sign-out so the next sign-in re-prompts for the
    // account picker instead of silently reusing the same Google session.
    try {
      const g = window.google?.accounts?.id;
      if (g) g.disableAutoSelect();
    } catch {
      /* ignore */
    }
  }, [setGuestUser]);

  const user = serverUser || guestUser;

  return {
    user,
    isAuthenticated: !!user,
    isGoogleUser: !!serverUser,
    isFirebaseUser: !!serverUser,
    authReady,
    googleEnabled: isConfigured && apiAvailable,
    apiAvailable,
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };
}
