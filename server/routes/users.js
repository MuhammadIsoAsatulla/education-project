import { Router } from 'express';
import {
  getUserRow,
  updateUserState,
  searchUsers,
  getFollowCounts,
  isFollowing,
} from '../db.js';
import { requireAuth, optionalAuth } from '../middleware.js';

const router = Router();

// Public read of any profile — used by UserProfilePage when viewing other
// people. We strip the heavy `state` blob and only ship the slice the
// frontend actually renders: top-line counts, recent activity, achievements.
router.get('/:uid', optionalAuth, (req, res) => {
  const row = getUserRow(req.params.uid);
  if (!row) return res.status(404).json({ error: 'not_found' });
  const counts = getFollowCounts(row.uid);
  const viewer = req.user?.uid;
  const summary = {
    uid: row.uid,
    name: row.name,
    picture: row.picture,
    points: row.points,
    achievements: row.state?.achievements || [],
    muhr: row.state?.muhr || { bronze: 0, silver: 0, gold: 0 },
    streak: row.state?.streak || { current: 0, longest: 0 },
    visited: countVisited(row.state?.visited),
    recentActivity: (row.state?.recentActivity || []).slice(0, 10),
    followers: counts.followers,
    following: counts.following,
    iFollow: viewer ? isFollowing(viewer, row.uid) : false,
    isMe: viewer === row.uid,
  };
  res.json(summary);
});

// "Me" endpoints — gated by JWT, return the full state blob for syncing
// back into the frontend's useProgress reducer.
router.get('/me/full', requireAuth, (req, res) => {
  const row = getUserRow(req.user.uid);
  if (!row) return res.status(404).json({ error: 'not_found' });
  res.json(row);
});

router.put('/me/state', requireAuth, (req, res) => {
  const state = req.body?.state;
  if (!state || typeof state !== 'object') {
    return res.status(400).json({ error: 'missing_state' });
  }
  const ok = updateUserState(req.user.uid, state);
  if (!ok) return res.status(404).json({ error: 'not_found' });
  res.json({ ok: true });
});

// Search by name/email — used by UsersListPage's search box. Empty `q`
// returns the top 25 by points so the page is useful on first load.
router.get('/', (req, res) => {
  const q = (req.query.q || '').toString().trim();
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 25));
  const rows = searchUsers(q, limit);
  res.json({ users: rows });
});

function countVisited(visited) {
  if (!visited) return { allomalar: 0, muzeylar: 0, musiqa: 0, kinolar: 0, kitoblar: 0 };
  return {
    allomalar: (visited.allomalar || []).length,
    muzeylar: (visited.muzeylar || []).length,
    musiqa: (visited.musiqa || []).length,
    kinolar: (visited.kinolar || []).length,
    kitoblar: (visited.kitoblar || []).length,
  };
}

export default router;
