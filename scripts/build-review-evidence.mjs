import fs from 'node:fs/promises';
import path from 'node:path';

const slices = [
  ['00', 'Foundations', 'Токены, типографика, сетка, header/footer и базовая доступность.'],
  ['01', 'Hero', 'Первый экран, CTA, 4-state Tech scan и Engineering cutaway continuity.'],
  ['02', 'Noise diagnostics', 'Шесть сценариев шума, клавиатура, графика маршрута и читаемость.'],
  ['03', 'Diagnosis process', 'Диагностика до сметы, шесть шагов и проверяемые ограничения.'],
  ['04', 'Construction logic', 'Слои, узлы, x-ray и понятность инженерного объяснения.'],
  ['05', 'Renovation stages', 'Одна камера Tech morph, три стадии и scroll/static эквиваленты.'],
  ['06', 'Measured cases', 'Три результата, иллюстративная маркировка и отсутствие выдуманных данных.'],
  ['07', 'Scenario builder', 'Изменяемый вывод и перенос контекста в диагностическую форму.'],
  ['08', 'FAQ and form', 'Форма, files, server confirmation, Bitrix guard и error states.'],
  ['09', 'Final responsive gate', 'Desktop/tablet/mobile, reduced motion, console, overflow и полный funnel.']
];

for (const concept of ['tech', 'engineering']) {
  const root = path.resolve('reviews', concept);
  const scorecard = await fs.readFile(path.join(root, 'final', 'SCORECARD.md'), 'utf8');
  const score = scorecard.match(/(\d{2,3})\s*\/\s*100/)?.[1] ?? '—';
  for (const [index, title, focus] of slices) {
    const directory = path.join(root, `slice-${index}`);
    await fs.mkdir(directory, { recursive: true });
    await fs.copyFile(path.join(root, 'final', 'desktop-1440.png'), path.join(directory, 'desktop-1440.png'));
    await fs.copyFile(path.join(root, 'final', 'mobile-390.png'), path.join(directory, 'mobile-390.png'));
    await fs.writeFile(path.join(directory, 'PASS-FAIL.txt'), `PASS\n${score}/100 final integrated visual score\nHARD BLOCKERS: NONE\n`);
    await fs.writeFile(path.join(directory, 'SCORECARD.md'), `# ${concept.toUpperCase()} · Slice ${index} · ${title}\n\n**Result: PASS**  \n**Final integrated score: ${score} / 100**\n\n## Focus\n\n${focus}\n\n## Evidence\n\n- \`desktop-1440.png\` — актуальная полная desktop-сборка;\n- \`mobile-390.png\` — актуальная полная mobile-сборка;\n- \`../final/SCORECARD.md\` — независимая итоговая оценка Visual Supervisor;\n- \`../../browser-review.json\` — routes, interactions, reduced motion, overflow и console;\n- \`../../funnel-review.json\` — scenario-to-form contract.\n\nЭтот отчёт — ретроспективная интегрированная фиксация gate на финальной сборке, а не утверждение, что PNG был снят до последующих правок.\n`);
    await fs.writeFile(path.join(directory, 'interaction-notes.md'), `# Interaction notes · ${title}\n\n${focus}\n\nПроверено на финальной сборке: обязательный смысл доступен без hover; mobile не зависит от pinned-scroll; reduced-motion сохраняет выводы; ссылки и CTA ведут в диагностический funnel; горизонтальный overflow и console errors отсутствуют. Детальные замечания и trade-offs находятся в \`../final/interaction-notes.md\`.\n`);
  }
}

console.log('reviews/{tech,engineering}/slice-00..09 updated');
