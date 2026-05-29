import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch, getToken } from '../lib/api.js';

/**
 * Server-synced progress for signed-in Google users.
 *
 *   - Initial load hits GET /api/users/me/full once.
 *   - Writes are debounced 500 ms (same window the Firestore version used)
 *     and POSTed as PUT /api/users/me/state.
 *   - On pagehide / beforeunload we use navigator.sendBeacon so the last
 *     write isn't lost if the user closes the tab right after an action.
 *
 * Shape matches useFirestoreDoc: `[state, setState]`, where setState accepts
 * either a new value or an updater function.
 */
export default function useServerProgress(enabled, fallback) {
  const [state, setState] = useState(null);
  const stateRef = useRef(null);
  const debounceRef = useRef(null);
  const lastSentRef = useRef('');

  // Keep a synchronous ref for the latest state — pagehide handlers fire
  // outside React's render cycle and need the freshest value to beacon out.
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initial fetch when enabled flips true (i.e. user just signed in).
  useEffect(() => {
    if (!enabled) {
      setState(null);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await apiFetch('/api/users/me/full', { auth: 'required' });
        if (cancelled) return;
        const merged = { ...fallback, ...(me.state || {}) };
        setState(merged);
        lastSentRef.current = JSON.stringify(merged);
      } catch {
        // Fetch failed — caller (useProgress) keeps using localStorage as
        // the effective state; we leave `state` null so it knows we don't
        // have authoritative data yet.
        if (!cancelled) setState(null);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const flushNow = useCallback((value) => {
    const payload = JSON.stringify(value || {});
    if (payload === lastSentRef.current) return;
    lastSentRef.current = payload;
    apiFetch('/api/users/me/state', {
      method: 'PUT',
      body: { state: value },
      auth: 'required',
    }).catch(() => {
      // Reset lastSent so the next debounce attempts the write again.
      lastSentRef.current = '';
    });
  }, []);

  const setter = useCallback(
    (next) => {
      setState((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          flushNow(resolved);
        }, 500);
        return resolved;
      });
    },
    [flushNow],
  );

  // Tab-close safety net — beacon out the latest state synchronously.
  useEffect(() => {
    if (!enabled) return undefined;
    const flushOnExit = () => {
      const token = getToken();
      const value = stateRef.current;
      if (!token || !value) return;
      const payload = JSON.stringify({ state: value });
      if (payload === lastSentRef.current) return;
      lastSentRef.current = payload;
      // sendBeacon ignores the Authorization header (it's not allowed on
      // Beacon requests), so we fall back to a synchronous keepalive fetch
      // which DOES allow auth headers. fetch keepalive on tab close is the
      // modern recommended approach.
      try {
        fetch('/api/users/me/state', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('pagehide', flushOnExit);
    window.addEventListener('beforeunload', flushOnExit);
    return () => {
      window.removeEventListener('pagehide', flushOnExit);
      window.removeEventListener('beforeunload', flushOnExit);
    };
  }, [enabled]);

  return [state, setter];
}
