import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const root = process.cwd();
const masters = path.join(root, 'apps', 'a-modul', 'artifacts', 'revision-r1', 'hero-sequence');
const output = path.join(root, 'apps', 'a-modul', 'static', 'generated');
await mkdir(output, { recursive: true });

const states = [
  ['empty', 'general-hero-v2-state-01-empty.png'],
  ['foundations', 'general-hero-v2-state-02-foundations.png'],
  ['assembly', 'general-hero-v2-state-03-assembly.png'],
  ['operational', 'general-hero-v2-state-04-operational.png']
];

for (const [name, filename] of states) {
  const input = path.join(masters, filename);
  const desktop = sharp(input).resize(1920, 1080, { fit: 'cover', position: 'centre' });
  const mobile = sharp(input).resize(820, 1080, { fit: 'cover', position: 'attention' });
  const base = `a-modul-general-hero-v2-${name}`;
  await Promise.all([
    desktop.clone().avif({ quality: 64, effort: 6 }).toFile(path.join(output, `${base}-desktop.avif`)),
    desktop.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(output, `${base}-desktop.webp`)),
    mobile.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(output, `${base}-mobile.avif`)),
    mobile.clone().webp({ quality: 80, effort: 6 }).toFile(path.join(output, `${base}-mobile.webp`))
  ]);
}

await sharp(path.join(masters, 'general-hero-v2-state-04-operational.png'))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 86, progressive: true })
  .toFile(path.join(output, 'a-modul-general-og.jpg'));

console.log(`Prepared ${states.length * 4 + 1} R1 image derivatives.`);
