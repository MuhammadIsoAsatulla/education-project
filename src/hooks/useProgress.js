import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage.js';

const DEFAULT = {
  name: 'Mehmon',
  points: 0,
  visited: { allomalar: [], muzeylar: [], musiqa: [], kinolar: [], kitoblar: [] },
  achievements: [],
  avatar: 'girih-1',
  streak: { current: 0, longest: 0, lastVisit: null },
  favorites: { allomalar: [], muzeylar: [], musiqa: [], kinolar: [], kitoblar: [] },
  quizScores: {},
  readingProgress: {},
  // ── NEW: Muhr currency (3 tiers) ────────────────────────────────────────
  muhr: { bronze: 0, silver: 0, gold: 0 },
  muhrHistory: [],
  shopPurchases: [],
  // ── NEW: Daily challenge state ──────────────────────────────────────────
  daily: {
    completedDays: [],         // ISO date strings of completed challenges
    lastChallengeDate: null,
    lastChallengeId: null,
    challengeStreak: 0,
  },
  // ── NEW: Daily content tracking ────────────────────────────────────────
  dailyContent: {
    quotesSeen: [],            // IDs of quotes user has marked as "read"
    wordsKnown: [],            // IDs of "Kun So'zi" user knows
    wordsUnknown: [],          // marked as unknown
  },
  // ── NEW: Comments + likes (local) ──────────────────────────────────────
  comments: {},                // { "kitoblar/otkan-kunlar": [{id, text, rating, likes, ...}] }
  likedComments: [],           // IDs of comments this user has liked
  // ── NEW: Activity log (last 20) ─────────────────────────────────────────
  recentActivity: [],
  // ── NEW: User-chosen muhr style ─────────────────────────────────────────
  muhrStyle: 'classical',      // 'classical' | 'embroidered'
};

const POINTS_PER_BRONZE = 50;     // 50 points → 1 Bronza Muhr
const BRONZE_PER_SILVER = 10;     // 10 Bronza → 1 Kumush
const SILVER_PER_GOLD = 10;       // 10 Kumush → 1 Tilla

function normalize(prev) {
  return {
    ...DEFAULT,
    ...prev,
    visited: { ...DEFAULT.visited, ...(prev?.visited || {}) },
    favorites: { ...DEFAULT.favorites, ...(prev?.favorites || {}) },
    streak: { ...DEFAULT.streak, ...(prev?.streak || {}) },
    quizScores: { ...(prev?.quizScores || {}) },
    readingProgress: { ...(prev?.readingProgress || {}) },
    muhr: { ...DEFAULT.muhr, ...(prev?.muhr || {}) },
    muhrHistory: prev?.muhrHistory || [],
    shopPurchases: prev?.shopPurchases || [],
    daily: { ...DEFAULT.daily, ...(prev?.daily || {}) },
    dailyContent: { ...DEFAULT.dailyContent, ...(prev?.dailyContent || {}) },
    comments: { ...(prev?.comments || {}) },
    likedComments: prev?.likedComments || [],
    recentActivity: prev?.recentActivity || [],
  };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  return new Date(Date.now() - 86400000).toISOString().slice(0, 10);
}

function mkId(prefix = 'a') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function pushActivity(safe, type, payload) {
  const next = [
    { id: mkId('act'), type, payload, at: Date.now() },
    ...safe.recentActivity,
  ].slice(0, 30);
  return { ...safe, recentActivity: next };
}

// Auto-convert: every time points cross 50, mint a Bronza Muhr.
function maybeMintBronze(safe, oldPoints, newPoints) {
  const oldBronze = Math.floor(oldPoints / POINTS_PER_BRONZE);
  const newBronze = Math.floor(newPoints / POINTS_PER_BRONZE);
  const delta = newBronze - oldBronze;
  if (delta <= 0) return safe;
  const next = {
    ...safe,
    muhr: { ...safe.muhr, bronze: (safe.muhr.bronze || 0) + delta },
    muhrHistory: [
      {
        id: mkId('mh'),
        type: 'earned',
        muhrType: 'bronze',
        amount: delta,
        reason: 'Ball jamlash bonusi',
        at: Date.now(),
      },
      ...(safe.muhrHistory || []),
    ].slice(0, 50),
  };
  return pushActivity(next, 'muhr-earned', { kind: 'bronze', amount: delta });
}

export default function useProgress() {
  const [state, setState] = useLocalStorage('meros:progress', DEFAULT);

  const visit = useCallback(
    (section, id, { points = 5, achievement = null } = {}) => {
      setState((prev) => {
        const safe = normalize(prev);
        const list = safe.visited[section] || [];
        if (list.includes(id)) return safe;
        const newPoints = safe.points + points;
        let next = {
          ...safe,
          points: newPoints,
          visited: { ...safe.visited, [section]: [...list, id] },
          achievements:
            achievement && !safe.achievements.includes(achievement)
              ? [...safe.achievements, achievement]
              : safe.achievements,
        };
        next = pushActivity(next, 'visit', { section, id, points });
        return maybeMintBronze(next, safe.points, newPoints);
      });
    },
    [setState],
  );

  const setName = useCallback(
    (name) => setState((prev) => ({ ...normalize(prev), name: name || 'Mehmon' })),
    [setState],
  );

  const setAvatar = useCallback(
    (id) => setState((prev) => ({ ...normalize(prev), avatar: id })),
    [setState],
  );

  const setMuhrStyle = useCallback(
    (style) => setState((prev) => ({ ...normalize(prev), muhrStyle: style })),
    [setState],
  );

  const toggleFavorite = useCallback(
    (section, id) => {
      setState((prev) => {
        const safe = normalize(prev);
        const list = safe.favorites[section] || [];
        const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
        return { ...safe, favorites: { ...safe.favorites, [section]: next } };
      });
    },
    [setState],
  );

  const tickStreak = useCallback(() => {
    setState((prev) => {
      const safe = normalize(prev);
      const today = todayKey();
      if (safe.streak.lastVisit === today) return safe;
      const next =
        safe.streak.lastVisit === yesterdayKey() ? safe.streak.current + 1 : 1;
      return {
        ...safe,
        streak: {
          current: next,
          longest: Math.max(next, safe.streak.longest || 0),
          lastVisit: today,
        },
      };
    });
  }, [setState]);

  const submitQuiz = useCallback(
    (quizId, score, totalQuestions) => {
      setState((prev) => {
        const safe = normalize(prev);
        const previous = safe.quizScores[quizId]?.score || 0;
        const ptsPerCorrect = 10;
        const bonus = Math.max(0, score - previous) * ptsPerCorrect;
        const perfectBonus = score === totalQuestions && previous !== totalQuestions ? 1 : 0;
        const newPoints = safe.points + bonus;
        let next = {
          ...safe,
          points: newPoints,
          quizScores: {
            ...safe.quizScores,
            [quizId]: {
              score: Math.max(previous, score),
              total: totalQuestions,
              lastTaken: Date.now(),
            },
          },
          muhr: { ...safe.muhr, bronze: safe.muhr.bronze + perfectBonus * 2 },
        };
        if (perfectBonus > 0) {
          next.muhrHistory = [
            {
              id: mkId('mh'),
              type: 'earned',
              muhrType: 'bronze',
              amount: 2,
              reason: 'Viktorina mukammal: ' + quizId,
              at: Date.now(),
            },
            ...next.muhrHistory,
          ].slice(0, 50);
        }
        next = pushActivity(next, 'quiz', { quizId, score, total: totalQuestions, perfect: !!perfectBonus });
        return maybeMintBronze(next, safe.points, newPoints);
      });
    },
    [setState],
  );

  const setReadingProgress = useCallback(
    (slug, page, totalPages) => {
      setState((prev) => {
        const safe = normalize(prev);
        const previous = safe.readingProgress[slug];
        const percent = totalPages > 0 ? Math.round((page / totalPages) * 1000) / 10 : 0;
        const previousMax = previous?.lastPage || 0;
        const newPagesRead = Math.max(0, page - previousMax);
        const bonus = newPagesRead;
        const newPoints = safe.points + bonus;
        const next = {
          ...safe,
          points: newPoints,
          readingProgress: {
            ...safe.readingProgress,
            [slug]: {
              lastPage: Math.max(previousMax, page),
              totalPages,
              percent,
              updatedAt: new Date().toISOString().slice(0, 10),
            },
          },
        };
        return maybeMintBronze(next, safe.points, newPoints);
      });
    },
    [setState],
  );

  const clearReadingProgress = useCallback(
    (slug) => {
      setState((prev) => {
        const safe = normalize(prev);
        const next = { ...safe.readingProgress };
        delete next[slug];
        return { ...safe, readingProgress: next };
      });
    },
    [setState],
  );

  // ── NEW: Muhr currency actions ──────────────────────────────────────────
  const earnMuhr = useCallback(
    (type, amount, reason) => {
      setState((prev) => {
        const safe = normalize(prev);
        const next = {
          ...safe,
          muhr: { ...safe.muhr, [type]: (safe.muhr[type] || 0) + amount },
          muhrHistory: [
            { id: mkId('mh'), type: 'earned', muhrType: type, amount, reason, at: Date.now() },
            ...safe.muhrHistory,
          ].slice(0, 50),
        };
        return pushActivity(next, 'muhr-earned', { kind: type, amount, reason });
      });
    },
    [setState],
  );

  const spendMuhr = useCallback(
    (type, amount, itemId) => {
      let success = false;
      setState((prev) => {
        const safe = normalize(prev);
        if ((safe.muhr[type] || 0) < amount) return safe;
        success = true;
        const next = {
          ...safe,
          muhr: { ...safe.muhr, [type]: safe.muhr[type] - amount },
          shopPurchases: [...safe.shopPurchases, { itemId, at: Date.now(), type, amount }],
          muhrHistory: [
            {
              id: mkId('mh'),
              type: 'spent',
              muhrType: type,
              amount,
              reason: 'Sotib olish: ' + itemId,
              at: Date.now(),
            },
            ...safe.muhrHistory,
          ].slice(0, 50),
        };
        return pushActivity(next, 'shop-purchase', { itemId, type, amount });
      });
      return success;
    },
    [setState],
  );

  const convertMuhr = useCallback(
    (fromType) => {
      let success = false;
      setState((prev) => {
        const safe = normalize(prev);
        if (fromType === 'bronze' && safe.muhr.bronze >= BRONZE_PER_SILVER) {
          success = true;
          const next = {
            ...safe,
            muhr: {
              ...safe.muhr,
              bronze: safe.muhr.bronze - BRONZE_PER_SILVER,
              silver: safe.muhr.silver + 1,
            },
            muhrHistory: [
              {
                id: mkId('mh'),
                type: 'converted',
                muhrType: 'silver',
                amount: 1,
                reason: `${BRONZE_PER_SILVER} bronza → 1 kumush`,
                at: Date.now(),
              },
              ...safe.muhrHistory,
            ].slice(0, 50),
          };
          return pushActivity(next, 'muhr-converted', { to: 'silver' });
        }
        if (fromType === 'silver' && safe.muhr.silver >= SILVER_PER_GOLD) {
          success = true;
          const next = {
            ...safe,
            muhr: {
              ...safe.muhr,
              silver: safe.muhr.silver - SILVER_PER_GOLD,
              gold: safe.muhr.gold + 1,
            },
            muhrHistory: [
              {
                id: mkId('mh'),
                type: 'converted',
                muhrType: 'gold',
                amount: 1,
                reason: `${SILVER_PER_GOLD} kumush → 1 tilla`,
                at: Date.now(),
              },
              ...safe.muhrHistory,
            ].slice(0, 50),
          };
          return pushActivity(next, 'muhr-converted', { to: 'gold' });
        }
        return safe;
      });
      return success;
    },
    [setState],
  );

  // ── NEW: Daily Challenge actions ────────────────────────────────────────
  const completeDailyChallenge = useCallback(
    (challengeId) => {
      setState((prev) => {
        const safe = normalize(prev);
        const today = todayKey();
        if (safe.daily.completedDays.includes(today)) return safe;
        const yesterdayCompleted = safe.daily.completedDays.includes(yesterdayKey());
        const newStreak = yesterdayCompleted ? safe.daily.challengeStreak + 1 : 1;
        const next = {
          ...safe,
          points: safe.points + 50,
          muhr: { ...safe.muhr, bronze: safe.muhr.bronze + 5 },
          daily: {
            ...safe.daily,
            completedDays: [...safe.daily.completedDays, today],
            lastChallengeDate: today,
            lastChallengeId: challengeId,
            challengeStreak: newStreak,
          },
          muhrHistory: [
            {
              id: mkId('mh'),
              type: 'earned',
              muhrType: 'bronze',
              amount: 5,
              reason: 'Kunlik vazifa bajardingiz',
              at: Date.now(),
            },
            ...safe.muhrHistory,
          ].slice(0, 50),
        };
        return pushActivity(next, 'daily-completed', { challengeId, streak: newStreak });
      });
    },
    [setState],
  );

  // ── NEW: Comments actions (local) ──────────────────────────────────────
  const addComment = useCallback(
    (contentKey, { text, rating }) => {
      setState((prev) => {
        const safe = normalize(prev);
        const newComment = {
          id: mkId('c'),
          author: { name: safe.name || 'Mehmon', avatar: safe.avatar },
          text,
          rating: rating || null,
          likes: 0,
          createdAt: Date.now(),
        };
        const arr = safe.comments[contentKey] || [];
        const next = {
          ...safe,
          comments: { ...safe.comments, [contentKey]: [newComment, ...arr] },
          points: safe.points + 3, // 3 points for commenting
        };
        return pushActivity(next, 'comment-added', { contentKey });
      });
    },
    [setState],
  );

  const likeComment = useCallback(
    (contentKey, commentId) => {
      setState((prev) => {
        const safe = normalize(prev);
        const isLiked = safe.likedComments.includes(commentId);
        const arr = safe.comments[contentKey] || [];
        const updatedArr = arr.map((c) =>
          c.id === commentId ? { ...c, likes: Math.max(0, (c.likes || 0) + (isLiked ? -1 : 1)) } : c,
        );
        return {
          ...safe,
          comments: { ...safe.comments, [contentKey]: updatedArr },
          likedComments: isLiked
            ? safe.likedComments.filter((x) => x !== commentId)
            : [...safe.likedComments, commentId],
        };
      });
    },
    [setState],
  );

  const deleteComment = useCallback(
    (contentKey, commentId) => {
      setState((prev) => {
        const safe = normalize(prev);
        const arr = safe.comments[contentKey] || [];
        return {
          ...safe,
          comments: { ...safe.comments, [contentKey]: arr.filter((c) => c.id !== commentId) },
        };
      });
    },
    [setState],
  );

  // ── NEW: Daily content actions ──────────────────────────────────────────
  const markQuoteSeen = useCallback(
    (quoteId) => {
      setState((prev) => {
        const safe = normalize(prev);
        if (safe.dailyContent.quotesSeen.includes(quoteId)) return safe;
        const newPoints = safe.points + 5;
        const next = {
          ...safe,
          points: newPoints,
          dailyContent: {
            ...safe.dailyContent,
            quotesSeen: [...safe.dailyContent.quotesSeen, quoteId],
          },
        };
        return maybeMintBronze(next, safe.points, newPoints);
      });
    },
    [setState],
  );

  const markWord = useCallback(
    (wordId, known) => {
      setState((prev) => {
        const safe = normalize(prev);
        const knownList = safe.dailyContent.wordsKnown.filter((x) => x !== wordId);
        const unknownList = safe.dailyContent.wordsUnknown.filter((x) => x !== wordId);
        const next = {
          ...safe,
          dailyContent: {
            ...safe.dailyContent,
            wordsKnown: known ? [...knownList, wordId] : knownList,
            wordsUnknown: !known ? [...unknownList, wordId] : unknownList,
          },
        };
        return next;
      });
    },
    [setState],
  );

  const reset = useCallback(() => setState(DEFAULT), [setState]);

  return {
    state: normalize(state),
    visit,
    setName,
    setAvatar,
    setMuhrStyle,
    toggleFavorite,
    tickStreak,
    submitQuiz,
    setReadingProgress,
    clearReadingProgress,
    earnMuhr,
    spendMuhr,
    convertMuhr,
    completeDailyChallenge,
    addComment,
    likeComment,
    deleteComment,
    markQuoteSeen,
    markWord,
    reset,
  };
}
