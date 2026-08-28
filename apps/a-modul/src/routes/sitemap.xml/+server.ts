import { publicSiteOrigin } from '$lib/content/facts';
import type { RequestHandler } from './$types';
const PRIMARY_ROUTES = [
  '/modulnye-zdaniya/',
  '/vahtovye-poselki/',
  '/modulnye-ofisy-abk/',
  '/modulnye-obshchezhitiya/'
] as const;

export const GET: RequestHandler = () => {
  const urls = PRIMARY_ROUTES.map(
    (path) => `  <url>\n    <loc>${publicSiteOrigin}${path}</loc>\n  </url>`
  ).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'application/xml; charset=utf-8'
    }
  });
};
