import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Holds the list of saved airports and helpers to add/remove them.
// Saved to localStorage so favorites survive refresh.

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'weather-unlimited:favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEY, []);

  // Add an airport, but skip if it's already in the list.
  const addFavorite = useCallback(
    (airport) => {
      setFavorites((prev) =>
        prev.some((a) => a.iata === airport.iata) ? prev : [...prev, airport]
      );
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (iata) => {
      setFavorites((prev) => prev.filter((a) => a.iata !== iata));
    },
    [setFavorites]
  );

  // Used by the star button - adds if missing, removes if already saved.
  const toggleFavorite = useCallback(
    (airport) => {
      setFavorites((prev) =>
        prev.some((a) => a.iata === airport.iata)
          ? prev.filter((a) => a.iata !== airport.iata)
          : [...prev, airport]
      );
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (iata) => favorites.some((a) => a.iata === iata),
    [favorites]
  );

  const value = useMemo(
    () => ({ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }),
    [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// Shortcut hook. Throws if used outside the provider so the mistake is easy
// to spot.
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>');
  }
  return ctx;
}
