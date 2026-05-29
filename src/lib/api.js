// Lightweight fetch wrapper for the MEROS backend.
//
//   - Same-origin in production (nginx proxies /api/* to the Node server).
//   - In dev you can point at a remote API via VITE_API_BASE.
//   - JWT is stored in localStorage under `meros:token`; getToken() / setToken()
//     read and write it. Calls to apiFetch() send the token automatically when
//     present (no need to thread it through every caller).
//   - probeApi() returns true once /api/health responds — used by useProgress
//     to decide whether to sync to the server or fall back to localStorage.

const TOKEN_KEY = 'meros:token';
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode / quota — ignore */
  }
}

function buildUrl(path) {
  if (path.startsWith('http')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

export async function apiFetch(path, { method = 'GET', body, headers = {}, auth = 'optional' } = {}) {
  const finalHeaders = { Accept: 'application/json', ...headers };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';
  const token = getToken();
  if (token && auth !== 'none') {
    finalHeaders.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  // 401 means our stored JWT is bad/expired. Drop it so the next request
  // is anonymous (and the UI shows the login button again).
  if (res.status === 401) {
    setToken(null);
  }
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

// In-flight health probe — the first call hits the server, subsequent calls
// (within ~30 s) reuse the cached promise so a page that mounts many hooks
// at once doesn't fire N parallel /api/health requests.
let healthPromise = null;
let healthExpiresAt = 0;
const HEALTH_TTL_MS = 30_000;

export function probeApi() {
  const now = Date.now();
  if (healthPromise && now < healthExpiresAt) return healthPromise;
  healthExpiresAt = now + HEALTH_TTL_MS;
  healthPromise = apiFetch('/api/health', { auth: 'none' })
    .then((d) => !!d?.ok)
    .catch(() => false);
  return healthPromise;
}

// Resets the cached probe — call this after a deploy or when the user explicitly
// retries; otherwise the 30s window will mask a now-recovered backend.
export function resetApiProbe() {
  healthPromise = null;
  healthExpiresAt = 0;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
