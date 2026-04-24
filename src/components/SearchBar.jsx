import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAirports } from '../api/airports';
import { useRecents } from '../context/RecentsContext';
import styles from './SearchBar.module.css';

// How long to wait after the user stops typing before we hit the API.
const DEBOUNCE_MS = 300;

// Search input with a dropdown. Shows autocomplete results when there's a
// query, or recent searches when the input is focused but empty.
export default function SearchBar({ onNotFound }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { recents, removeRecent, clearRecents, addRecent } = useRecents();

  // Keep the latest query so old responses don't overwrite newer ones.
  const latestQueryRef = useRef('');

  // Debounced search. Cleanup cancels the pending timer while the user
  // keeps typing.
  useEffect(() => {
    const q = query.trim();
    latestQueryRef.current = q;

    if (!q) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return undefined;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const results = await searchAirports(q, 6);
        // If the user typed more since this started, ignore the result.
        if (latestQueryRef.current !== q) return;
        setSuggestions(results);
      } catch (err) {
        if (latestQueryRef.current !== q) return;
        setError(err.message || 'Search failed');
        setSuggestions([]);
      } finally {
        if (latestQueryRef.current === q) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const hasQuery = query.trim().length > 0;

  // Decide which dropdown to show.
  let mode = null;
  if (focused && hasQuery) mode = 'suggestions';
  else if (focused && !hasQuery && recents.length > 0) mode = 'recents';

  // Go to the detail page and add to recents.
  function goToAirport(airport) {
    addRecent(airport);
    setQuery('');
    setFocused(false);
    navigate(`/location/${airport.iata}`);
  }

  // Enter key: use the first suggestion if we have one, else fire onNotFound.
  function handleSubmit(e) {
    e.preventDefault();
    if (suggestions.length > 0) {
      goToAirport(suggestions[0]);
    } else if (hasQuery && !loading && onNotFound) {
      onNotFound(query);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
      <div className={styles.inputWrap}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search a city or airport (e.g. London, LHR)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          // Small delay so a click on a suggestion registers before blur.
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          aria-label="Search a city or airport"
        />
        <button type="submit" className={styles.submit}>
          Search
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {mode === 'suggestions' && (
        <div className={styles.suggestions}>
          {loading && (
            <div className={styles.statusRow}>Searching…</div>
          )}
          {!loading && error && (
            <div className={`${styles.statusRow} ${styles.statusError}`}>
              {error}
            </div>
          )}
          {!loading && !error && suggestions.length === 0 && (
            <div className={styles.statusRow}>
              No airports match “{query.trim()}”.
            </div>
          )}
          {suggestions.length > 0 && (
            <ul className={styles.list}>
              {suggestions.map((a) => (
                <li key={a.iata}>
                  <button
                    type="button"
                    className={styles.suggestion}
                    // mouseDown fires before blur, so navigation still happens.
                    onMouseDown={() => goToAirport(a)}
                  >
                    <span className={styles.iata}>{a.iata}</span>
                    <span className={styles.city}>
                      {a.city}
                      {a.country && (
                        <span className={styles.country}>, {a.country}</span>
                      )}
                    </span>
                    <span className={styles.airportName}>{a.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Recent searches dropdown */}
      {mode === 'recents' && (
        <div className={styles.suggestions}>
          <div className={styles.recentsHeader}>
            <span className={styles.recentsLabel}>Recent searches</span>
            <button
              type="button"
              className={styles.clearAll}
              // mouseDown so it runs before the input's delayed blur.
              onMouseDown={(e) => {
                e.preventDefault();
                clearRecents();
              }}
            >
              Clear all
            </button>
          </div>
          <ul className={styles.recentsList}>
            {recents.map((a) => (
              <li key={a.iata} className={styles.recentRow}>
                <button
                  type="button"
                  className={styles.suggestion}
                  onMouseDown={() => goToAirport(a)}
                >
                  <span className={styles.iata}>{a.iata}</span>
                  <span className={styles.city}>
                    {a.city}
                    {a.country && (
                      <span className={styles.country}>, {a.country}</span>
                    )}
                  </span>
                  <span className={styles.airportName}>{a.name}</span>
                </button>
                <button
                  type="button"
                  className={styles.removeRecent}
                  aria-label={`Remove ${a.city} from recent searches`}
                  onMouseDown={(e) => {
                    // Stop the row from navigating and keep the dropdown open.
                    e.preventDefault();
                    e.stopPropagation();
                    removeRecent(a.iata);
                  }}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
