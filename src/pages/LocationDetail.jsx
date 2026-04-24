import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WeatherCard from '../components/WeatherCard';
import FlightList from '../components/FlightList';
import FavoriteButton from '../components/FavoriteButton';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { fetchWeather } from '../api/weather';
import { fetchArrivals, fetchDepartures } from '../api/flights';
import { getSuggestedAirports } from '../data/airports';
import { useRecents } from '../context/RecentsContext';
import { useFavorites } from '../context/FavoritesContext';
import styles from './LocationDetail.module.css';

const SUGGESTED = getSuggestedAirports();

// Look up an airport by IATA in favorites, then recents, then the suggested
// list. Returns undefined if not found - we don't hit the API here because
// the user should have landed here from a search, which stashes the airport
// in recents.
function resolveAirport(iata, favorites, recents) {
  if (!iata) return undefined;
  const upper = iata.toUpperCase();
  return (
    favorites.find((a) => a.iata === upper) ||
    recents.find((a) => a.iata === upper) ||
    SUGGESTED.find((a) => a.iata === upper)
  );
}

// Show this many flights per list. Short lists read better than long ones.
const MAX_PER_LIST = 3;

// Aviationstack returns one record per marketing airline, so the same
// physical flight can show up multiple times. Using "departure time +
// arrival IATA" as a key collapses those duplicates.
function dedupeFlights(flights) {
  const seen = new Set();
  const out = [];
  for (const f of flights) {
    const key = `${f?.departure?.scheduled || ''}|${f?.arrival?.iata || ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

// The detail page at /location/:iata. Shows weather + arrivals + departures.
export default function LocationDetail() {
  const { iata } = useParams();
  const { recents, addRecent } = useRecents();
  const { favorites } = useFavorites();
  const airport = resolveAirport(iata, favorites, recents);

  // One state object for all three requests so partial results still render.
  // Arrivals and departures share an error field since they use the same
  // API and usually fail together.
  const [state, setState] = useState({
    weather: null,
    arrivals: null,
    departures: null,
    weatherError: null,
    flightsError: null,
    loading: true,
  });

  // Bumps when the user clicks "Try again" to force a refetch.
  const [attempt, setAttempt] = useState(0);

  // Add this airport to recents.
  useEffect(() => {
    if (airport) addRecent(airport);
  }, [airport, addRecent]);

  // Fetch weather + flights at the same time. allSettled lets one fail
  // without blocking the others.
  const load = useCallback(async () => {
    if (!airport) return;

    setState((s) => ({
      ...s,
      loading: true,
      weatherError: null,
      flightsError: null,
    }));

    // "City,Country" is more accurate than just the city name.
    const weatherQuery = `${airport.city},${airport.country}`;

    const [weatherResult, departuresResult, arrivalsResult] =
      await Promise.allSettled([
        fetchWeather(weatherQuery),
        fetchDepartures(airport.iata),
        fetchArrivals(airport.iata),
      ]);

    // Drop mismatched airports, remove duplicates, and cap the length.
    const cleanList = (raw, matchKey) =>
      Array.isArray(raw)
        ? dedupeFlights(raw.filter((f) => f?.[matchKey]?.iata === airport.iata))
            .slice(0, MAX_PER_LIST)
        : raw;

    const rawDepartures =
      departuresResult.status === 'fulfilled' ? departuresResult.value : null;
    const rawArrivals =
      arrivalsResult.status === 'fulfilled' ? arrivalsResult.value : null;

    setState({
      weather: weatherResult.status === 'fulfilled' ? weatherResult.value : null,
      departures: cleanList(rawDepartures, 'departure'),
      arrivals: cleanList(rawArrivals, 'arrival'),
      weatherError:
        weatherResult.status === 'rejected' ? weatherResult.reason : null,
      // Show whichever flights error happened first.
      flightsError:
        departuresResult.status === 'rejected'
          ? departuresResult.reason
          : arrivalsResult.status === 'rejected'
          ? arrivalsResult.reason
          : null,
      loading: false,
    });
  }, [airport]);

  // Run on mount, on IATA change, and on retry.
  useEffect(() => {
    load();
  }, [load, attempt]);

  // IATA from the URL didn't match anything we know about. User should go
  // back and search for it.
  if (!airport) {
    return (
      <div className="container">
        <ErrorMessage
          title="Airport not found"
          message={`"${iata}" isn't in your favorites, recent searches, or suggested locations. Use the search bar to pull it up.`}
        />
        <p className={styles.back}>
          <Link to="/">&larr; Back to search</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Just the favorite button up top - the city/airport name is in
          the WeatherCard hero. */}
      <header className={styles.head}>
        <FavoriteButton airport={airport} />
      </header>

      {state.loading && <Loader label="Loading weather and flights..." />}

      {/* Weather */}
      {!state.loading && (
        <div className={styles.block}>
          {state.weather ? (
            <WeatherCard data={state.weather} airport={airport} />
          ) : (
            <ErrorMessage
              title="Couldn't load weather"
              message={state.weatherError?.message}
              onRetry={() => setAttempt((n) => n + 1)}
            />
          )}
        </div>
      )}

      {/* Arrivals */}
      {!state.loading && (
        <div className={styles.block}>
          {state.arrivals ? (
            <FlightList
              flights={state.arrivals}
              city={airport.city}
              direction="arrivals"
            />
          ) : (
            <ErrorMessage
              title="Couldn't load arrivals"
              message={state.flightsError?.message}
              onRetry={() => setAttempt((n) => n + 1)}
            />
          )}
        </div>
      )}

      {/* Departures */}
      {!state.loading && (
        <div className={styles.block}>
          {state.departures ? (
            <FlightList
              flights={state.departures}
              city={airport.city}
              direction="departures"
            />
          ) : (
            <ErrorMessage
              title="Couldn't load departures"
              message={state.flightsError?.message}
              onRetry={() => setAttempt((n) => n + 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}
