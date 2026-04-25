// Cloudflare Pages Function: /api/flights
// Proxies to Aviationstack. Uses dep_iata for departures, arr_iata for arrivals.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const dep = url.searchParams.get('dep_iata') || '';
  const arr = url.searchParams.get('arr_iata') || '';
  const limit = url.searchParams.get('limit') || '20';

  let upstream =
    `http://api.aviationstack.com/v1/flights` +
    `?access_key=${encodeURIComponent(context.env.AVIATIONSTACK_KEY)}` +
    `&limit=${encodeURIComponent(limit)}`;
  if (dep) upstream += `&dep_iata=${encodeURIComponent(dep)}`;
  if (arr) upstream += `&arr_iata=${encodeURIComponent(arr)}`;

  const r = await fetch(upstream);
  const data = await r.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      // Flights move faster than weather, but still cache 2 min.
      'Cache-Control': 's-maxage=120, stale-while-revalidate=300',
    },
  });
}
