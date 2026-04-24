import { useEffect, useRef, useState } from 'react';

// Runs an async fetcher and returns { data, error, loading }. Re-runs when
// `deps` change.
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tracks whether the component is still mounted so we don't call setState
  // after unmount.
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Reset so the UI doesn't show stale data while refetching.
    setLoading(true);
    setError(null);
    setData(null);

    fetcher()
      .then((result) => {
        if (cancelled || !aliveRef.current) return;
        setData(result);
      })
      .catch((err) => {
        if (cancelled || !aliveRef.current) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled || !aliveRef.current) return;
        setLoading(false);
      });

    // If deps change before the fetch finishes, ignore the old result.
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}
