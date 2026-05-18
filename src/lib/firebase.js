/**
 * Firebase initialization.
 *
 * Reads config from Vite env vars. If any required key is missing, the
 * exported `isFirebaseConfigured` is false and `auth`/`db` are null —
 * the app then falls back to local-only guest mode without crashing.
 *
 * Setup:
 *   1. https://console.firebase.google.com → create project
 *   2. Build → Authentication → Sign-in method → enable Google
 *   3. Build → Firestore Database → create (production mode, europe-west)
 *   4. Project Settings → Your apps → Web → register, copy config
 *   5. Paste values into `.env`:
 *        VITE_FIREBASE_API_KEY=...
 *        VITE_FIREBASE_AUTH_DOMAIN=...
 *        VITE_FIREBASE_PROJECT_ID=...
 *        VITE_FIREBASE_APP_ID=...
 *   6. Restart `npm run dev`. Add same vars on Vercel + redeploy for prod.
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

export const app = isFirebaseConfigured ? initializeApp(config) : null;
export const auth = isFirebaseConfigured ? getAuth(app) : null;
export const db = isFirebaseConfigured ? getFirestore(app) : null;
