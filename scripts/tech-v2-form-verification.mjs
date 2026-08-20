import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const productionOrigin = process.env.TECH_PRODUCTION_ORIGIN || 'http://127.0.0.1:4173';
const serverErrorOrigin = process.env.TECH_SERVER_ERROR_ORIGIN || 'http://127.0.0.1:4176';
const developmentOrigin = process.env.TECH_DEVELOPMENT_ORIGIN || 'http://127.0.0.1:5175';
const output = path.resolve('reviews', 'tech-v2', 'slice-09', 'form-evidence.json');
const browser = await chromium.launch();

const report = {
  capturedAt: new Date().toISOString(),
  origins: { productionOrigin, serverErrorOrigin, developmentOrigin },
  clientFileValidation: {},
  productionGuard: {},
  serverError: {},
  developmentSuccess: {},
  analytics: {},
  failures: []
};

async function openShortForm(page, origin) {
  await page.goto(`${origin}/?utm_source=review&utm_medium=browser&utm_campaign=slice-09`, { waitUntil: 'networkidle' });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  const form = page.locator('#home-short-form form');
  await form.waitFor({ state: 'visible' });
  await form.scrollIntoViewIfNeeded();
  return form;
}

async function fillValidShortForm(form) {
  await form.locator('[name="heard"]').selectOption({ label: 'Топот и ударный шум сверху' });
  await form.locator('[name="stage"][value="renovation"]').check();
  await form.locator('[name="name"]').fill('Тест формы');
  await form.locator('[name="phone"]').fill('+7 999 000-00-00');
  await form.locator('[name="email"]').fill('form-review@example.test');
  await form.locator('[name="consent"]').check();
}

async function verifyFailure(origin) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const form = await openShortForm(page, origin);
  await fillValidShortForm(form);
  const beforeSubmit = await form.evaluate((node) => ({
    valid: node.checkValidity(),
    action: node.action,
    invalid: [...node.elements].filter((field) => typeof field.checkValidity === 'function' && !field.checkValidity()).map((field) => field.name)
  }));
  const responsePromise = page.waitForResponse((response) => response.request().method() === 'POST' && response.url().startsWith(origin), { timeout: 30_000 }).catch(() => null);
  await form.getByRole('button', { name: 'Разобрать мой шум' }).click();
  const response = await responsePromise;
  const message = form.locator('.form-message');
  await message.waitFor({ state: 'visible', timeout: 30_000 }).catch(async (error) => {
    const button = form.getByRole('button');
    throw new Error(`${error.message}\nDiagnostics: ${JSON.stringify({ beforeSubmit, response: response && { status: response.status(), url: response.url() }, button: { disabled: await button.isDisabled(), text: await button.innerText() }, url: page.url() })}`);
  });
  const result = {
    beforeSubmit,
    response: response && { status: response.status(), url: response.url() },
    heading: await message.locator('strong').innerText(),
    message: await message.locator('p').innerText(),
    preserved: {
      heard: await form.locator('[name="heard"]').inputValue(),
      stage: await form.locator('[name="stage"]:checked').inputValue(),
      name: await form.locator('[name="name"]').inputValue(),
      phone: await form.locator('[name="phone"]').inputValue(),
      email: await form.locator('[name="email"]').inputValue(),
      consent: await form.locator('[name="consent"]').isChecked()
    }
  };
  await context.close();
  return result;
}

try {
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const form = await openShortForm(page, productionOrigin);
    await form.locator('details.advanced summary').click();
    const fileInput = form.locator('input[type="file"]');
    await fileInput.setInputFiles({ name: 'payload.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('not executable') });
    const error = form.locator('.advanced > small.error');
    await error.waitFor({ state: 'visible' });
    report.clientFileValidation = {
      message: await error.innerText(),
      submitDisabled: await form.getByRole('button', { name: 'Разобрать мой шум' }).isDisabled()
    };
    await context.close();
  }

  report.productionGuard = await verifyFailure(productionOrigin);
  report.serverError = await verifyFailure(serverErrorOrigin);

  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const form = await openShortForm(page, developmentOrigin);
    await fillValidShortForm(form);
    await form.getByRole('button', { name: 'Разобрать мой шум' }).click();
    const message = form.locator('.form-message.success');
    await message.waitFor({ state: 'visible' });
    report.developmentSuccess = {
      heading: await message.locator('strong').innerText(),
      message: await message.locator('p').innerText(),
      mockLabelExposed: /mock|dev-/i.test(await message.innerText())
    };
    await context.close();
  }

  {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      window.__techYmCalls = [];
      window.ym = (...args) => window.__techYmCalls.push(args);
    });
    await context.route('https://mc.yandex.ru/**', (route) => route.abort());
    const page = await context.newPage();
    await page.goto(`${developmentOrigin}/?utm_source=review&utm_medium=browser&utm_campaign=slice-09`, { waitUntil: 'networkidle' });
    const renovationPlaceholder = page.locator('[data-deferred-chapter="renovation"]');
    await renovationPlaceholder.scrollIntoViewIfNeeded();
    const renovation = page.locator('#renovation-morph-panel');
    await renovation.waitFor({ state: 'visible' });
    await renovation.evaluate((node) => {
      const top = node.getBoundingClientRect().top + scrollY;
      scrollTo(0, top + Math.max(1, node.offsetHeight - innerHeight));
    });
    await page.waitForTimeout(250);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    const form = page.locator('#home-short-form form');
    await form.waitFor({ state: 'visible' });
    await form.scrollIntoViewIfNeeded();
    await form.locator('[name="name"]').focus();
    await page.waitForTimeout(100);
    const calls = await page.evaluate(() => window.__techYmCalls || []);
    const goals = calls.filter((call) => call[1] === 'reachGoal').map((call) => ({ event: call[2], payload: call[3] }));
    const serialized = JSON.stringify(goals);
    report.analytics = {
      goals,
      containsPersonalData: ['Тест формы', '+7 999 000-00-00', 'form-review@example.test'].some((value) => serialized.includes(value)),
      formStartedPayload: goals.find((goal) => goal.event === 'form_started')?.payload || null
    };
    await context.close();
  }

  if (!/неподдерживаемый формат/i.test(report.clientFileValidation.message || '') || !report.clientFileValidation.submitDisabled) report.failures.push('client file validation did not reject and disable submission');
  for (const [name, result] of [['production guard', report.productionGuard], ['server error', report.serverError]]) {
    if (result.heading !== 'Не удалось отправить' || !/Данные сохранены в форме/i.test(result.message || '')) report.failures.push(`${name} did not expose the recoverable server-confirmed error`);
    if (result.preserved?.name !== 'Тест формы' || result.preserved?.phone !== '+7 999 000-00-00' || result.preserved?.email !== 'form-review@example.test' || !result.preserved?.consent) report.failures.push(`${name} did not preserve submitted values`);
  }
  if (report.developmentSuccess.heading !== 'Заявка принята' || report.developmentSuccess.mockLabelExposed) report.failures.push('development mock was not successful or leaked a mock label into the UI');
  if (!report.analytics.formStartedPayload || report.analytics.formStartedPayload.concept !== 'tech' || report.analytics.formStartedPayload.page_type !== 'home' || report.analytics.formStartedPayload.form_mode !== 'short') report.failures.push('analytics payload taxonomy is incomplete');
  if (!report.analytics.goals.some((goal) => goal.event === 'renovation_sequence_complete' && goal.payload?.stage === 'finished')) report.failures.push('renovation completion analytics was not emitted');
  if (report.analytics.containsPersonalData) report.failures.push('analytics payload contains personal data');
} catch (error) {
  report.failures.push(error instanceof Error ? error.stack || error.message : String(error));
} finally {
  await browser.close();
}

await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
if (report.failures.length) process.exitCode = 1;
