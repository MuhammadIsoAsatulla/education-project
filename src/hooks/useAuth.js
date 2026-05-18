import { useCallback, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase.js';
import { ensureCloudUserDoc } from '../lib/migrateLocalToCloud.js';
import useLocalStorage from './useLocalStorage.js';

/**
 * Unified auth state.
 *
 *   - When Firebase is configured AND the user has signed in with Google,
 *     `user` is the Firebase user (uid maps to `users/{uid}` Firestore doc).
 *   - Otherwise `user` is the guest stored in localStorage, or null.
 *
 * Shape of `user`:
 *   { id, uid?, name, email, picture, provider: 'google'|'guest', signedInAt }
 *   (`uid` is only set for Firebase users — that's the Firestore key.)
 */
export default function useAuth() {
  const [guestUser, setGuestUser] = useLocalStorage('meros:auth', null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  // Until Firebase replies, we don't know yet whether there's a signed-in user.
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthReady(true);
      return undefined;
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setFirebaseUser(null);
        setAuthReady(true);
        return;
      }
      // Ensure the user's Firestore doc exists BEFORE flipping `firebaseUser`,
      // so when useProgress later subscribes to `users/{uid}` the doc is
      // already there (no race between migration and incoming user actions).
      try {
        await ensureCloudUserDoc(fbUser);
      } catch (err) {
        // Migration failed (offline, permission, etc.) — proceed anyway;
        // useProgress will fall back to localStorage until the next sign-in.
        // eslint-disable-next-line no-console
        console.warn('[useAuth] cloud user doc migration failed:', err?.code || err?.message);
      }
      setFirebaseUser({
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email || 'Foydalanuvchi',
        email: fbUser.email,
        picture: fbUser.photoURL,
        provider: 'google',
        signedInAt: Date.now(),
      });
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase auth is not configured');
    }
    const provider = new GoogleAuthProvider();
    // Always show the account picker — never silently sign in the last user,
    // so multi-account browsers can choose which Google account to use.
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
    // `onAuthStateChanged` will fire and set `firebaseUser`.
    // We also clear any stale guest entry so the Navbar widget swaps cleanly.
    setGuestUser(null);
  }, [setGuestUser]);

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
    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        await fbSignOut(auth);
      } catch {
        /* ignore — we still clear local state below */
      }
    }
    setGuestUser(null);
  }, [setGuestUser]);

  // Firebase user always wins over guest entry — prevents stale guest state
  // from leaking through after a real sign-in.
  const user = firebaseUser || guestUser;

  return {
    user,
    isAuthenticated: !!user,
    isGoogleUser: user?.provider === 'google',
    isFirebaseUser: !!firebaseUser,
    authReady,
    firebaseConfigured: isFirebaseConfigured,
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };
}
