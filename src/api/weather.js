// Calls /api/weather (proxied to Weatherstack by vite.config.js so the API
// key stays server-side). Throws on failure so the caller can show an error.

const ENDPOINT = '/api/weather';

// Fetch current weather. `query` can be a city, IATA code, or "lat,lon".
export async function fetchWeather(query) {
  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather request failed (${res.status})`);
  }

  const data = await res.json();

  // Weatherstack returns errors as 200 + { error: { info } }, so we check
  // the body too.
  if (data.error) {
    throw new Error(data.error.info || 'Weather service returned an error');
  }

  return data;
}
