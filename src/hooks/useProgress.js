import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage.js';

const DEFAULT = {
  name: 'Mehmon',
  points: 0,
  visited: { allomalar: [], muzeylar: [], musiqa: [], kinolar: [], kitoblar: [] },
  achievements: [],
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

  const setName = useCallback(
    (name) => setState((prev) => ({ ...DEFAULT, ...prev, name: name || 'Mehmon' })),
    [setState],
  );

  const reset = useCallback(() => setState(DEFAULT), [setState]);

  const safeState = { ...DEFAULT, ...state, visited: { ...DEFAULT.visited, ...(state?.visited || {}) } };

  return { state: safeState, visit, setName, reset };
}
