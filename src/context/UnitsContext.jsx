import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Tracks the temperature unit ('C' or 'F') and saves it to localStorage.

const UnitsContext = createContext(null);
const STORAGE_KEY = 'weather-unlimited:units';

export function UnitsProvider({ children }) {
  // Default to F since most users here are in the US.
  const [units, setUnits] = useLocalStorage(STORAGE_KEY, 'F');

  const toggleUnits = useCallback(() => {
    setUnits((u) => (u === 'C' ? 'F' : 'C'));
  }, [setUnits]);

  const value = useMemo(
    () => ({ units, setUnits, toggleUnits }),
    [units, setUnits, toggleUnits]
  );

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits() {
  const ctx = useContext(UnitsContext);
  if (!ctx) {
    throw new Error('useUnits must be used inside <UnitsProvider>');
  }
  return ctx;
}
