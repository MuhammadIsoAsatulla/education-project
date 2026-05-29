import { useEffect, useState } from 'react';
import { apiFetch, probeApi } from '../lib/api.js';

/**
 * Top-N users from /api/leaderboard. Polled every 30s — real-time isn't
 * critical for a leaderboard, and polling keeps the architecture trivial
 * (no WebSocket plumbing).
 *
 *   status:
 *     'disabled' — backend unreachable; caller falls back to the mock list
 *     'loading'  — first fetch pending
 *     'empty'    — endpoint returned zero users
 *     'ready'    — `users` is populated
 *     'error'    — see `error`
 */
const POLL_INTERVAL_MS = 30_000;

export default function useLiveLeaderboard(max = 20) {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const fetchOnce = async () => {
      try {
        const data = await apiFetch(`/api/leaderboard?limit=${max}`, { auth: 'optional' });
        if (cancelled) return;
        const rows = (data?.leaderboard || []).map((u) => ({
          uid: u.uid,
          name: u.name || 'Foydalanuvchi',
          picture: u.picture || null,
          avatar: 'girih-1',
          points: u.points || 0,
          streak: 0,
        }));
        setUsers(rows);
        setStatus(rows.length ? 'ready' : 'empty');
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'fetch_failed');
        setStatus('error');
      }
    };

    (async () => {
      const ok = await probeApi();
      if (cancelled) return;
      if (!ok) {
        setStatus('disabled');
        return;
      }
      await fetchOnce();
      timer = setInterval(fetchOnce, POLL_INTERVAL_MS);
    })();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [max]);

  return { users, status, error };
}
