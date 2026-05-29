import { useCallback, useEffect, useRef, useState } from 'react';

// In-page pub/sub so multiple components hooking the same localStorage key
// stay in sync without a page refresh. Without this, BookReader writing
// readingProgress wouldn't notify KitobDetailPage, so the progress bar
// stayed at the old value until the user reloaded.
const subscribers = new Map(); // key -> Set<callback>

function subscribe(key, cb) {
  let set = subscribers.get(key);
  if (!set) {
    set = new Set();
    subscribers.set(key, set);
  }
  set.add(cb);
  return () => set.delete(cb);
}

function publish(key, value, originRef) {
  const set = subscribers.get(key);
  if (!set) return;
  set.forEach((cb) => cb(value, originRef));
}

// Persistence batching: page flips, quiz answers, and other actions can
// fire in rapid succession (5+ writes/sec while reading). Each write does a
// JSON.stringify of the entire state — for users with long activity logs
// that's ~50 KB of string work each time. We coalesce writes within a
// 250 ms window and flush synchronously on tab unload so nothing is lost.
const pendingByKey = new Map(); // key -> latest value waiting to persist
const pendingTimerByKey = new Map(); // key -> setTimeout handle
const PERSIST_DELAY_MS = 250;

function schedulePersist(key, value) {
  pendingByKey.set(key, value);
  const existing = pendingTimerByKey.get(key);
  if (existing) clearTimeout(existing);
  pendingTimerByKey.set(
    key,
    setTimeout(() => {
      flushPersist(key);
    }, PERSIST_DELAY_MS),
  );
}

function flushPersist(key) {
  const value = pendingByKey.get(key);
  if (value === undefined) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or privacy errors — fail silently, we still have in-memory state */
  }
  pendingByKey.delete(key);
  const timer = pendingTimerByKey.get(key);
  if (timer) {
    clearTimeout(timer);
    pendingTimerByKey.delete(key);
  }
}

function flushAll() {
  for (const key of Array.from(pendingByKey.keys())) flushPersist(key);
}

// Mount-once: when the tab is closing or hidden, flush all pending writes
// so the last keystroke isn't lost. `pagehide` is the modern reliable
// signal on mobile too.
if (typeof window !== 'undefined' && !window.__merosFlushBound) {
  window.__merosFlushBound = true;
  window.addEventListener('pagehide', flushAll);
  window.addEventListener('beforeunload', flushAll);
  // visibilitychange catches the mobile case where users swipe away to a
  // different app without firing pagehide.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushAll();
  });
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Each hook instance gets a stable identity so it can recognise its own
  // writes and skip the resulting echo from the pub/sub (otherwise the
  // writer would set state twice — once via React's reducer, once via the
  // subscriber callback).
  const originRef = useRef({});

  // Writer that also fans the new value out to every other live instance
  // of this hook in the page.
  const writer = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        // Debounce the actual localStorage write — same in-memory value is
        // available to all subscribers immediately via publish().
        schedulePersist(key, resolved);
        publish(key, resolved, originRef.current);
        return resolved;
      });
    },
    [key],
  );

  // Listen for writes from other instances and mirror them into local state.
  useEffect(() => {
    return subscribe(key, (incoming, origin) => {
      if (origin === originRef.current) return; // skip my own echo
      setValue(incoming);
    });
  }, [key]);

  // Also pick up writes from OTHER browser tabs (rare but free to support).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key || e.newValue == null) return;
      try {
        setValue(JSON.parse(e.newValue));
      } catch {
        /* ignore parse errors */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, writer];
}
