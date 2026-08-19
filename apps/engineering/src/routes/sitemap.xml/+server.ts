import type { RequestHandler } from './$types';
import { allPublicPaths } from '$lib/content';

export const GET: RequestHandler = ({ url }) => {
  const origin = url.origin;
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allPublicPaths.map((path) => `\n  <url><loc>${origin}${path}</loc></url>`).join('')}\n</urlset>`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
};
