import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

// Reused across requests — the OAuth2Client caches Google's public keys
// internally, so re-instantiating per request would defeat that cache.
let googleClient = null;
function getGoogleClient() {
  if (!googleClient) {
    googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return googleClient;
}

// Verifies an `id_token` from the GIS callback. Throws if invalid, returns
// the trusted payload {sub, name, email, picture} otherwise. We trust ONLY
// these fields — anything else from the frontend is ignored.
export async function verifyGoogleIdToken(idToken) {
  const audience = process.env.GOOGLE_CLIENT_ID;
  if (!audience) {
    throw new Error('GOOGLE_CLIENT_ID env var is not set');
  }
  const ticket = await getGoogleClient().verifyIdToken({
    idToken,
    audience,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.sub) {
    throw new Error('Invalid Google ID token payload');
  }
  return {
    sub: payload.sub,
    name: payload.name || payload.email || 'Foydalanuvchi',
    email: payload.email || null,
    picture: payload.picture || null,
    emailVerified: !!payload.email_verified,
  };
}

const JWT_TTL_DAYS = 30;

export function signMerosJwt({ uid, name }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var is not set');
  return jwt.sign({ uid, name }, secret, {
    expiresIn: `${JWT_TTL_DAYS}d`,
    issuer: 'meros',
  });
}

export function verifyMerosJwt(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var is not set');
  return jwt.verify(token, secret, { issuer: 'meros' });
}
