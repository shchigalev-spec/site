import { redirect } from '@sveltejs/kit';

const allowedQuery = new Set(['type', 'region', 'mode', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid']);

export const load = ({ url }) => {
  const params = new URLSearchParams();
  for (const [key, value] of url.searchParams) {
    if (allowedQuery.has(key) && value) params.append(key, value.slice(0, 300));
  }
  const query = params.toString();
  redirect(307, `/modulnye-zdaniya/${query ? `?${query}` : ''}`);
};
