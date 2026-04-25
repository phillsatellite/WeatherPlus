// Cloudflare Pages Function: /api/weather
// Proxies to Weatherstack and attaches the access key from env.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const query = url.searchParams.get('query') || '';

  const upstream =
    `http://api.weatherstack.com/current` +
    `?access_key=${encodeURIComponent(context.env.WEATHERSTACK_KEY)}` +
    `&query=${encodeURIComponent(query)}`;

  const r = await fetch(upstream);
  const data = await r.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      // Cache 5 min on the edge, serve stale up to 10 min while revalidating.
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
  });
}
