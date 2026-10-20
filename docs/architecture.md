# Architecture

This document is the engineering assessment for ALGORITHMA and the map of how the code is organised. Decisions with lasting consequences have their own records in [`decisions/`](decisions/).

## 1. What ALGORITHMA is, and what is hard about it

ALGORITHMA is an algorithm learning and experimentation environment: an encyclopedia whose entries can be _run_. A learner reads an explanation at the depth they need, feeds the algorithm their own input, and steps through the real execution forwards and backwards.

The difficult parts are not the pages. They are:

1. **A generalised visualization.** Many unrelated algorithms (sorts, graph searches, DP tables, string matchers) must share one rendering system without per-algorithm animation code, and a newly contributed algorithm must be drawable without touching renderer code.
2. **Faithfulness.** Every frame must be a state the algorithm actually reached. A smooth animation that diverges from the computation is worse than none.
3. **Random access over long executions.** Stepping backwards and scrubbing must be fast even for traces with ~10⁵ events, without unbounded memory.
4. **Running user code safely**, eventually. This is a hostile-input problem and is deliberately not solved by hand-waving (see [ADR-0003](decisions/0003-no-untrusted-execution-yet.md) and [security.md](security.md)).
5. **Trustworthy content at scale.** The curriculum has 600 items. Quality cannot depend on writing them all at once, and claims must be checkable.

## 2. Core workflows (in priority order)

1. **Beginner:** discover → read intuition → choose input → run → step through the trace → inspect the result. _(Implemented, covered by e2e tests.)_
2. **Student:** read mechanics/maths levels, review complexity, practise, print exam notes. _(Implemented.)_
3. **Competitive programmer:** compare algorithms on the same inputs, look at operation counts and edge cases. _(Arena: next.)_
4. **Developer:** add an algorithm against the SDK and get validation, visualization and tests for free. _(Implemented for in-repo contributors; Studio import planned.)_
5. Educator, researcher and community workflows are long-term ([progress.md](progress.md)).

## 3. Architecture options considered

|                          | A. Modular monolith, trusted browser execution | B. Monolith + isolated execution workers | C. Services (content, execution, collaboration) |
| ------------------------ | ---------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Effort for first release | Low                                            | Medium–high (sandbox infra)              | High                                            |
| Security boundary        | Only trusted, reviewed code runs               | Strong, if the sandbox is real           | Strong, at high ops cost                        |
| Operational burden       | One deployable                                 | One app + worker fleet                   | Many deployables, networking, tracing           |
| Fits a small team        | Yes                                            | Later                                    | No                                              |
| Main risk                | Ceiling on user-code features                  | Sandbox escape, cost                     | Accidental complexity                           |

**Selected: A now, designed to grow into B.** The first four workflows need no server-side execution: shipped algorithms are trusted code that runs equally well in the browser, in Node tests and in build-time rendering. The execution layer is isolated behind a narrow interface (`runAlgorithm(module, input, options) → { output, trace }`) so a worker-backed implementation can be added when user code is enabled, without changing the trace or UI layers. C is rejected: no requirement needs independent scaling or deployment yet.

## 4. Technology decisions

| Concern               | Choice                                               | Alternative considered      | Why                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework             | Next.js 16 (App Router), React 19, TypeScript strict | Vite SPA                    | Lessons are static, indexable content (SSG); the same codebase can add route handlers when persistence arrives. Vite would be lighter but need a second server later.     |
| Styling               | One token-based CSS file                             | Tailwind, component library | Full control of a distinctive visual language and of dark mode; no runtime; the stylesheet is small enough to own.                                                        |
| Visualization         | Hand-written SVG renderers                           | D3, Canvas                  | Inputs are bounded (≤ 40 bars, ≤ 26 nodes for live editing), so SVG keeps accessibility (text, DOM) at no measured cost. Canvas is the fallback if large imports need it. |
| Maths                 | KaTeX 0.19                                           | MathJax                     | Synchronous, server-renderable; 0.19 fixes a trust-bypass advisory present in 0.16–0.18.                                                                                  |
| Unit / property tests | Vitest 5, fast-check                                 | Jest                        | Native TS/ESM; Vitest 3 pulled a critical `tinypool` advisory.                                                                                                            |
| E2E / a11y            | Playwright 1.56 + axe-core                           | Cypress                     | Matches the preinstalled browser; axe gives automated WCAG checks.                                                                                                        |
| Persistence           | None yet (localStorage for personal progress)        | PostgreSQL now              | No workflow yet needs shared state. Adding a database before accounts would be unused infrastructure ([ADR-0005](decisions/0005-local-progress-before-accounts.md)).      |

Dependency versions were chosen to clear `npm audit` (0 vulnerabilities at the time of writing) while preferring releases that had been public for a few weeks.

## 5. Module boundaries and dependency direction

```
src/
  engine/       trace protocol, reducer, player, validator, tracer SDK      (no deps)
  lib/          pure utilities: seeded RNG, graph layout, grading, progress  (no app deps)
  algorithms/   traced algorithm modules + input specs                       → engine, lib
  content/      curriculum, domains, lesson entries, catalogue search        → (types only)
  ui/           React components: renderers, visualizer, lesson widgets      → engine, algorithms, content, lib
  app/          Next.js routes                                               → everything above
```

Rules enforced by ESLint (`no-restricted-imports` in `eslint.config.mjs`): `engine` may import nothing from the app; `engine`, `algorithms` and `lib` may not import React, Next.js or UI code. This keeps the core runnable in Node scripts, tests and (later) workers.

The only coupling between an algorithm and the UI is data: the module's pseudocode lines and the trace it emits. Renderers are selected by _structure kind_ (`ui/renderers/index.tsx`), never by algorithm id.

## 6. The trace pipeline

```
input text ──parse──▶ validated input ──module.run(input, tracer)──▶ output
                                              │ (events, via traced wrappers)
                                              ▼
                                     Trace (JSON, versioned)
                                              │ validateTrace (untrusted sources)
                                              ▼
                     TracePlayer: replay once, keep keyframes every ⌈√N⌉ events
                                              │ stateAt(p)
                                              ▼
                     TraceState ──▶ StructurePanel (array | graph | sequence | grid)
```

- **Semantic events, one reducer.** `engine/reduce.ts` is the single definition of what each event does. Renderers read state, not events. See [trace-protocol.md](trace-protocol.md).
- **Fidelity by construction.** Algorithms mutate data _through_ `TracedArray`, `TracedSequence`, … so a recorded swap is the swap performed. The conformance suite additionally checks that the replayed final state equals the returned output.
- **Hybrid reconstruction.** Measured in [experiments/trace-reconstruction.md](experiments/trace-reconstruction.md): snapshots-per-event used 711 MB for a 90k-event trace; pure replay made random seeks ~12 ms; keyframes every ⌈√N⌉ events give ~0.4 ms seeks with 2.4 MB retained.
- **Explicit truncation.** The tracer has an event budget. When it runs out, execution continues (so the result and counters are complete) but the trace is marked `truncated` and the UI says so.

## 7. Critical risks

| Risk                                     | Mitigation now                                                                              | Still open                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Untrusted code execution                 | Not offered. Only reviewed modules run.                                                     | Needs an isolation design and adversarial tests before enabling ([security.md](security.md)).                    |
| Visualization diverging from execution   | Traced wrappers; fidelity + determinism + backward/forward equality tests for every module. | Contributors can still emit misleading narration text; review catches that, tests do not.                        |
| Abstraction too narrow for some families | Four structure kinds cover sorts, searches, BFS/DFS/shortest paths, DP tables.              | Trees, geometry and timelines need new kinds; adding one is a protocol minor version.                            |
| Inaccurate educational content           | Draft labels; KaTeX, code samples and worked-example numbers are tested.                    | Prose needs expert review; no reviewer workflow yet.                                                             |
| Large traces                             | Event budget, validator limits, √N keyframes.                                               | 9 MB JSON at 90k events (47% narration) — gzip gives 10×; compression for stored traces when persistence exists. |

## 8. Priorities

- **P0 (done):** trace engine, two structurally different algorithms on shared renderers, learning page, explore, accessibility baseline, tests and CI.
- **P0 (next):** broaden the catalogue with Tier-1 algorithms that exercise every structure kind; Arena operation-count comparisons; Studio trace import proving renderer reuse for algorithms that are not in the registry.
- **P1:** exam-question bank growth, trace compression, learning paths from the prerequisite graph, persistence + accounts.
- **Deferred:** user code execution (until isolation is built and tested), AI tutor (optional, never a dependency of core features), community contributions, educator tools.

## 9. Definition of the first release

A user can find an algorithm, read it at the depth they choose, run it on their own valid input (invalid input is rejected with a reason), step forwards and backwards through a faithful trace with pseudocode, variables and operation counts, confirm the output was independently checked, and test their understanding — on desktop or phone, by keyboard or pointer, in light or dark mode. This holds today for Bubble Sort and BFS, which share one visualization pipeline.

## 10. Verification

See [testing.md](testing.md). In short: the engine has unit tests; every registered algorithm passes a generic conformance suite; sorting and BFS have property-based tests; lesson code runs in tests; e2e tests cover the journeys above; axe checks every page in both colour schemes; CI runs all of it plus `npm audit`.
