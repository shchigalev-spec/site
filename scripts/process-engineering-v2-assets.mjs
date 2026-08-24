import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('apps/engineering/static/generated');
const cleanHero = path.join(root, 'engineering-v2-hero-clean.png');

await sharp(cleanHero)
  .greyscale()
  .tint('#82918b')
  .modulate({ brightness: 0.92, saturation: 0.35 })
  .toFile(path.join(root, 'engineering-v2-hero-depth.png'));

await sharp(cleanHero)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.78, saturation: 0.72 })
  .toFile(path.join(root, 'engineering-v2-og.png'));

const files = (await fs.readdir(root)).filter((name) => /^engineering-v2-.*\.png$/.test(name));
for (const file of files) {
  const source = path.join(root, file);
  const base = path.join(root, file.slice(0, -4));
  await sharp(source)
    .rotate()
    .resize({ width: 2200, withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile(`${base}.webp`);
  await sharp(source)
    .rotate()
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 80, smartSubsample: true })
    .toFile(`${base}-960.webp`);
}

console.log(`Processed ${files.length} Engineering V2 PNG masters without touching apps/tech.`);
