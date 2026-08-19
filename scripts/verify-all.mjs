const routes = [
  '/', '/shumoizolyatsiya-kvartiry/', '/shumoizolyatsiya-sten/',
  '/shumoizolyatsiya-potolka/', '/shumoizolyatsiya-pola/',
  '/shumoizolyatsiya-ot-sosedey/', '/shumoizolyatsiya-v-novostroyke/',
  '/shumoizolyatsiya-v-gotovoy-kvartire/', '/diagnostika-shuma/',
  '/cases/', '/cases/58-39-db/', '/cases/impact-noise-minus-16-db/',
  '/cases/64-43-db/', '/privacy/', '/privacy-policy/'
];
const origins = [
  ['tech', process.env.TECH_ORIGIN ?? 'http://127.0.0.1:5173'],
  ['engineering', process.env.ENGINEERING_ORIGIN ?? 'http://127.0.0.1:5174']
];
let failed = false;
for (const [concept, origin] of origins) {
  for (const route of routes) {
    try {
      const response = await fetch(new URL(route, origin), { redirect: 'manual' });
      const ok = response.status >= 200 && response.status < 400;
      console.log(`${ok ? 'PASS' : 'FAIL'} ${concept} ${response.status} ${route}`);
      failed ||= !ok;
    } catch (error) {
      console.error(`FAIL ${concept} ${route}: ${error.message}`);
      failed = true;
    }
  }
}
process.exitCode = failed ? 1 : 0;
