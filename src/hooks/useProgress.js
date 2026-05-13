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
  readingProgress: {}, // { "boburnoma": { lastPage: 47, totalPages: 540, percent: 8.7, updatedAt: "2026-05-15" } }
};

function normalize(prev) {
  return {
    ...DEFAULT,
    ...prev,
    visited: { ...DEFAULT.visited, ...(prev?.visited || {}) },
    favorites: { ...DEFAULT.favorites, ...(prev?.favorites || {}) },
    streak: { ...DEFAULT.streak, ...(prev?.streak || {}) },
    quizScores: { ...(prev?.quizScores || {}) },
    readingProgress: { ...(prev?.readingProgress || {}) },
  };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  return new Date(Date.now() - 86400000).toISOString().slice(0, 10);
}

export default function useProgress() {
  const [state, setState] = useLocalStorage('meros:progress', DEFAULT);

  const visit = useCallback(
    (section, id, { points = 5, achievement = null } = {}) => {
      setState((prev) => {
        const safe = normalize(prev);
        const list = safe.visited[section] || [];
        if (list.includes(id)) return safe;
        return {
          ...safe,
          points: safe.points + points,
          visited: { ...safe.visited, [section]: [...list, id] },
          achievements:
            achievement && !safe.achievements.includes(achievement)
              ? [...safe.achievements, achievement]
              : safe.achievements,
        };
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
      if (safe.streak.lastVisit === today) return safe; // already counted
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
    (quizId, score) => {
      setState((prev) => {
        const safe = normalize(prev);
        const previous = safe.quizScores[quizId] || 0;
        const bonus = Math.max(0, score - previous) * 10;
        return {
          ...safe,
          points: safe.points + bonus,
          quizScores: { ...safe.quizScores, [quizId]: Math.max(previous, score) },
        };
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
        // Award 1 point for each new page read past the previous high-water mark.
        const previousMax = previous?.lastPage || 0;
        const newPagesRead = Math.max(0, page - previousMax);
        const bonus = newPagesRead;
        return {
          ...safe,
          points: safe.points + bonus,
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

  const reset = useCallback(() => setState(DEFAULT), [setState]);

  return {
    state: normalize(state),
    visit,
    setName,
    setAvatar,
    toggleFavorite,
    tickStreak,
    submitQuiz,
    setReadingProgress,
    clearReadingProgress,
    reset,
  };
}
