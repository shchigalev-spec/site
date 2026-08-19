import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { findService, servicePages } from '$lib/data/site';

export const prerender = true;

export const entries = () => servicePages.map((page) => ({ service: page.slug }));

export const load: PageLoad = ({ params }) => {
  const service = findService(params.service);
  if (!service) error(404, 'Страница услуги не найдена');
  return { service };
};
