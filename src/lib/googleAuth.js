/**
 * Google Identity Services (GSI) integration.
 *
 * Setup:
 *  1. Create a project at https://console.cloud.google.com
 *  2. APIs & Services → Credentials → "Create Credentials" → OAuth client ID
 *     • Application type: Web application
 *     • Authorized JavaScript origins: http://localhost:5173  (and your prod domain)
 *  3. Copy the Client ID and put it in `.env`:
 *       VITE_GOOGLE_CLIENT_ID=xxxxxxx.apps.googleusercontent.com
 *  4. Restart `npm run dev` so Vite picks up the env var.
 *
 * If the env var is missing, the login page gracefully shows a "guest only"
 * fallback so the rest of the app keeps working without OAuth.
 */

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export function isGoogleAuthConfigured() {
  return !!GOOGLE_CLIENT_ID;
}

let scriptPromise = null;

export function loadGoogleScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not available'));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-gsi="1"]');
    const onReady = () => {
      if (window.google?.accounts?.id) resolve(window.google);
      else reject(new Error('Google Identity Services failed to initialize'));
    };
    if (existing) {
      existing.addEventListener('load', onReady, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.gsi = '1';
    script.onload = onReady;
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load Google Identity Services script'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Decode the JWT credential returned by Google's OAuth callback.
 * The payload contains: sub (user id), name, email, picture, iss, aud, exp, etc.
 * No signature verification client-side — that's fine for an identification-only
 * flow where we don't grant elevated server-side privileges based on the token.
 */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const decoded = atob(padded);
    // Properly handle UTF-8 characters in name (e.g. Cyrillic, accents)
    const utf8 = decodeURIComponent(
      Array.from(decoded)
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(utf8);
  } catch {
    return null;
  }
}
