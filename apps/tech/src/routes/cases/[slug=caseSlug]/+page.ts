import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { findCase } from '$lib/data/site';

export const prerender = false;

export const load: PageLoad = ({ params }) => {
  const item = findCase(params.slug);
  if (!item) error(404, 'Кейс не найден');
  return { item };
};
