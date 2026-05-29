import { verifyMerosJwt } from './auth.js';

// Hard auth: requests without a valid bearer token are rejected.
export function requireAuth(req, res, next) {
  const token = extractBearer(req);
  if (!token) return res.status(401).json({ error: 'missing_token' });
  try {
    const payload = verifyMerosJwt(token);
    req.user = { uid: payload.uid, name: payload.name };
    next();
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

// Soft auth: token is decoded if present (req.user populated), missing /
// invalid token is fine. Used for endpoints that change behaviour for
// signed-in viewers (e.g. listing comments with `likedByMe`).
export function optionalAuth(req, res, next) {
  const token = extractBearer(req);
  if (!token) return next();
  try {
    const payload = verifyMerosJwt(token);
    req.user = { uid: payload.uid, name: payload.name };
  } catch {
    /* swallow — soft auth means we proceed without req.user */
  }
  next();
}

function extractBearer(req) {
  const raw = req.headers.authorization || '';
  if (!raw.startsWith('Bearer ')) return null;
  return raw.slice(7).trim() || null;
}

// Final-resort error handler. Express's default would dump a stack trace to
// the client — bad for both UX and information disclosure. We log and return
// a generic JSON error instead.
export function errorHandler(err, _req, res, _next) {
  // eslint-disable-next-line no-console
  console.error('[meros-api]', err);
  if (res.headersSent) return;
  res.status(500).json({ error: 'internal_error' });
}
