import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  listComments,
  createComment,
  deleteComment,
  toggleCommentLike,
  getUserRow,
} from '../db.js';
import { requireAuth, optionalAuth } from '../middleware.js';

const router = Router();

// 30 writes per 5 min per IP — generous enough for power users but cuts off
// trivial spam loops. Reads are unlimited.
const writeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/:contentKey', optionalAuth, (req, res) => {
  const rows = listComments(req.params.contentKey, req.user?.uid);
  res.json({ comments: rows });
});

router.post('/:contentKey', requireAuth, writeLimiter, (req, res) => {
  const { text, rating } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'missing_text' });
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: 'text_too_long' });
  }
  const author = getUserRow(req.user.uid);
  if (!author) return res.status(404).json({ error: 'author_missing' });
  const id = `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const created = createComment({
    id,
    contentKey: req.params.contentKey,
    author: { uid: author.uid, name: author.name, picture: author.picture },
    text: text.trim(),
    rating: Number.isFinite(rating) ? Math.max(1, Math.min(5, Math.round(rating))) : null,
  });
  res.json({ comment: created });
});

router.delete('/:id', requireAuth, (req, res) => {
  const result = deleteComment(req.params.id, req.user.uid);
  if (!result.ok) {
    return res.status(result.reason === 'forbidden' ? 403 : 404).json({ error: result.reason });
  }
  res.json({ ok: true });
});

router.post('/:id/like', requireAuth, writeLimiter, (req, res) => {
  const result = toggleCommentLike(req.params.id, req.user.uid);
  res.json(result);
});

export default router;
