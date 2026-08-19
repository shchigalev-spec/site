import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

function check(condition, message) {
  if (!condition) throw new Error(message);
}

const report = { startedAt: new Date().toISOString(), tech: {}, engineering: {}, failures: [] };
const browser = await chromium.launch();

try {
  const tech = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await tech.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    const selects = tech.locator('.scenario-controls select');
    await selects.nth(0).selectOption('voices');
    await selects.nth(1).selectOption('side');
    await selects.nth(2).selectOption('renovation');
    await selects.nth(3).selectOption({ label: 'спальня' });
    await selects.nth(4).selectOption('wall');
    await selects.nth(5).selectOption('balanced');
    await tech.locator('.scenario-controls textarea').fill('Контекст сценария');
    await tech.locator('.scenario-output .button').click();
    check(await tech.locator('select[name="heard"]').inputValue() !== '', 'Tech noise was not carried');
    check(await tech.locator('select[name="direction"]').inputValue() === 'side', 'Tech direction was not carried');
    check(await tech.locator('input[name="rooms"]').inputValue() === 'спальня', 'Tech room was not carried');
    check(await tech.locator('input[name="stage"][value="renovation"]').isChecked(), 'Tech stage was not carried');
    check(await tech.locator('input[name="path"]').inputValue() === 'wall', 'Tech path was not carried');
    check(await tech.locator('input[name="spaceLoss"]').inputValue() === 'balanced', 'Tech space loss was not carried');
    check(await tech.locator('textarea[name="comment"]').inputValue() === 'Контекст сценария', 'Tech comment was not carried');
    report.tech = { passed: true, fields: 7 };
  } catch (error) {
    report.failures.push(`tech: ${error.message}`);
  } finally {
    await tech.close();
  }

  const engineering = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await engineering.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' });
    await engineering.locator('#brief-noise').selectOption({ index: 2 });
    await engineering.locator('#brief-direction').selectOption({ label: 'сбоку' });
    await engineering.locator('#brief-stage').selectOption('progress');
    await engineering.locator('#brief-room').fill('кабинет');
    await engineering.locator('#brief-area').fill('одна стена');
    await engineering.locator('#brief-space').selectOption({ label: 'готов обсуждать' });
    await engineering.locator('#brief-comment').fill('Сохранить отделку');
    await engineering.getByRole('button', { name: 'Сформировать предварительный сценарий' }).click();
    await engineering.waitForTimeout(120);
    const scenarioLink = engineering.getByRole('link', { name: 'Передать вводные на диагностику' });
    report.engineering.href = await scenarioLink.getAttribute('href');
    const carriedNoise = new URL(report.engineering.href, engineering.url()).searchParams.get('noise');
    await scenarioLink.click();
    await engineering.waitForURL(/\/diagnostika-shuma\/?\?.*noise=/);
    await engineering.locator('textarea[name="heard"]').waitFor({ state: 'visible' });
    await engineering.waitForFunction(
      (expected) => (document.querySelector('textarea[name="heard"]'))?.value === expected,
      carriedNoise
    );
    check(await engineering.locator('textarea[name="heard"]').inputValue() === carriedNoise, 'Engineering noise was not carried');
    check(await engineering.locator('input[name="direction"]').inputValue() === 'сбоку', 'Engineering direction was not carried');
    check(await engineering.locator('input[name="rooms"]').inputValue() === 'кабинет', 'Engineering room was not carried');
    check(await engineering.locator('select[name="stage"]').inputValue() === 'ремонт идёт', 'Engineering stage was not mapped');
    check(await engineering.locator('input[name="area"]').inputValue() === 'одна стена', 'Engineering area was not carried');
    check(await engineering.locator('select[name="space"]').inputValue() === 'готов обсуждать', 'Engineering space was not carried');
    check(await engineering.locator('textarea[name="comment"]').inputValue() === 'Сохранить отделку', 'Engineering comment was not carried');
    await engineering.goto('http://127.0.0.1:5174/diagnostika-shuma/?service=shumoizolyatsiya-sten', { waitUntil: 'networkidle' });
    check((await engineering.locator('.carried-context').innerText()).includes('shumoizolyatsiya-sten'), 'Engineering service context was not exposed');
    report.engineering = { passed: true, fields: 8 };
  } catch (error) {
    report.failures.push(`engineering: ${error.message}`);
  } finally {
    await engineering.close();
  }
} finally {
  await browser.close();
}

report.finishedAt = new Date().toISOString();
await fs.writeFile(path.resolve('reviews', 'funnel-review.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.failures.length) process.exitCode = 1;
