/**
 * Adversarial tests for the browser code sandbox (ADR-0007). They need a build with
 * NEXT_PUBLIC_ENABLE_CODE_RUNNER=1 (`npm run build:e2e`). Each test plays a hostile
 * program and checks the boundary from outside: the page, its storage, the server,
 * and the browser's list of running workers.
 */
import http from "node:http";
import type { AddressInfo } from "node:net";
import { expect, test, type Page } from "@playwright/test";

async function openRunner(page: Page) {
  await page.goto("/algorithms/kruskal#code");
  await page.getByRole("button", { name: "JavaScript" }).click();
  await expect(page.locator("#runner-code")).toBeVisible();
}

async function start(page: Page, code: string) {
  await page.locator("#runner-code").fill(code);
  await page.getByRole("button", { name: "Run", exact: true }).click();
}

async function finished(page: Page) {
  const status = page.getByTestId("run-status");
  await expect(status).not.toHaveAttribute("data-status", /^(running|idle)$/, { timeout: 15_000 });
  return {
    status: await status.getAttribute("data-status"),
    message: await status.innerText(),
    output: await page.getByTestId("run-output").innerText(),
  };
}

async function run(page: Page, code: string) {
  await start(page, code);
  return finished(page);
}

/** Running workers, including ones stuck in a loop, must be gone a few seconds after a run ends. */
async function expectNoWorkers(page: Page) {
  await expect.poll(() => page.workers().length, { timeout: 8_000 }).toBe(0);
}

test.beforeEach(async ({ page }) => openRunner(page));

test("runs the lesson's code and prints its result", async ({ page }) => {
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const r = await finished(page);
  expect(r.status).toBe("ok");
  expect(r.output.trim()).toBe("6");
  await expectNoWorkers(page);
});

test("reports syntax and runtime errors at the user's line", async ({ page }) => {
  const syntax = await run(page, "let a = 1;\nlet b = ;");
  expect(syntax.status).toBe("error");
  expect(syntax.message).toContain("SyntaxError");
  expect(syntax.message).toContain("(line 2)");
  const runtime = await run(page, 'console.log("before");\n\nnull.x;');
  expect(runtime.status).toBe("error");
  expect(runtime.message).toContain("TypeError");
  expect(runtime.message).toContain("(line 3)");
  expect(runtime.output.trim()).toBe("before");
});

test("an infinite loop hits the time limit, the page stays responsive, and the worker is terminated", async ({
  page,
}) => {
  const started = Date.now();
  await start(page, "while (true) {}");
  // The loop runs on another thread, so the page keeps answering.
  const t = Date.now();
  await page.evaluate(() => document.title);
  expect(Date.now() - t).toBeLessThan(1000);
  const frame = page.locator("iframe.sandbox-frame");
  await expect(frame).toHaveAttribute("sandbox", "allow-scripts");
  const r = await finished(page);
  expect(r.status).toBe("timeout");
  expect(Date.now() - started).toBeLessThan(6000);
  await expect(frame).toHaveCount(0);
  await expectNoWorkers(page);
  expect((await run(page, 'console.log("again")')).output.trim()).toBe("again");
});

test("Stop cancels a running program", async ({ page }) => {
  await start(page, "for (;;) {}");
  await expect(page.getByTestId("run-status")).toHaveAttribute("data-status", "running");
  await page.getByRole("button", { name: "Stop" }).click();
  expect((await finished(page)).status).toBe("stopped");
  await expectNoWorkers(page);
});

test("network access is blocked: fetch, XHR, WebSocket, EventSource, importScripts, nested workers", async ({
  page,
  context,
}) => {
  // A real listener on another port: if anything leaves the sandbox, it lands here.
  const hits: string[] = [];
  const server = http.createServer((req, res) => {
    hits.push(req.url ?? "");
    res.writeHead(200, { "access-control-allow-origin": "*" });
    res.end("reached");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as AddressInfo).port;
  // Chromium reports XHR and EventSource as requests that fail with reason "csp"
  // before they reach the network; anything else, or any response, is a leak.
  const events: string[] = [];
  context.on("request", (r) => r.url().includes("probe") && events.push(`request ${r.url()}`));
  context.on("requestfailed", (r) => {
    if (r.url().includes("probe")) events.push(`failed:${r.failure()?.errorText} ${r.url()}`);
  });
  context.on("response", (r) => r.url().includes("probe") && events.push(`RESPONSE ${r.url()}`));
  try {
    const sameOrigin = `${new URL(page.url()).origin}/?probe=same`;
    for (const probe of [sameOrigin, `http://127.0.0.1:${port}/?probe=other`]) {
      const r = await run(page, networkProbe(probe));
      expect(r.status).toBe("ok");
      expect(r.output.trim().split("\n")).toEqual([
        "fetch: blocked",
        "xhr: blocked",
        "websocket: blocked",
        "eventsource: blocked",
        "importScripts: blocked",
        "nested worker fetch: blocked",
      ]);
    }
    expect(hits).toEqual([]);
    expect(events.filter((e) => e.startsWith("RESPONSE"))).toEqual([]);
    const requests = events.filter((e) => e.startsWith("request ")).map((e) => e.slice(8));
    const blocked = events.filter((e) => e.startsWith("failed:csp ")).map((e) => e.slice(11));
    expect(requests.sort()).toEqual(blocked.sort());
  } finally {
    server.close();
  }
});

/** A program that tries every way a worker can reach the network and reports each. */
function networkProbe(probe: string): string {
  return `
const probe = ${JSON.stringify(probe)};
const results = [];
const attempt = async (name, fn) => {
  try { await fn(); results.push(name + ": allowed"); }
  catch { results.push(name + ": blocked"); }
};
const settle = (open) => new Promise((resolve, reject) => open(resolve, reject));
await attempt("fetch", () => fetch(probe + "&k=fetch"));
await attempt("xhr", () => settle((ok, no) => { const x = new XMLHttpRequest(); x.onload = ok; x.onerror = no; x.open("GET", probe + "&k=xhr"); x.send(); }));
await attempt("websocket", () => settle((ok, no) => { const w = new WebSocket(probe.replace("http", "ws") + "&k=ws"); w.onopen = ok; w.onerror = no; }));
await attempt("eventsource", () => settle((ok, no) => { const e = new EventSource(probe + "&k=es"); e.onopen = ok; e.onerror = no; }));
await attempt("importScripts", () => importScripts(probe + "&k=import"));
await attempt("nested worker fetch", () => settle((ok, no) => {
  const src = "fetch(" + JSON.stringify(probe + "&k=nested") + ").then(() => postMessage('allowed'), () => postMessage('blocked'))";
  const w = new Worker(URL.createObjectURL(new Blob([src])));
  w.onmessage = (e) => (e.data === "allowed" ? ok() : no());
  w.onerror = no;
}));
console.log(results.join("\\n"));
`;
}

test("the program cannot reach this site's storage, document or window", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("sandbox-test", "kept"));
  const code = `
const out = ["origin " + self.origin, "localStorage " + typeof localStorage, "document " + typeof document, "parent " + typeof parent];
try { await new Promise((ok, no) => { const r = indexedDB.open("x"); r.onsuccess = ok; r.onerror = () => no(r.error); }); out.push("indexedDB allowed"); }
catch { out.push("indexedDB blocked"); }
try { await caches.open("x"); out.push("caches allowed"); } catch { out.push("caches blocked"); }
console.log(out.join("\\n"));
`;
  const r = await run(page, code);
  expect(r.output.trim().split("\n")).toEqual([
    "origin null",
    "localStorage undefined",
    "document undefined",
    "parent undefined",
    "indexedDB blocked",
    "caches blocked",
  ]);
  expect(await page.evaluate(() => localStorage.getItem("sandbox-test"))).toBe("kept");
});

test("output is limited in lines and characters", async ({ page }) => {
  const many = await run(page, 'for (let i = 0; ; i++) console.log("line " + i);');
  expect(many.status).toBe("output-limit");
  expect(many.output.trim().split("\n")).toHaveLength(500);
  const huge = await run(page, 'console.log("x".repeat(5_000_000));');
  expect(huge.status).toBe("output-limit");
  expect(huge.output.trim()).toHaveLength(20_000);
  await expectNoWorkers(page);
});

test("output is shown as text, never as markup", async ({ page }) => {
  const title = await page.title();
  const r = await run(page, `console.log('<img src=x onerror="document.title = 1">');`);
  expect(r.output).toContain("<img src=x");
  await expect(page.getByTestId("run-output").locator("img")).toHaveCount(0);
  expect(await page.title()).toBe(title);
});

test("messages forged by the program do not change the run's outcome", async ({ page }) => {
  const r = await run(
    page,
    'self.postMessage({ type: "exit", status: "timeout" });\nself.postMessage({ type: "log", level: "<b>", text: 1 });\nconsole.log("still running");',
  );
  expect(r.status).toBe("ok");
  expect(r.output.trim()).toBe("still running");
});

test("a fork bomb of nested workers dies with the sandbox", async ({ page }) => {
  const r = await run(
    page,
    'const src = "for (;;) {}";\nfor (let i = 0; i < 6; i++) new Worker(URL.createObjectURL(new Blob([src])));\nfor (;;) {}',
  );
  expect(r.status).toBe("timeout");
  await expectNoWorkers(page);
  expect((await run(page, 'console.log("ok")')).output.trim()).toBe("ok");
});

test("a program holding hundreds of megabytes is stopped at the limit and its worker terminated", async ({
  page,
}) => {
  // Bounded on purpose. Unbounded allocation is not contained: on GitHub's runner it
  // slowed the page itself so much that the 3 s limit was not reported within 15 s
  // (ADR-0007).
  let crashed = false;
  page.on("crash", () => (crashed = true));
  const r = await run(
    page,
    "const keep = [];\nfor (let i = 0; i < 64; i++) keep.push(new Array(1e6).fill(i));\nfor (;;) {}",
  );
  expect(r.status).toBe("timeout");
  await expectNoWorkers(page);
  expect(crashed).toBe(false);
  expect((await run(page, 'console.log("alive")')).output.trim()).toBe("alive");
});
