import { error } from '@sveltejs/kit';
import { findCase } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const item = findCase(params.slug);
  if (!item) error(404, 'Результат не найден');
  return { item };
};
