import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const sourceDirectory = path.resolve('apps/tech/static/generated');
const outputDirectory = sourceDirectory;

async function writeFormats(input, basename, resize) {
  const pipeline = sharp(input).resize({ ...resize, withoutEnlargement: true });
  await Promise.all([
    pipeline.clone().png({ compressionLevel: 9 }).toFile(path.join(outputDirectory, `${basename}.png`)),
    pipeline.clone().webp({ quality: 86, smartSubsample: true }).toFile(path.join(outputDirectory, `${basename}.webp`)),
    pipeline.clone().avif({ quality: 58, effort: 7 }).toFile(path.join(outputDirectory, `${basename}.avif`))
  ]);
}

async function heroFamily(sourceName, targetName) {
  const input = path.join(sourceDirectory, sourceName);
  await writeFormats(input, targetName, { width: 1672 });
  await sharp(input)
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 82, smartSubsample: true })
    .toFile(path.join(outputDirectory, `${targetName}-960.webp`));
  await writeFormats(input, `${targetName.replace('hero-', 'hero-mobile-')}`, {
    width: 1024,
    height: 1536,
    fit: 'cover',
    position: 'centre'
  });
}

async function stageFamily(sourceName, stageName) {
  const input = path.join(sourceDirectory, sourceName);
  await writeFormats(input, `tech-v2-stage-${stageName}`, { width: 1672 });
  await sharp(input)
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 82, smartSubsample: true })
    .toFile(path.join(outputDirectory, `tech-v2-stage-${stageName}-960.webp`));
  await writeFormats(input, `tech-v2-stage-mobile-${stageName}`, {
    width: 1024,
    height: 1366,
    fit: 'cover',
    position: 'centre'
  });
}

async function serviceFamily(serviceName) {
  const basename = `tech-v2-service-${serviceName}`;
  const input = path.join(outputDirectory, `${basename}.png`);
  await Promise.all([
    sharp(input).resize({ width: 1672, withoutEnlargement: true }).webp({ quality: 86, smartSubsample: true }).toFile(path.join(outputDirectory, `${basename}.webp`)),
    sharp(input).resize({ width: 1672, withoutEnlargement: true }).avif({ quality: 58, effort: 7 }).toFile(path.join(outputDirectory, `${basename}.avif`)),
    sharp(input).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 82, smartSubsample: true }).toFile(path.join(outputDirectory, `${basename}-960.webp`))
  ]);
}

await fs.mkdir(outputDirectory, { recursive: true });
await heroFamily('tech-style-anchor.png', 'tech-v2-hero-clean');
await heroFamily('tech-hero-cutaway.png', 'tech-v2-hero-cutaway');
await stageFamily('tech-stage-newbuild.png', 'newbuild');
await stageFamily('tech-stage-renovation.png', 'renovation');
await stageFamily('tech-stage-finished.png', 'finished');
await Promise.all(['wall', 'ceiling', 'floor'].map(serviceFamily));

const cleanHero = path.join(sourceDirectory, 'tech-style-anchor.png');
await Promise.all([
  sharp(cleanHero)
    .resize({ width: 1672, withoutEnlargement: true })
    .greyscale()
    .linear(1.28, -22)
    .blur(18)
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDirectory, 'tech-v2-hero-depth.png')),
  sharp(cleanHero)
    .resize({ width: 1672, withoutEnlargement: true })
    .greyscale()
    .threshold(108)
    .blur(4)
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDirectory, 'tech-v2-hero-surface-mask.png'))
]);

const apartmentXray = path.join(outputDirectory, 'tech-v2-apartment-xray-base.png');
await Promise.all([
  sharp(apartmentXray).resize({ width: 1672, withoutEnlargement: true }).webp({ quality: 84, smartSubsample: true }).toFile(path.join(outputDirectory, 'tech-v2-apartment-xray-base.webp')),
  sharp(apartmentXray).resize({ width: 1672, withoutEnlargement: true }).avif({ quality: 55, effort: 7 }).toFile(path.join(outputDirectory, 'tech-v2-apartment-xray-base.avif')),
  sharp(apartmentXray).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80, smartSubsample: true }).toFile(path.join(outputDirectory, 'tech-v2-apartment-xray-base-960.webp'))
]);

const qualityControl = path.join(outputDirectory, 'tech-v2-quality-control.png');
await Promise.all([
  sharp(qualityControl).resize({ width: 1672, withoutEnlargement: true }).webp({ quality: 86, smartSubsample: true }).toFile(path.join(outputDirectory, 'tech-v2-quality-control.webp')),
  sharp(qualityControl).resize({ width: 1672, withoutEnlargement: true }).avif({ quality: 58, effort: 7 }).toFile(path.join(outputDirectory, 'tech-v2-quality-control.avif')),
  sharp(qualityControl).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 82, smartSubsample: true }).toFile(path.join(outputDirectory, 'tech-v2-quality-control-960.webp'))
]);

console.log('Tech V2 hero, renovation, service, x-ray, and quality-control packages created.');
