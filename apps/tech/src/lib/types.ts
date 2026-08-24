export type NoiseKey = 'impact' | 'voices' | 'bass' | 'lift' | 'road' | 'ventilation';
export type PathKey = 'ceiling' | 'wall' | 'floor' | 'socket' | 'ventilation' | 'junction';
export type StageKey = 'new-build' | 'renovation' | 'finished';

export interface NoiseProfile {
  key: NoiseKey;
  short: string;
  label: string;
  share: string;
  character: string;
  direction: string;
  likelyPaths: string[];
  cta: string;
  asset: string;
  wave: number[];
}

export interface ServicePage {
  slug: string;
  family: 'surface' | 'situation';
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  asset: string;
  assetAlt: string;
  visualMode: 'section' | 'vertical' | 'layers' | 'lateral' | 'shell' | 'protected';
  problem: string;
  diagnosticFocus: string[];
  approach: string[];
  limitation: string;
  related: { href: string; label: string }[];
  surface?: 'wall' | 'ceiling' | 'floor';
  symptom?: string;
  directRoutes?: string[];
  flankingRoutes?: string[];
  stageConstraints?: string[];
  relatedCase?: { href: string; label: string };
  faq?: { question: string; answer: string }[];
  residentialState?: string;
  decisionRisk?: string;
  likelyPaths?: string[];
  interventionConstraints?: string[];
  relatedSurfaces?: { href: string; label: string }[];
}

export interface CasePage {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  result: string;
  resultParts: string[];
  narrative: string;
  measured: string[];
  known: string[];
  unknown: string[];
  symptom: string;
  hypothesis: string;
  inspectedZones: string[];
  engineeringConclusion: string;
  interventionPrinciples: string[];
  graphType: 'envelope' | 'peak' | 'band';
  caveat: string;
  asset: string;
}

export interface DiagnosticContext {
  noise: NoiseKey | '';
  direction: string;
  path: PathKey | '';
  stage: StageKey | '';
  room: string;
  spaceLoss: string;
  comment: string;
}
