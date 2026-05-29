import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import cors from 'cors';

import { getDb } from './db.js';
import { errorHandler } from './middleware.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import leaderboardRoutes from './routes/leaderboard.js';
import followRoutes from './routes/follow.js';
import commentRoutes from './routes/comments.js';

// Eager-open the DB so a fatal config error (missing path, bad permissions)
// fails fast at boot instead of on the first request. systemd's Restart=on-
// failure will keep retrying, journalctl shows the error.
getDb();

const app = express();

// Trust the nginx proxy in front of us so rate-limiter sees real client IPs.
// `1` = trust one hop (nginx); higher would let clients forge X-Forwarded-For.
app.set('trust proxy', 1);

app.use(compression());
app.use(express.json({ limit: '256kb' })); // user state blob ~ 50 KB; cap is generous

if (process.env.ALLOW_ANY_CORS === '1') {
  app.use(cors());
}

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/comments', commentRoutes);

// 404 for anything else under /api. nginx serves the SPA for non-/api paths,
// so this only triggers when the frontend asks for a route that doesn't exist.
app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));

app.use(errorHandler);

const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, '127.0.0.1', () => {
  // Bind to loopback only — nginx proxies in front; no reason to expose :3000
  // publicly. eslint-disable-next-line no-console
  console.log(`[meros-api] listening on 127.0.0.1:${port}`);
});
