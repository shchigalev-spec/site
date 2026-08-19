import type { RequestHandler } from './$types';
import { routePaths } from '$lib/data/site';

export const prerender = false;

export const GET: RequestHandler = ({ url }) => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routePaths.map((path) => `  <url><loc>${new URL(path, url.origin).toString().replace(/&/g, '&amp;')}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
};
