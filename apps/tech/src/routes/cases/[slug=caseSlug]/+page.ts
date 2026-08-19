import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { casePages, findCase } from '$lib/data/site';

export const prerender = true;
export const entries = () => casePages.map((item) => ({ slug: item.slug }));

export const load: PageLoad = ({ params }) => {
  const item = findCase(params.slug);
  if (!item) error(404, 'Кейс не найден');
  return { item };
};
