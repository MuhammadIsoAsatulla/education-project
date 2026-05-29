import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// Single shared connection. better-sqlite3 is synchronous and the API is
// always single-threaded, so one connection is correct — no pool needed.
let db = null;

export function getDb() {
  if (db) return db;
  const path = process.env.DB_PATH || './meros.db';
  // Make sure /var/lib/meros (or wherever DB_PATH points) exists before the
  // first open. The systemd service runs as the `meros` user which owns the
  // dir per the bootstrap script, so this is a safety net for first-run on
  // a fresh box or a dev laptop.
  try {
    mkdirSync(dirname(path), { recursive: true });
  } catch {
    /* directory may already exist or be the cwd — fine */
  }
  db = new Database(path);
  // WAL is dramatically faster for our read-heavy workload (leaderboard,
  // comments listing) while still allowing concurrent reads with one writer.
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  // Sync = NORMAL is the sweet spot — durable across app crashes, only
  // vulnerable to a power loss in the WAL flush window (<1s).
  db.pragma('synchronous = NORMAL');
  migrate(db);
  return db;
}

// Idempotent schema setup. Every CREATE has IF NOT EXISTS so re-running on
// boot is a no-op once the DB is initialised.
function migrate(d) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      uid          TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      email        TEXT,
      picture      TEXT,
      state        TEXT NOT NULL,
      points       INTEGER NOT NULL DEFAULT 0,
      created_at   INTEGER NOT NULL,
      updated_at   INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
    CREATE INDEX IF NOT EXISTS idx_users_name   ON users(name);

    CREATE TABLE IF NOT EXISTS follows (
      follower_uid  TEXT NOT NULL,
      followee_uid  TEXT NOT NULL,
      created_at    INTEGER NOT NULL,
      PRIMARY KEY (follower_uid, followee_uid),
      FOREIGN KEY (follower_uid) REFERENCES users(uid) ON DELETE CASCADE,
      FOREIGN KEY (followee_uid) REFERENCES users(uid) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_follows_followee ON follows(followee_uid);

    CREATE TABLE IF NOT EXISTS comments (
      id              TEXT PRIMARY KEY,
      content_key     TEXT NOT NULL,
      author_uid      TEXT NOT NULL,
      author_name     TEXT NOT NULL,
      author_picture  TEXT,
      text            TEXT NOT NULL,
      rating          INTEGER,
      likes           INTEGER NOT NULL DEFAULT 0,
      created_at      INTEGER NOT NULL,
      FOREIGN KEY (author_uid) REFERENCES users(uid) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_comments_key    ON comments(content_key, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_uid);

    CREATE TABLE IF NOT EXISTS comment_likes (
      comment_id  TEXT NOT NULL,
      user_uid    TEXT NOT NULL,
      created_at  INTEGER NOT NULL,
      PRIMARY KEY (comment_id, user_uid),
      FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
      FOREIGN KEY (user_uid)   REFERENCES users(uid)   ON DELETE CASCADE
    );
  `);
}

// ── Tiny prepared-statement helpers ──────────────────────────────────────
// Wrapped here so the route handlers don't have to know about better-sqlite3.

export function upsertUserFromGoogle({ uid, name, email, picture, defaultState }) {
  const now = Date.now();
  const d = getDb();
  const existing = d.prepare('SELECT uid FROM users WHERE uid = ?').get(uid);
  if (existing) {
    d.prepare(
      `UPDATE users
         SET name = COALESCE(?, name),
             email = COALESCE(?, email),
             picture = COALESCE(?, picture),
             updated_at = ?
       WHERE uid = ?`,
    ).run(name, email, picture, now, uid);
    return getUserRow(uid);
  }
  d.prepare(
    `INSERT INTO users (uid, name, email, picture, state, points, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
  ).run(uid, name || 'Foydalanuvchi', email, picture, JSON.stringify(defaultState), now, now);
  return getUserRow(uid);
}

export function getUserRow(uid) {
  const row = getDb().prepare('SELECT * FROM users WHERE uid = ?').get(uid);
  if (!row) return null;
  return {
    uid: row.uid,
    name: row.name,
    email: row.email,
    picture: row.picture,
    state: safeParse(row.state),
    points: row.points,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Writes happen often (debounced from the client at 500 ms). Storing the
// whole state blob is the simplest path and matches what Firestore was doing.
// `points` is denormalised onto the row for the leaderboard's index.
export function updateUserState(uid, state) {
  const points = Number.isFinite(state?.points) ? state.points : 0;
  const name = state?.name || null;
  const now = Date.now();
  const info = getDb()
    .prepare(
      `UPDATE users
         SET state = ?, points = ?, name = COALESCE(?, name), updated_at = ?
       WHERE uid = ?`,
    )
    .run(JSON.stringify(state || {}), points, name, now, uid);
  return info.changes > 0;
}

export function getLeaderboard(limit = 20) {
  return getDb()
    .prepare(
      `SELECT uid, name, picture, points
         FROM users
        WHERE points > 0
        ORDER BY points DESC, updated_at DESC
        LIMIT ?`,
    )
    .all(limit);
}

export function searchUsers(query, limit = 25) {
  const like = `%${(query || '').toLowerCase()}%`;
  return getDb()
    .prepare(
      `SELECT uid, name, picture, points
         FROM users
        WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ?
        ORDER BY points DESC
        LIMIT ?`,
    )
    .all(like, like, limit);
}

export function follow(followerUid, followeeUid) {
  if (followerUid === followeeUid) return false;
  const now = Date.now();
  const info = getDb()
    .prepare(
      `INSERT OR IGNORE INTO follows (follower_uid, followee_uid, created_at)
       VALUES (?, ?, ?)`,
    )
    .run(followerUid, followeeUid, now);
  return info.changes > 0;
}

export function unfollow(followerUid, followeeUid) {
  const info = getDb()
    .prepare('DELETE FROM follows WHERE follower_uid = ? AND followee_uid = ?')
    .run(followerUid, followeeUid);
  return info.changes > 0;
}

export function getFollowCounts(uid) {
  const d = getDb();
  const followers = d
    .prepare('SELECT COUNT(*) AS n FROM follows WHERE followee_uid = ?')
    .get(uid);
  const following = d
    .prepare('SELECT COUNT(*) AS n FROM follows WHERE follower_uid = ?')
    .get(uid);
  return { followers: followers.n, following: following.n };
}

export function isFollowing(followerUid, followeeUid) {
  if (!followerUid || !followeeUid) return false;
  const row = getDb()
    .prepare('SELECT 1 AS x FROM follows WHERE follower_uid = ? AND followee_uid = ?')
    .get(followerUid, followeeUid);
  return !!row;
}

export function listFollowers(uid, limit = 50) {
  return getDb()
    .prepare(
      `SELECT u.uid, u.name, u.picture, u.points
         FROM follows f
         JOIN users u ON u.uid = f.follower_uid
        WHERE f.followee_uid = ?
        ORDER BY f.created_at DESC
        LIMIT ?`,
    )
    .all(uid, limit);
}

export function listFollowing(uid, limit = 50) {
  return getDb()
    .prepare(
      `SELECT u.uid, u.name, u.picture, u.points
         FROM follows f
         JOIN users u ON u.uid = f.followee_uid
        WHERE f.follower_uid = ?
        ORDER BY f.created_at DESC
        LIMIT ?`,
    )
    .all(uid, limit);
}

export function listComments(contentKey, viewerUid) {
  const d = getDb();
  const rows = d
    .prepare(
      `SELECT id, content_key, author_uid, author_name, author_picture,
              text, rating, likes, created_at
         FROM comments
        WHERE content_key = ?
        ORDER BY created_at DESC
        LIMIT 200`,
    )
    .all(contentKey);
  if (!viewerUid || rows.length === 0) {
    return rows.map((r) => ({ ...r, likedByMe: false }));
  }
  // Tag each row with `likedByMe` so the heart UI knows whether to show
  // filled. Single batch query keeps this O(1) regardless of comment count.
  const ids = rows.map((r) => r.id);
  const placeholders = ids.map(() => '?').join(',');
  const likedRows = d
    .prepare(
      `SELECT comment_id FROM comment_likes
        WHERE user_uid = ? AND comment_id IN (${placeholders})`,
    )
    .all(viewerUid, ...ids);
  const likedSet = new Set(likedRows.map((r) => r.comment_id));
  return rows.map((r) => ({ ...r, likedByMe: likedSet.has(r.id) }));
}

export function createComment({ id, contentKey, author, text, rating }) {
  const now = Date.now();
  getDb()
    .prepare(
      `INSERT INTO comments
         (id, content_key, author_uid, author_name, author_picture, text, rating, likes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    )
    .run(id, contentKey, author.uid, author.name || 'Foydalanuvchi', author.picture, text, rating ?? null, now);
  return {
    id,
    content_key: contentKey,
    author_uid: author.uid,
    author_name: author.name,
    author_picture: author.picture,
    text,
    rating: rating ?? null,
    likes: 0,
    created_at: now,
    likedByMe: false,
  };
}

export function deleteComment(id, requesterUid) {
  const d = getDb();
  const row = d.prepare('SELECT author_uid FROM comments WHERE id = ?').get(id);
  if (!row) return { ok: false, reason: 'not_found' };
  if (row.author_uid !== requesterUid) return { ok: false, reason: 'forbidden' };
  d.prepare('DELETE FROM comments WHERE id = ?').run(id);
  return { ok: true };
}

// Toggle like atomically. Returns { liked: boolean, likes: number } so the
// client can render the new count without a follow-up GET.
export function toggleCommentLike(commentId, userUid) {
  const d = getDb();
  const exists = d
    .prepare('SELECT 1 AS x FROM comment_likes WHERE comment_id = ? AND user_uid = ?')
    .get(commentId, userUid);
  const txn = d.transaction(() => {
    if (exists) {
      d.prepare('DELETE FROM comment_likes WHERE comment_id = ? AND user_uid = ?').run(commentId, userUid);
      d.prepare('UPDATE comments SET likes = MAX(0, likes - 1) WHERE id = ?').run(commentId);
    } else {
      d.prepare('INSERT INTO comment_likes (comment_id, user_uid, created_at) VALUES (?, ?, ?)').run(
        commentId,
        userUid,
        Date.now(),
      );
      d.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').run(commentId);
    }
  });
  txn();
  const fresh = d.prepare('SELECT likes FROM comments WHERE id = ?').get(commentId);
  return { liked: !exists, likes: fresh?.likes ?? 0 };
}

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
