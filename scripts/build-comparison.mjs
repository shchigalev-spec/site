import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const comparison = path.join(root, 'comparison');
const screenshots = path.join(comparison, 'screenshots');

await fs.mkdir(screenshots, { recursive: true });

const concepts = [
  {
    id: 'tech', port: 5173, label: 'SIGNAL / TECH',
    summary: 'Кинематографичная диагностика: маршрут шума становится видимым до появления конструкции.',
    motion: 'Pinned hero из 4 состояний, noise deck, x-ray и интерактивная сборка.',
    strength: 'Сильнее объясняет сложную причинно-следственную связь и демонстрирует технологичность.',
    tradeoff: 'Требует больше внимания пользователя и более строгого контроля motion/performance.'
  },
  {
    id: 'engineering', port: 5174, label: 'QUIET / ENGINEERING',
    summary: 'Архитектурная редакционная подача: инженерная ясность, материальность и спокойное доверие.',
    motion: 'Сдержанный scroll-reveal, схемы пути и последовательное раскрытие узлов.',
    strength: 'Сильнее работает на доверие, чтение и длинный информационный сценарий.',
    tradeoff: 'Менее эффектно демонстрирует технологию на первом экране.'
  }
];

async function readScore(id) {
  try {
    const source = await fs.readFile(path.join(root, 'reviews', id, 'final', 'SCORECARD.md'), 'utf8');
    return source.match(/(\d{2,3})\s*\/\s*100/)?.[1] ?? '—';
  } catch {
    return '—';
  }
}

for (const concept of concepts) {
  concept.score = await readScore(concept.id);
  for (const viewport of ['desktop-1440', 'mobile-390']) {
    await fs.copyFile(
      path.join(root, 'reviews', concept.id, 'final', `${viewport}.png`),
      path.join(screenshots, `${concept.id}-${viewport}.png`)
    );
  }
}

const cards = concepts.map((concept) => `
  <article class="concept">
    <div class="concept-head">
      <div><p class="eyebrow">${concept.label}</p><h2>${concept.summary}</h2></div>
      <div class="score" aria-label="Оценка визуального супервизора"><strong>${concept.score}</strong><span>/100</span></div>
    </div>
    <p><a class="button" href="http://127.0.0.1:${concept.port}">Открыть локальную версию ↗</a></p>
    <div class="shots">
      <a href="screenshots/${concept.id}-desktop-1440.png"><img src="screenshots/${concept.id}-desktop-1440.png" alt="Полная desktop-версия ${concept.label}"></a>
      <a class="mobile" href="screenshots/${concept.id}-mobile-390.png"><img src="screenshots/${concept.id}-mobile-390.png" alt="Полная мобильная версия ${concept.label}"></a>
    </div>
    <dl>
      <div><dt>Motion</dt><dd>${concept.motion}</dd></div>
      <div><dt>Сильная сторона</dt><dd>${concept.strength}</dd></div>
      <div><dt>Trade-off</dt><dd>${concept.tradeoff}</dd></div>
    </dl>
  </article>`).join('');

const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Лаборатория тишины — сравнение концепций</title>
<style>
:root{color-scheme:light;--ink:#191d1b;--paper:#eee9df;--white:#fffdf8;--line:#cbc5b9}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 system-ui,-apple-system,sans-serif}main{max-width:1480px;margin:auto;padding:56px clamp(18px,4vw,64px) 100px}.intro{max-width:1040px}.eyebrow{font:600 11px/1.2 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#58645e}h1{max-width:13ch;margin:24px 0;font-size:clamp(48px,8vw,118px);line-height:.88;letter-spacing:-.06em}h2{max-width:20ch;margin:10px 0 22px;font-size:clamp(27px,3.2vw,54px);line-height:1;letter-spacing:-.035em}.lede{max-width:66ch;font-size:clamp(18px,2vw,25px)}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:64px 0}.concept{min-width:0;padding:clamp(20px,3vw,40px);background:var(--white);border:1px solid var(--line)}.concept-head{display:grid;grid-template-columns:1fr auto;gap:24px}.score{display:flex;align-items:baseline;align-self:start}.score strong{font-size:44px;line-height:1}.score span{color:#74756f}.button{display:inline-block;padding:13px 17px;background:var(--ink);color:var(--white);text-decoration:none}.shots{display:grid;grid-template-columns:minmax(0,1fr) minmax(90px,22%);gap:12px;align-items:start;margin:28px 0}.shots a{display:block;max-height:700px;overflow:auto;background:#111}.shots img{display:block;width:100%;height:auto}dl{margin:0}dl div{display:grid;grid-template-columns:130px 1fr;gap:18px;padding:16px 0;border-top:1px solid var(--line)}dt{font:600 11px/1.4 ui-monospace,monospace;text-transform:uppercase}dd{margin:0}.decision{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(30px,8vw,120px);padding-top:55px;border-top:1px solid var(--line)}.decision h2{font-size:clamp(38px,6vw,78px)}.decision li{margin-bottom:14px}.variables{padding:18px;border:1px solid var(--line);background:rgba(255,255,255,.35)}@media(max-width:900px){.grid,.decision{grid-template-columns:1fr}.concept-head{grid-template-columns:1fr}.shots{grid-template-columns:1fr 100px}dl div{grid-template-columns:1fr;gap:6px}}
</style></head><body><main>
<header class="intro"><p class="eyebrow">Лаборатория тишины · dual-site handoff</p><h1>Два независимых ответа на одну инженерную задачу</h1><p class="lede">Одинаковая проверенная фактология, маршруты и измеренные кейсы; разные арт-направления, драматургия и уровень интерактивности.</p></header>
<section class="grid">${cards}</section>
<section class="decision"><div><p class="eyebrow">Рекомендация</p><h2>Выбирать по характеру продажи.</h2></div><div>
<ul><li><strong>SIGNAL / TECH</strong> — если важно сделать диагностику и технологичность главным отличием бренда.</li><li><strong>QUIET / ENGINEERING</strong> — если приоритетны спокойное доверие, редакционная ясность и архитектурная аудитория.</li></ul>
<p class="variables"><strong>До публикации заполнить:</strong> реальные контакты и реквизиты, домены/canonical, подтверждённые детали кейсов, условия выезда, Bitrix24 webhook, ID Яндекс Метрики и политика обработки файлов.</p>
</div></section></main></body></html>`;

await fs.writeFile(path.join(comparison, 'index.html'), html);
console.log('comparison/index.html and comparison/screenshots updated');
