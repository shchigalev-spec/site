import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const root = process.cwd();
const output = path.join(root, 'apps', 'a-modul', 'static', 'generated');
const artifacts = path.join(root, 'apps', 'a-modul', 'artifacts');
await mkdir(output, { recursive: true });

const jobs = [
  {
    base: 'a-modul-shift-hero-v2',
    input: path.join(artifacts, 'revision-r2', 'route-hero-candidates', 'shift', 'shift-candidate-02.png'),
    desktopPosition: 'centre', mobilePosition: 'attention'
  },
  {
    base: 'a-modul-office-hero-v2',
    input: path.join(artifacts, 'revision-r2', 'route-hero-candidates', 'office-abk', 'office-candidate-02.png'),
    desktopPosition: 'centre', mobilePosition: 'attention'
  },
  {
    base: 'a-modul-dormitory-hero-v2',
    input: path.join(artifacts, 'revision-r2', 'route-hero-candidates', 'dormitory', 'dormitory-candidate-02.png'),
    desktopPosition: 'centre', mobilePosition: 'attention'
  },
  {
    base: 'a-modul-lower-prepared',
    input: path.join(artifacts, 'revision-r1', 'hero-sequence', 'general-hero-v2-state-01-empty.png'),
    desktopPosition: 'centre', mobilePosition: 'attention'
  },
  {
    base: 'a-modul-lower-first-group',
    input: path.join(artifacts, 'revision-r1', 'hero-sequence', 'general-hero-v2-state-03-assembly.png'),
    desktopPosition: 'centre', mobilePosition: 'attention'
  },
  {
    base: 'a-modul-lower-connected',
    input: path.join(artifacts, 'revision-r2', 'lower-sequence', 'lower-state-03-connected.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-lower-engineering',
    input: path.join(artifacts, 'revision-r2', 'lower-sequence', 'lower-state-04-engineering.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-lower-operational',
    input: path.join(artifacts, 'revision-r1', 'hero-sequence', 'general-hero-v2-state-04-operational.png'),
    desktopPosition: 'centre', mobilePosition: 'attention'
  },
  {
    base: 'a-modul-factory-v2-frame',
    input: path.join(artifacts, 'revision-r2', 'factory-candidates', 'factory-candidate-01-selected-frame.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-factory-v2-envelope',
    input: path.join(artifacts, 'revision-r2', 'factory-candidates', 'factory-candidate-02-envelope.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-factory-v2-engineering',
    input: path.join(artifacts, 'revision-r2', 'factory-selected', 'factory-engineering.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-factory-v2-finishing',
    input: path.join(artifacts, 'revision-r2', 'factory-selected', 'factory-finishing.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-factory-v2-control',
    input: path.join(artifacts, 'revision-r2', 'factory-candidates', 'factory-candidate-03-control.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-factory-v2-shipment',
    input: path.join(artifacts, 'revision-r2', 'factory-selected', 'factory-shipment.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-case-kamchatka-v2',
    input: path.join(artifacts, 'revision-r2', 'dominant-case-candidates', 'dominant-case-candidate-01-selected.png'),
    desktopPosition: 'centre', mobilePosition: 'attention'
  },
  {
    base: 'a-modul-logistics-sea-v2',
    input: path.join(artifacts, 'revision-r2', 'dominant-case-candidates', 'dominant-case-candidate-03-logistics.png'),
    desktopPosition: 'centre', mobilePosition: 'centre'
  },
  {
    base: 'a-modul-final-cta-v2',
    input: path.join(artifacts, 'revision-r2', 'final-cta-candidates', 'final-cta-candidate-02-selected.png'),
    desktopPosition: 'centre', mobilePosition: 'attention'
  }
];

for (const job of jobs) {
  const desktop = sharp(job.input).resize(1920, 1080, { fit: 'cover', position: job.desktopPosition });
  const mobile = sharp(job.input).resize(820, 1080, { fit: 'cover', position: job.mobilePosition });
  await Promise.all([
    desktop.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(output, `${job.base}-desktop.avif`)),
    desktop.clone().webp({ quality: 81, effort: 6 }).toFile(path.join(output, `${job.base}-desktop.webp`)),
    mobile.clone().avif({ quality: 60, effort: 6 }).toFile(path.join(output, `${job.base}-mobile.avif`)),
    mobile.clone().webp({ quality: 79, effort: 6 }).toFile(path.join(output, `${job.base}-mobile.webp`))
  ]);
}

console.log(`Prepared ${jobs.length * 4} R2 image derivatives.`);
