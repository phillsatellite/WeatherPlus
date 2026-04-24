import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Tracks recent searches. Newest first, no duplicates. Saved to localStorage.

const RecentsContext = createContext(null);

const STORAGE_KEY = 'weather-unlimited:recents';

export function RecentsProvider({ children }) {
  const [recents, setRecents] = useLocalStorage(STORAGE_KEY, []);

  // Add to the front. If it was already in the list, pull it out first so
  // it doesn't show up twice.
  const addRecent = useCallback(
    (airport) => {
      setRecents((prev) => {
        const filtered = prev.filter((a) => a.iata !== airport.iata);
        return [airport, ...filtered];
      });
    },
    [setRecents]
  );

  const removeRecent = useCallback(
    (iata) => {
      setRecents((prev) => prev.filter((a) => a.iata !== iata));
    },
    [setRecents]
  );

  const clearRecents = useCallback(() => setRecents([]), [setRecents]);

  const value = useMemo(
    () => ({ recents, addRecent, removeRecent, clearRecents }),
    [recents, addRecent, removeRecent, clearRecents]
  );

  return <RecentsContext.Provider value={value}>{children}</RecentsContext.Provider>;
}

export function useRecents() {
  const ctx = useContext(RecentsContext);
  if (!ctx) {
    throw new Error('useRecents must be used inside <RecentsProvider>');
  }
  return ctx;
}
