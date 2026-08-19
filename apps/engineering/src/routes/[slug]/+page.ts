import { error } from '@sveltejs/kit';
import { findService } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const service = findService(params.slug);
  if (!service) error(404, 'Страница не найдена');
  return { service };
};
