import { servicePages } from '$lib/data/site';

export function match(param: string): boolean {
  return servicePages.some((page) => page.slug === param);
}
