import { casePages } from '$lib/data/site';

export function match(param: string): boolean {
  return casePages.some((item) => item.slug === param);
}
