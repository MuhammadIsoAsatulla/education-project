import { useCallback, useEffect, useRef } from 'react';
import useLocalStorage from './useLocalStorage.js';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const DEFAULT = {
  name: 'Mehmon',
  points: 0,
  coins: 0,
  visited: { allomalar: [], muzeylar: [], musiqa: [], kinolar: [], kitoblar: [] },
  achievements: [],
  dailyGames: {},
  collection: [],
};

function safeState(raw) {
  return {
    ...DEFAULT,
    ...raw,
    visited: { ...DEFAULT.visited, ...(raw?.visited || {}) },
    dailyGames: { ...(raw?.dailyGames || {}) },
    collection: raw?.collection || [],
  };
}

export default function useProgress() {
  const [state, setState] = useLocalStorage('meros:progress', DEFAULT);
  const { user } = useAuth();
  const syncTimer = useRef(null);

  // Load profile from Supabase on login
  useEffect(() => {
    if (!user) return;

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data) {
          // Merge: take whichever has more progress
          setState((prev) => {
            const local = safeState(prev);
            return {
              ...local,
              name:         data.name || local.name,
              points:       Math.max(data.points || 0, local.points),
              coins:        Math.max(data.coins  || 0, local.coins),
              achievements: [...new Set([...(data.achievements || []), ...local.achievements])],
              collection:   [...new Set([...(data.collection  || []), ...local.collection])],
              visited:      mergeVisited(data.visited, local.visited),
              dailyGames:   { ...(local.dailyGames || {}), ...(data.daily_games || {}) },
            };
          });
        } else if (error?.code === 'PGRST116') {
          // No profile yet — push local data up
          const s = safeState(state);
          supabase.from('profiles').insert({
            id:           user.id,
            name:         s.name,
            points:       s.points,
            coins:        s.coins,
            achievements: s.achievements,
            collection:   s.collection,
            visited:      s.visited,
            daily_games:  s.dailyGames,
          });
        }
      });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced sync to Supabase whenever state changes
  useEffect(() => {
    if (!user) return;
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      const s = safeState(state);
      supabase.from('profiles').upsert({
        id:           user.id,
        name:         s.name,
        points:       s.points,
        coins:        s.coins,
        achievements: s.achievements,
        collection:   s.collection,
        visited:      s.visited,
        daily_games:  s.dailyGames,
        updated_at:   new Date().toISOString(),
      });
    }, 1500);
    return () => clearTimeout(syncTimer.current);
  }, [user, state]);

  const visit = useCallback(
    (section, id, { points = 5, achievement = null } = {}) => {
      setState((prev) => {
        const s = safeState(prev);
        const list = s.visited[section] || [];
        if (list.includes(id)) return s;
        return {
          ...s,
          points: s.points + points,
          visited: { ...s.visited, [section]: [...list, id] },
          achievements:
            achievement && !s.achievements.includes(achievement)
              ? [...s.achievements, achievement]
              : s.achievements,
        };
      });
    },
    [setState],
  );

  const addCoins = useCallback(
    (amount) =>
      setState((prev) => {
        const s = safeState(prev);
        return { ...s, coins: s.coins + amount };
      }),
    [setState],
  );

  const completeDailyGame = useCallback(
    (gameId, coinsEarned) => {
      const today = new Date().toISOString().slice(0, 10);
      setState((prev) => {
        const s = safeState(prev);
        const todayGames = s.dailyGames[today] || {};
        if (todayGames[gameId]) return s;
        return {
          ...s,
          coins: s.coins + coinsEarned,
          dailyGames: {
            ...s.dailyGames,
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
        const s = safeState(prev);
        if (s.coins < cost || s.collection.includes(heroId)) return s;
        return { ...s, coins: s.coins - cost, collection: [...s.collection, heroId] };
      });
    },
    [setState],
  );

  const addToCollection = useCallback(
    (heroId) => {
      setState((prev) => {
        const s = safeState(prev);
        if (s.collection.includes(heroId)) return s;
        return { ...s, collection: [...s.collection, heroId] };
      });
    },
    [setState],
  );

  const setName = useCallback(
    (name) => setState((prev) => ({ ...safeState(prev), name: name || 'Mehmon' })),
    [setState],
  );

  const reset = useCallback(() => setState(DEFAULT), [setState]);

  return {
    state: safeState(state),
    visit,
    addCoins,
    completeDailyGame,
    buyHero,
    addToCollection,
    setName,
    reset,
  };
}

function mergeVisited(remote = {}, local = {}) {
  const keys = [...new Set([...Object.keys(remote), ...Object.keys(local)])];
  const merged = {};
  for (const k of keys) {
    merged[k] = [...new Set([...(remote[k] || []), ...(local[k] || [])])];
  }
  return merged;
}
