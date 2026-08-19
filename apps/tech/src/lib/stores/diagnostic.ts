import { writable } from 'svelte/store';
import type { DiagnosticContext } from '$lib/types';

export const diagnosticContext = writable<DiagnosticContext>({
  noise: '',
  direction: '',
  path: '',
  stage: '',
  room: '',
  spaceLoss: '',
  comment: ''
});
