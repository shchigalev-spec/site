import { publicSiteOrigin } from '$lib/content/facts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${publicSiteOrigin}/sitemap.xml\n`;

  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'text/plain; charset=utf-8'
    }
  });
};
