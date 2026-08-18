import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the product-specific home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Лаборатория тишины/);
  assert.match(html, /Сначала найдём, как шум попадает в комнату/);
  assert.match(html, /15 лет работаем с шумом и вибрацией/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("renders a unique service route", async () => {
  const response = await render("/shumoizolyatsiya-sten");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Шумоизоляция стен в квартире начинается с проверки обходных путей/);
  assert.match(html, /Розетки/);
});

test("keeps internal design lab out of search", async () => {
  const response = await render("/design-lab");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /noindex/);
  assert.match(html, /Acoustic Blueprint/);
});

test("case detail uses its own title", async () => {
  const response = await render("/cases/street-home-office");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Уличный шум в домашнем кабинете/);
  assert.match(html, /64 dB/);
  assert.match(html, /43 dB/);
});

