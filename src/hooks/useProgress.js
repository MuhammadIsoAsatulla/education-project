import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage.js';

const DEFAULT = {
  name: 'Mehmon',
  points: 0,
  coins: 0,
  visited: { allomalar: [], muzeylar: [], musiqa: [], kinolar: [], kitoblar: [] },
  achievements: [],
  dailyGames: {},
  collection: [],
};

export default function useProgress() {
  const [state, setState] = useLocalStorage('meros:progress', DEFAULT);

  const visit = useCallback(
    (section, id, { points = 5, achievement = null } = {}) => {
      setState((prev) => {
        const safe = { ...DEFAULT, ...prev, visited: { ...DEFAULT.visited, ...(prev?.visited || {}) } };
        const list = safe.visited[section] || [];
        if (list.includes(id)) return safe;
        const next = {
          ...safe,
          points: safe.points + points,
          visited: { ...safe.visited, [section]: [...list, id] },
          achievements:
            achievement && !safe.achievements.includes(achievement)
              ? [...safe.achievements, achievement]
              : safe.achievements,
        };
        return next;
      });
    },
    [setState],
  );

  const addCoins = useCallback(
    (amount) =>
      setState((prev) => {
        const safe = { ...DEFAULT, ...prev };
        return { ...safe, coins: (safe.coins || 0) + amount };
      }),
    [setState],
  );

  const completeDailyGame = useCallback(
    (gameId, coinsEarned) => {
      const today = new Date().toISOString().slice(0, 10);
      setState((prev) => {
        const safe = { ...DEFAULT, ...prev, dailyGames: { ...(prev?.dailyGames || {}) } };
        const todayGames = safe.dailyGames[today] || {};
        if (todayGames[gameId]) return safe;
        return {
          ...safe,
          coins: (safe.coins || 0) + coinsEarned,
          dailyGames: {
            ...safe.dailyGames,
            [today]: { ...todayGames, [gameId]: { done: true, coins: coinsEarned } },
          },
        };
      });
    },
    [setState],
  );

  const buyHero = useCallback(
    (heroId, cost) => {
      setState((prev) => {
        const safe = {
          ...DEFAULT,
          ...prev,
          collection: prev?.collection || [],
          dailyGames: prev?.dailyGames || {},
        };
        if ((safe.coins || 0) < cost) return safe;
        if (safe.collection.includes(heroId)) return safe;
        return { ...safe, coins: safe.coins - cost, collection: [...safe.collection, heroId] };
      });
    },
    [setState],
  );

  const addToCollection = useCallback(
    (heroId) => {
      setState((prev) => {
        const safe = { ...DEFAULT, ...prev, collection: prev?.collection || [] };
        if (safe.collection.includes(heroId)) return safe;
        return { ...safe, collection: [...safe.collection, heroId] };
      });
    },
    [setState],
  );

  const setName = useCallback(
    (name) => setState((prev) => ({ ...DEFAULT, ...prev, name: name || 'Mehmon' })),
    [setState],
  );

  const reset = useCallback(() => setState(DEFAULT), [setState]);

  const safeState = {
    ...DEFAULT,
    ...state,
    visited: { ...DEFAULT.visited, ...(state?.visited || {}) },
    dailyGames: { ...(state?.dailyGames || {}) },
    collection: state?.collection || [],
  };

  return { state: safeState, visit, addCoins, completeDailyGame, buyHero, addToCollection, setName, reset };
}
