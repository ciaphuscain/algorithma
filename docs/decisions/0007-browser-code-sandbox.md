# ADR-0007: Run the learner's own JavaScript in a browser sandbox, off by default

- Status: accepted (2026-10-21). Implemented and adversarially tested; **disabled in default builds** until an independent security review.

## Context

[ADR-0003](0003-no-untrusted-execution-yet.md) ruled out executing user code until an isolation boundary existed and was tested, and named browser execution in a sandboxed iframe plus a Web Worker as the first option, suitable for running _your own_ code. The project rules add: treat user programs as hostile; never execute them in the application server; do not treat a plain JavaScript sandbox or iframe as a complete security boundary; and do not enable public code execution until the boundary has been independently tested.

The Code tab of every lesson shows tested JavaScript; learners want to change it and run it.

## Decision

Build a runner for the visitor's own JavaScript that executes entirely in their browser, with several independent layers, and ship it switched off.

**Mechanism** (`src/lib/sandbox/`):

1. Each run creates a fresh, invisible `<iframe sandbox="allow-scripts" srcdoc=…>`. Without `allow-same-origin` the document has an **opaque origin**: it cannot read this site's cookies, localStorage, IndexedDB or DOM, and the app ignores its messages unless `event.origin === "null"` and `event.source` is that iframe. No other sandbox permissions are granted (no popups, forms, top navigation or modals).
2. The iframe document carries its own CSP, which its worker inherits: `default-src 'none'; script-src 'unsafe-inline'; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'`. This blocks every network API (fetch, XHR, WebSocket, EventSource), `importScripts`, and `eval`. The site-wide policy ([ADR-0006](0006-content-security-policy.md)) also applies.
3. The program runs in a **dedicated Worker** started from a `blob:` URL of _source text_ (harness + user code). Nothing calls `eval` or `new Function`. A program stuck in a loop blocks only its worker thread, so the page stays responsive.
4. **Limits**: 3 s wall clock, enforced by the parent page (not by the sandbox); 500 output lines and 20,000 characters, enforced in the sandbox and again in the parent; 50,000 characters of source. When a run ends for any reason, the parent asks the sandbox to `terminate()` its worker, waits for confirmation (at most 1 s), and removes the iframe.
5. Messages crossing the boundary are untrusted in both directions: `parseSandboxMessage` accepts only known shapes, coerces levels and caps text. Output is rendered as React text, never HTML.
6. Code is only what the visitor typed in the current tab. The runner never executes code from URLs, stored content or other users, and runs only on an explicit click.

**Off by default.** `NEXT_PUBLIC_ENABLE_CODE_RUNNER=1` at build time enables it (`npm run build:e2e`, which CI uses for the end-to-end suite). Default builds show a note in its place.

## Evidence

`tests/e2e/sandbox.spec.ts` (Chromium, the headless-shell build bundled with Playwright 1.56) plays hostile programs and checks the boundary from outside:

| Attack                                                                                                                  | Observed                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `while (true) {}`                                                                                                       | Stopped at the 3 s limit; the page answered within 1 s during the run; the iframe is removed and the browser's worker list returns to empty; the next run works |
| Stop button during a loop                                                                                               | Status “stopped”; worker gone                                                                                                                                   |
| fetch, XHR, WebSocket, EventSource, `importScripts`, and fetch from a nested worker, to this origin and to another port | All fail inside the program; a real listener the test runs receives no request; no response events; every request the browser reports fails with reason `csp`   |
| Storage and page access                                                                                                 | `self.origin` is `"null"`; no `localStorage`, `document` or `parent`; IndexedDB and Cache Storage refuse; the page's localStorage is unchanged                  |
| Output flood (endless `console.log`, one 5 MB string)                                                                   | Exactly 500 lines / 20,000 characters shown; status “output limit”                                                                                              |
| Markup in output                                                                                                        | Shown as text; no element created; page unchanged                                                                                                               |
| Forged `postMessage` from the program                                                                                   | Ignored; run outcome unchanged                                                                                                                                  |
| Fork bomb (6 nested looping workers)                                                                                    | Stopped at the limit; all workers gone afterwards                                                                                                               |
| Unbounded allocation                                                                                                    | Stopped at the limit; page did not crash; worker terminated within 30 s (see below); next run works                                                             |

Unit tests (`tests/unit/sandbox.test.ts`) cover the console formatter (by evaluating the exact source text that ships), line-number mapping, the CSP string, and message validation.

**Measurements** (same Chromium build, this development container, not a benchmark):

- After `terminate()`, a worker in a tight loop kept a CPU core busy for about **2.2 s** (2,217–2,221 ms in three trials) before Chromium stopped it. So a run can use one core for roughly 5 s in total.
- An unbounded allocation loop reached about **2 GB** of renderer memory before termination, then returned to about 150 MB. Locally its worker was gone about 2 s after the run stopped (1.5–2.2 s over ten trials, including variants that pushed the renderer past 2.8 GB).
- On GitHub's `ubuntu-latest` runner, the same program's worker was **still running 8 s** after the run stopped, in the first CI run of the suite. The cause is not confirmed: terminating a worker whose heap is nearly full can wait for garbage collection, and the runner may allocate faster than this container. The test now allows 30 s and prints the measured time in the CI log.

## What this does not protect against

- **Memory exhaustion on small devices.** Browsers offer no per-worker memory limit. A program can allocate gigabytes within the time limit and may crash the tab on a memory-constrained device, and its worker can take several seconds longer than a plain loop to stop. Impact is limited to the visitor's own tab.
- **Browser vulnerabilities.** The boundary is the browser's sandbox and CSP implementation; an exploit for those is out of scope.
- **Side channels.** The sandboxed iframe may share a renderer process with the app, so Spectre-class side channels are not mitigated. This is acceptable only because the app currently holds no secrets (no accounts or tokens). Revisit before adding any.
- **Other browsers.** Only Chromium is tested. CSP inheritance into blob workers and worker termination timing must be checked in Firefox and WebKit.
- **Other people's code.** This design is for running your own code. Running shared, published or submitted code, or grading, needs the server-side microVM option of ADR-0003 or a new review.
- **Language features.** `eval` and `new Function` are unavailable to programs (blocked by CSP), and callbacks scheduled after the top-level code finishes do not run.

## Before enabling it publicly

1. An independent security review of `src/lib/sandbox/` and this ADR.
2. Run `tests/e2e/sandbox.spec.ts` on Firefox and WebKit, and fix or document differences.
3. Decide whether the memory risk is acceptable, or shorten the time limit.

## Consequences

- Learners can edit and run every lesson's JavaScript in builds that enable the flag.
- CI exercises the runner on every change, even though default builds ship with it off.
- Python remains test-suite-only; running it in the browser (Pyodide) would follow this same design.
