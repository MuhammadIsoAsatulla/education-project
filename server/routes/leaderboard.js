import { Router } from 'express';
import { getLeaderboard } from '../db.js';

const router = Router();

// Public top-N. Defaults to 20 — matches what the homepage widget and the
// dedicated leaderboard page both need. Capped at 100 so an unbounded
// `?limit=999999` can't be used to DoS the box.
router.get('/', (req, res) => {
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const rows = getLeaderboard(limit);
  res.json({ leaderboard: rows });
});

export default router;
