import { expect, test } from "@playwright/test";

const PAGES = [
  "/",
  "/explore",
  "/roadmap",
  "/algorithms/bubble-sort#learn",
  "/algorithms/dijkstra",
  "/arena",
  "/studio",
];

test("production responses carry a strict Content-Security-Policy", async ({ request }) => {
  const res = await request.get("/");
  const csp = res.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("base-uri 'self'");
  expect(csp).not.toContain("unsafe-eval");
  expect(res.headers()["x-frame-options"]).toBe("DENY");
});

test("no page triggers a CSP violation", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text());
  });
  for (const path of PAGES) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }
  // Exercise the interactive parts too: math rendering, a full playback, an Arena run.
  await page.goto("/algorithms/merge-sort");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await page.goto("/arena?alg=merge-sort&max=32&reps=1");
  await page.getByRole("button", { name: "Run experiment" }).click();
  await expect(page.getByTestId("arena-results")).toBeVisible();
  expect(violations).toEqual([]);
});
