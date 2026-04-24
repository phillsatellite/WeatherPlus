import { useEffect, useState } from 'react';

// Like useState but reads/writes to localStorage so the value sticks around
// between page loads.
export function useLocalStorage(key, initialValue) {
  // Read from localStorage once on mount. If anything goes wrong, just use
  // the initial value.
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Save whenever the value changes. Wrapped in try/catch since Safari
  // private mode can throw.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore - app still works without persistence.
    }
  }, [key, value]);

  return [value, setValue];
}
