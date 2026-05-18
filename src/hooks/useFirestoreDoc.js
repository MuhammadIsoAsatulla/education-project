import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

/**
 * Subscribe to a single Firestore document and expose a `[data, setData]`
 * tuple shaped like `useState` — including functional updates.
 *
 *   const [user, setUser] = useFirestoreDoc(`users/${uid}`, DEFAULT);
 *   setUser(prev => ({ ...prev, points: prev.points + 10 }));
 *
 * Returns:
 *   data:
 *     - `undefined` while the first snapshot is loading
 *     - `null` when the document doesn't exist
 *     - the document data when it exists
 *   setData(updater): writes optimistically (UI updates instantly), then
 *     debounces the actual `setDoc` write to coalesce rapid updates.
 *
 * No-op when `docPath` is null/empty (e.g. user is signed out) or when
 * Firebase isn't configured.
 */
const WRITE_DEBOUNCE_MS = 500;

export default function useFirestoreDoc(docPath, defaultValue = null) {
  const [data, setData] = useState(undefined);
  const dataRef = useRef(undefined);
  const pendingRef = useRef(undefined);
  const timerRef = useRef(null);
  const pathRef = useRef(docPath);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    pathRef.current = docPath;
  }, [docPath]);

  // Subscribe
  useEffect(() => {
    if (!docPath || !db) {
      setData(undefined);
      return undefined;
    }
    const ref = doc(db, docPath);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setData(snap.exists() ? snap.data() : null);
      },
      (err) => {
        // Permission errors, offline, etc. — log and leave data as-is.
        // eslint-disable-next-line no-console
        console.warn('[useFirestoreDoc] subscription error:', err.code || err.message);
      },
    );
    return () => {
      unsub();
    };
  }, [docPath]);

  const flush = useCallback(async () => {
    timerRef.current = null;
    const value = pendingRef.current;
    pendingRef.current = undefined;
    const path = pathRef.current;
    if (value === undefined || !path || !db) return;
    try {
      await setDoc(doc(db, path), value);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[useFirestoreDoc] write error:', err.code || err.message);
    }
  }, []);

  const setValue = useCallback(
    (updater) => {
      const current = dataRef.current ?? defaultValue;
      const next = typeof updater === 'function' ? updater(current) : updater;
      setData(next);
      pendingRef.current = next;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, WRITE_DEBOUNCE_MS);
    },
    [defaultValue, flush],
  );

  // Flush any pending write when the path changes or component unmounts.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        // Fire and forget — we're tearing down.
        flush();
      }
    };
  }, [flush]);

  return [data, setValue];
}
