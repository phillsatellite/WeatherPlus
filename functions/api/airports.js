// Cloudflare Pages Function: /api/airports
// Proxies to Aviationstack airport search (paid tier required).
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const search = url.searchParams.get('search') || '';
  const limit = url.searchParams.get('limit') || '10';

  let upstream =
    `http://api.aviationstack.com/v1/airports` +
    `?access_key=${encodeURIComponent(context.env.AVIATIONSTACK_KEY)}` +
    `&limit=${encodeURIComponent(limit)}`;
  if (search) upstream += `&search=${encodeURIComponent(search)}`;

  const r = await fetch(upstream);
  const data = await r.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      // Airport data barely changes - cache for an hour.
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
