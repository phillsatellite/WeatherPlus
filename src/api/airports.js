// Calls /api/airports (proxied to Aviationstack) and reshapes each result
// into our simpler { iata, city, name, country } shape.

const ENDPOINT = '/api/airports';

// Turn one Aviationstack record into our shape. Returns null if there's no
// IATA code, since we key everything by IATA.
function normalize(raw) {
  if (!raw || !raw.iata_code) return null;
  return {
    iata: raw.iata_code.toUpperCase(),
    city: raw.city_iata_code || raw.airport_name || raw.iata_code,
    name: raw.airport_name || raw.iata_code,
    country: raw.country_name || '',
  };
}

// Search airports by text. Empty query returns [] so we don't waste API
// calls on blank input.
export async function searchAirports(query, limit = 8) {
  const q = (query || '').trim();
  if (!q) return [];

  const qs = new URLSearchParams({ search: q, limit: String(limit) });
  const res = await fetch(`${ENDPOINT}?${qs.toString()}`);

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error(
        "You've hit Aviationstack's rate limit. Wait a minute and try again."
      );
    }
    throw new Error(`Airport search failed (${res.status})`);
  }

  const body = await res.json();

  // Aviationstack reports some errors as 200 + error body.
  if (body.error) {
    const code = body.error.code;
    if (code === 'usage_limit_reached' || code === 'rate_limit_reached') {
      throw new Error(
        "You've hit Aviationstack's rate limit. Wait a minute and try again."
      );
    }
    throw new Error(body.error.message || 'Airport search returned an error');
  }

  const list = Array.isArray(body.data) ? body.data : [];
  // Normalize, drop entries without IATA, and skip duplicates.
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const a = normalize(raw);
    if (!a) continue;
    if (seen.has(a.iata)) continue;
    seen.add(a.iata);
    out.push(a);
  }
  return out;
}
