import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyGoogleIdToken, signMerosJwt } from '../auth.js';
import { upsertUserFromGoogle } from '../db.js';

const router = Router();

// Default state for brand-new users — kept in sync with the frontend's
// DEFAULT object in src/hooks/useProgress.js. Duplicated intentionally so
// the backend can mint a usable row without ever loading the frontend bundle.
const DEFAULT_STATE = {
  name: 'Foydalanuvchi',
  points: 0,
  visited: { allomalar: [], muzeylar: [], musiqa: [], kinolar: [], kitoblar: [] },
  achievements: [],
  avatar: 'girih-1',
  streak: { current: 0, longest: 0, lastVisit: null },
  favorites: { allomalar: [], muzeylar: [], musiqa: [], kinolar: [], kitoblar: [] },
  quizScores: {},
  readingProgress: {},
  muhr: { bronze: 0, silver: 0, gold: 0 },
  muhrHistory: [],
  shopPurchases: [],
  daily: { completedDays: [], lastChallengeDate: null, lastChallengeId: null, challengeStreak: 0 },
  dailyContent: { quotesSeen: [], wordsKnown: [], wordsUnknown: [] },
  comments: {},
  likedComments: [],
  recentActivity: [],
  muhrStyle: 'classical',
};

// 20 sign-in attempts per IP per 10 min is way past anything legitimate
// but well under what would let an attacker brute-force tokens.
const signInLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/google', signInLimiter, async (req, res) => {
  const { id_token: idToken } = req.body || {};
  if (!idToken || typeof idToken !== 'string') {
    return res.status(400).json({ error: 'missing_id_token' });
  }
  let payload;
  try {
    payload = await verifyGoogleIdToken(idToken);
  } catch (err) {
    return res.status(401).json({ error: 'invalid_google_token', detail: err.message });
  }
  if (!payload.emailVerified) {
    // GIS rarely returns unverified emails but defending against it costs
    // nothing — keeps the leaderboard from filling with fake throwaways.
    return res.status(403).json({ error: 'email_not_verified' });
  }
  const user = upsertUserFromGoogle({
    uid: payload.sub,
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    defaultState: { ...DEFAULT_STATE, name: payload.name },
  });
  const token = signMerosJwt({ uid: user.uid, name: user.name });
  res.json({
    token,
    user: {
      uid: user.uid,
      name: user.name,
      email: user.email,
      picture: user.picture,
      points: user.points,
    },
  });
});

export default router;
