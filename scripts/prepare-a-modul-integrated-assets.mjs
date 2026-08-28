import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const root = process.cwd();
const masters = path.join(root, 'apps', 'a-modul', 'artifacts', 'revision-r3', 'integrated-sequence');
const output = path.join(root, 'apps', 'a-modul', 'static', 'generated');
await mkdir(output, { recursive: true });

const frames = [
  ['a-modul-general-hero-v3-stakeout', 'hero-stakeout.png'],
  ['a-modul-bim-integrated-genplan', 'bim-genplan.png'],
  ['a-modul-bim-integrated-functional-layout', 'bim-functional-layout.png'],
  ['a-modul-bim-integrated-module-grid', 'bim-module-grid.png']
];

for (const [name, filename] of frames) {
  const input = path.join(masters, filename);
  const desktop = sharp(input).resize(1920, 1080, { fit: 'cover', position: 'centre' });
  const mobile = sharp(input).resize(820, 1080, { fit: 'cover', position: 'attention' });

  await Promise.all([
    desktop.clone().avif({ quality: 64, effort: 6 }).toFile(path.join(output, `${name}-desktop.avif`)),
    desktop.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(output, `${name}-desktop.webp`)),
    mobile.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(output, `${name}-mobile.avif`)),
    mobile.clone().webp({ quality: 80, effort: 6 }).toFile(path.join(output, `${name}-mobile.webp`))
  ]);
}

console.log(`Prepared ${frames.length * 4} integrated image derivatives.`);
