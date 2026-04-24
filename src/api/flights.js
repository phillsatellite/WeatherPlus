// Calls /api/flights (proxied to Aviationstack). We filter by departure
// airport so the list shows flights leaving from the searched airport.

const ENDPOINT = '/api/flights';

// Pass either dep_iata (departures from) or arr_iata (arrivals to).
// Returns the `data` array from the response.
async function fetchFlights(params, limit = 20) {
  const qs = new URLSearchParams({ ...params, limit: String(limit) });
  const url = `${ENDPOINT}?${qs.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    // Nicer message for rate limits so the user knows it's a quota thing.
    if (res.status === 429) {
      throw new Error(
        "You've hit Aviationstack's rate limit. Wait a minute and try again, or check your monthly quota."
      );
    }
    throw new Error(`Flights request failed (${res.status})`);
  }

  const body = await res.json();

  // Aviationstack also reports some errors as 200 + error body.
  if (body.error) {
    const code = body.error.code;
    if (code === 'usage_limit_reached' || code === 'rate_limit_reached') {
      throw new Error(
        "You've hit Aviationstack's rate limit. Wait a minute and try again, or check your monthly quota."
      );
    }
    throw new Error(body.error.message || 'Flights service returned an error');
  }

  return Array.isArray(body.data) ? body.data : [];
}

// Flights leaving from the given airport.
export async function fetchDepartures(iata, limit = 20) {
  return fetchFlights({ dep_iata: iata }, limit);
}

// Flights arriving at the given airport.
export async function fetchArrivals(iata, limit = 20) {
  return fetchFlights({ arr_iata: iata }, limit);
}
