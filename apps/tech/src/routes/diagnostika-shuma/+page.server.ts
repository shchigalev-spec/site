import type { Actions } from './$types';
import { processDiagnostic } from '$lib/server/diagnostic-action';

export const actions: Actions = {
  default: async ({ request }) => processDiagnostic(await request.formData())
};
