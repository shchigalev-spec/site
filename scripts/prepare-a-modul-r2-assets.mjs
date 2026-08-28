import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const masters = path.join(root, 'docs', 'generated-masters');
const generated = path.join(root, 'apps', 'a-modul', 'static', 'generated');

await mkdir(generated, { recursive: true });

const sources = {
  factoryMetal: 'a-modul-factory-metal-master-v2.png',
  factoryFrame: 'a-modul-factory-frame-master-v2.png',
  factoryEnvelope: 'a-modul-factory-envelope-master-v2.png',
  factoryEngineering: 'a-modul-factory-engineering-master-v2.png',
  factoryFinishing: 'a-modul-factory-finishing-master-v2.png',
  factoryControl: 'a-modul-factory-control-master-v2.png',
  factoryShipment: 'a-modul-factory-shipment-master-v2.png',
  shiftEmpty: 'a-modul-shift-hero-empty-site-master-v2.png',
  shiftComposition: 'a-modul-shift-composition-master-v2.png',
  shiftLogistics: 'a-modul-shift-logistics-master-v2.png',
  shiftSeismic: 'a-modul-shift-seismic-master-v2.png',
  shiftHero: 'a-modul-shift-final-master-v2.png',
  shiftFinal: 'a-modul-shift-final-master-v3.png',
  officePlan: 'a-modul-office-plan-master-v2.png',
  officeInterior: 'a-modul-office-interior-master-v2.png',
  officeHero: 'a-modul-office-final-master-v2.png',
  officeFinal: 'a-modul-office-final-master-v3.png',
  dormPlan: 'a-modul-dormitory-plan-master-v2.png',
  dormInterior: 'a-modul-dormitory-interior-master-v2.png',
  dormHero: 'a-modul-dormitory-final-master-v2.png',
  dormFinal: 'a-modul-dormitory-final-master-v3.png',
  generalFinal: 'a-modul-general-final-master-v3.png',
  logisticsRoad: 'a-modul-logistics-road-master-v2.png',
  logisticsRail: 'a-modul-logistics-rail-master-v2.png',
  logisticsSea: 'a-modul-logistics-sea-master-v2.png',
  logisticsWinter: 'a-modul-logistics-winter-road-master-v2.png'
};

const existing = {
  generalEmpty: path.join(generated, 'a-modul-general-hero-empty-site-desktop.webp'),
  generalOperational: path.join(generated, 'a-modul-general-hero-operational-object-desktop.webp'),
  originalFactory: path.join(generated, 'a-modul-factory-desktop.webp'),
  kamchatkaCase: path.join(generated, 'a-modul-case-kamchatka-desktop.webp'),
  officeCase: path.join(generated, 'a-modul-office-abk-desktop.webp'),
  dormCase: path.join(generated, 'a-modul-case-dormitories-300-desktop.webp')
};

const master = (name) => path.join(masters, sources[name]);

const responsive = [
  ['a-modul-factory-metal', master('factoryMetal')],
  ['a-modul-factory-frame', master('factoryFrame')],
  ['a-modul-factory-envelope', master('factoryEnvelope')],
  ['a-modul-factory-engineering', master('factoryEngineering')],
  ['a-modul-factory-finishing', master('factoryFinishing')],
  ['a-modul-factory-control', master('factoryControl')],
  ['a-modul-factory-shipment', master('factoryShipment')],
  ['a-modul-shift-hero-empty-site', master('shiftEmpty')],
  ['a-modul-shift-hero-operational-camp', master('shiftHero')],
  ['a-modul-shift-composition', master('shiftComposition')],
  ['a-modul-shift-logistics', master('shiftLogistics')],
  ['a-modul-shift-kamchatka-case', existing.kamchatkaCase],
  ['a-modul-shift-seismic', master('shiftSeismic')],
  ['a-modul-shift-final', master('shiftFinal')],
  ['a-modul-office-hero', master('officeHero')],
  ['a-modul-office-plan', master('officePlan')],
  ['a-modul-office-interior', master('officeInterior')],
  ['a-modul-abk-case', existing.officeCase],
  ['a-modul-office-final', master('officeFinal')],
  ['a-modul-dormitory-hero', master('dormHero')],
  ['a-modul-dormitory-plan', master('dormPlan')],
  ['a-modul-dormitory-interior', master('dormInterior')],
  ['a-modul-dormitory-300-case', existing.dormCase],
  ['a-modul-dormitory-final', master('dormFinal')],
  ['a-modul-logistics-road', master('logisticsRoad')],
  ['a-modul-logistics-rail', master('logisticsRail')],
  ['a-modul-logistics-sea', master('logisticsSea')],
  ['a-modul-logistics-winter-road', master('logisticsWinter')],
  ['a-modul-general-bim-site', existing.generalEmpty],
  ['a-modul-general-factory', existing.originalFactory],
  ['a-modul-general-logistics', master('logisticsRoad')],
  ['a-modul-general-case', existing.kamchatkaCase],
  ['a-modul-general-final', master('generalFinal')]
];

async function makeResponsive(name, input) {
  const desktop = sharp(input).resize(1600, 900, { fit: 'cover', position: 'centre' });
  const mobile = sharp(input).resize(720, 900, { fit: 'cover', position: 'attention' });

  await Promise.all([
    desktop.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(generated, `${name}-desktop.avif`)),
    desktop.clone().webp({ quality: 80, effort: 6 }).toFile(path.join(generated, `${name}-desktop.webp`)),
    mobile.clone().avif({ quality: 60, effort: 6 }).toFile(path.join(generated, `${name}-mobile.avif`)),
    mobile.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(generated, `${name}-mobile.webp`))
  ]);
}

for (const [name, input] of responsive) {
  await makeResponsive(name, input);
}

const socialCards = [
  ['a-modul-general-og', existing.generalOperational],
  ['a-modul-shift-og', master('shiftFinal')],
  ['a-modul-office-og', master('officeFinal')],
  ['a-modul-dormitory-og', master('dormFinal')]
];

for (const [name, input] of socialCards) {
  await sharp(input)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 84, progressive: true })
    .toFile(path.join(generated, `${name}.jpg`));
}

console.log(`Prepared ${responsive.length * 4 + socialCards.length} generated derivatives.`);
