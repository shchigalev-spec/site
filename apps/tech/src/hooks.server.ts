import type { Handle } from '@sveltejs/kit';

const deferredChapterCss = /\s*<link href="[^"]*\/(?:NoisePathLab|DiagnosisToConstruction|RenovationMorphV2|FiniteEvidenceGraph|MeasuredEvidenceV2|ScenarioLabV2|QualityFaq|ShortDiagnosticForm)\.[^"]+\.css" rel="stylesheet">/g;

export const handle: Handle = async ({ event, resolve }) => resolve(event, {
  transformPageChunk: ({ html }) => event.url.pathname === '/'
    ? html.replace(deferredChapterCss, '')
    : html
});
