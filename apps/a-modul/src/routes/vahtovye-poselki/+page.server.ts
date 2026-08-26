import type { PageServerLoad } from './$types';
import { resolveLandingData } from '$lib/content/routes';

export const load: PageServerLoad = ({ url }) => resolveLandingData('shift', url);
