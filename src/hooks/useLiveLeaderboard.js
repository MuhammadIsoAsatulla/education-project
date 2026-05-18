import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase.js';

/**
 * Real-time top-N users from Firestore, ordered by points desc.
 *
 *   status:
 *     'disabled' — Firebase not configured; caller should use the mock list
 *     'loading'  — first snapshot pending
 *     'empty'    — query returned zero users (fresh project)
 *     'ready'    — `users` is populated
 *     'error'    — see `error` message
 */
export default function useLiveLeaderboard(max = 20) {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(isFirebaseConfigured ? 'loading' : 'disabled');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setStatus('disabled');
      return undefined;
    }
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(max));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = [];
        snap.forEach((d) => {
          const data = d.data() || {};
          rows.push({
            uid: d.id,
            name: data.name || 'Foydalanuvchi',
            picture: data.picture || null,
            avatar: data.avatar || 'girih-1',
            points: data.points || 0,
            streak: data.streak?.current || 0,
            level: data.level || null,
            tier: data.tier || null,
          });
        });
        setUsers(rows);
        setStatus(rows.length ? 'ready' : 'empty');
      },
      (err) => {
        setError(err?.code || err?.message || 'unknown');
        setStatus('error');
      },
    );
    return unsub;
  }, [max]);

  return { users, status, error };
}
