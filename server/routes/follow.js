import { Router } from 'express';
import {
  follow,
  unfollow,
  isFollowing,
  listFollowers,
  listFollowing,
  getUserRow,
} from '../db.js';
import { requireAuth, optionalAuth } from '../middleware.js';

const router = Router();

router.post('/:uid', requireAuth, (req, res) => {
  const target = req.params.uid;
  if (target === req.user.uid) {
    return res.status(400).json({ error: 'cannot_follow_self' });
  }
  if (!getUserRow(target)) {
    return res.status(404).json({ error: 'target_not_found' });
  }
  follow(req.user.uid, target);
  res.json({ ok: true, following: true });
});

router.delete('/:uid', requireAuth, (req, res) => {
  unfollow(req.user.uid, req.params.uid);
  res.json({ ok: true, following: false });
});

router.get('/:uid/status', optionalAuth, (req, res) => {
  const viewer = req.user?.uid;
  res.json({ following: viewer ? isFollowing(viewer, req.params.uid) : false });
});

router.get('/:uid/followers', (req, res) => {
  res.json({ users: listFollowers(req.params.uid) });
});

router.get('/:uid/following', (req, res) => {
  res.json({ users: listFollowing(req.params.uid) });
});

export default router;
