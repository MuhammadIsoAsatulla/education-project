import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage.js';

/**
 * Authentication state.
 * Stored in localStorage so the session survives reloads (no backend yet).
 *
 * User shape:
 *   {
 *     id: string,         // Google `sub` for Google users, "guest-..." otherwise
 *     name: string,
 *     email?: string,     // only for Google users
 *     picture?: string,   // Google profile photo URL
 *     provider: 'google' | 'guest',
 *     signedInAt: number, // Date.now()
 *   }
 */
export default function useAuth() {
  const [user, setUser] = useLocalStorage('meros:auth', null);

  const signInWithGoogle = useCallback(
    (googlePayload) => {
      if (!googlePayload?.sub) return null;
      const next = {
        id: googlePayload.sub,
        name: googlePayload.name || googlePayload.email || 'MEROS foydalanuvchi',
        email: googlePayload.email || null,
        picture: googlePayload.picture || null,
        provider: 'google',
        signedInAt: Date.now(),
      };
      setUser(next);
      return next;
    },
    [setUser],
  );

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
      setUser(next);
      return next;
    },
    [setUser],
  );

  const signOut = useCallback(() => {
    // Best-effort: also disable Google's one-tap auto-select so the next
    // sign-in shows the account picker fresh.
    try {
      window.google?.accounts?.id?.disableAutoSelect?.();
    } catch {
      /* ignore */
    }
    setUser(null);
  }, [setUser]);

  return {
    user,
    isAuthenticated: !!user,
    isGoogleUser: user?.provider === 'google',
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };
}
