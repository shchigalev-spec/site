import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const roots = [
  path.resolve('apps/tech/static/generated'),
  path.resolve('apps/engineering/static/generated')
];

for (const root of roots) {
  const files = (await fs.readdir(root)).filter((name) => name.endsWith('.png'));
  for (const file of files) {
    const source = path.join(root, file);
    const base = path.join(root, file.slice(0, -4));
    await sharp(source)
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 84, smartSubsample: true })
      .toFile(`${base}.webp`);
    await sharp(source)
      .rotate()
      .resize({ width: 960, withoutEnlargement: true })
      .webp({ quality: 80, smartSubsample: true })
      .toFile(`${base}-960.webp`);
    console.log(path.relative(process.cwd(), `${base}.webp`));
  }
}
