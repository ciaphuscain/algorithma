# Progress and continuation record

_Last updated 2026-10-20._

## Where things stand

ALGORITHMA is at the end of roadmap **Phase 2** (generalised trace engine), with the first parts of Phase 3 (Studio), Phase 4 (Arena, practice, exam notes) and the curriculum in place. It is an MVP: most of the long-term vision is not built.

| Area         | State                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Trace engine | Protocol v1 (4 structure kinds, 18 event types), reducer, √N keyframe player, validator with limits, tracer SDK with record/count modes and explicit truncation                      |
| Algorithms   | 16 traced modules: linear & binary search; bubble, selection, insertion, merge, quick, heap sort; BFS, DFS, Dijkstra, topological sort (Kahn); edit distance, LCS, 0/1 knapsack; KMP |
| Lessons      | 16 entries, each with 5 depth levels, complexity, tested Python + JavaScript, practice with hints, exam notes, references. All `draft` (unreviewed prose)                            |
| Curriculum   | All 600 items with parts, sections, tiers, duplicates (29), learning order, DP patterns and mastery goals; 18 distinct items covered (19 counting duplicate #330)                    |
| Pages        | Home, Explore, Roadmap, algorithm workspace (7 tabs), Arena, Studio                                                                                                                  |
| Persistence  | Browser-local only (recent pages, practice results)                                                                                                                                  |
| Not built    | Accounts, database, user code execution, AI tutor, community/review workflow, educator tools, research publishing, tree/geometry visualizations                                      |

## Quality gates

| Dimension              | Evidence                                                                                                                                                         | Current state                                  | Weaknesses / next step                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Correctness            | 731 unit/property/conformance/content tests; independent oracles per module; mutation checks caught all 5 injected bugs ([testing.md](testing.md))               | Strong for shipped algorithms                  | Empirical, not proofs; oracles for exotic inputs (huge weights, Unicode) untested                               |
| Educational quality    | Every TeX string renders; code samples executed; every worked-example number and practice answer checked against the engine                                      | Numbers verified; prose unreviewed             | Needs subject-expert review before any entry is marked `reviewed`                                               |
| Visualization fidelity | Traces are produced by wrappers that perform the real operations; replayed final state = output; backward = forward states; mark semantics property              | Strong                                         | Narration text is not machine-checked                                                                           |
| Extensibility          | Renderer-reuse integration test with unregistered algorithms; contributor guide followed for 7 modules                                                           | Demonstrated for 4 structure kinds             | Trees, geometry, timelines need new kinds                                                                       |
| Security               | No user code executed; untrusted traces validated with limits and full replay; security headers; `npm audit` clean (0 vulnerabilities) in CI                     | Appropriate for current scope                  | No CSP yet; isolation design needed before user code ([ADR-0003](decisions/0003-no-untrusted-execution-yet.md)) |
| Performance            | Trace experiment: 0.37 ms p50 seek, 2.4 MB at 90k events; 240 µs per playback step                                                                               | Well within assumed targets for bounded inputs | Page-load and Lighthouse not measured; Arena runs on the main thread (chunked)                                  |
| Reliability            | Validator never throws; malformed traces rejected with event index; algorithm exceptions caught in the UI; storage failures tolerated                            | Good for a client-only app                     | No error boundary around renderers; no telemetry                                                                |
| Accessibility          | axe (WCAG 2.0–2.2 A/AA) on 16 page paths × 2 colour schemes plus the rendered Arena chart; keyboard playback; text descriptions; non-colour cues; reduced motion | Automated checks pass                          | No screen-reader walkthrough yet                                                                                |
| Maintainability        | Strict TypeScript, lint-enforced layering, Prettier, ADRs, contributor guide                                                                                     | Good                                           | —                                                                                                               |
| Observability          | None beyond the browser console                                                                                                                                  | Appropriate for a static app                   | Add error reporting when deployed                                                                               |
| Product                | 50 e2e journeys pass in Chromium (desktop + phone)                                                                                                               | Core learning loop works end to end            | Not tested with real learners                                                                                   |

## Backlog

**P0 — next**

1. Tree structure kind (protocol v1.1): BST operations, heap-as-tree view, recursion trees for merge/quick sort.
2. Remaining Tier-1 algorithms: Union-Find, Kruskal, Prim, Bellman–Ford, Floyd–Warshall, LIS (both), Trie, Segment Tree, Fenwick Tree, DFS-based topological sort.
3. Error boundary around the trace viewer so a renderer bug cannot blank the page.

**P1** 4. Content-Security-Policy with nonces. 5. Expert review workflow for lessons (reviewer, date, diff of what changed). 6. Learning paths from prerequisites; practice history per topic. 7. Arena: searching and graph algorithms; run in a Web Worker. 8. Compression for exported traces.

**P2** 9. Accounts + PostgreSQL (progress sync, saved Studio traces, project revisions) — see ADR-0005. 10. Printable exam booklet across several algorithms; GATE-style question bank.

**P3** 11. Browser-side code execution in a sandboxed cross-origin iframe + worker (JavaScript first, Python via Pyodide), with an adversarial test suite before enabling — ADR-0003. 12. Optional AI tutor behind a provider interface, grounded in reviewed lessons and clearly labelled advisory.

**P4 / research** 13. Community contributions with moderation and provenance; research entries with claim status. 14. Server-side multi-language execution in microVM workers.

**Rejected for now:** microservices, Kubernetes, message queues, real-time collaboration infrastructure — no current workflow needs them.

## How to resume

```bash
npm ci
npm run check                      # typecheck, lint, 731 unit tests
npm run build && npm run test:e2e  # 50 Playwright tests (Chromium 1194 via @playwright/test 1.56.1)
npm run dev                        # http://localhost:3000
npm run bench:trace                # trace reconstruction measurements
```

If `npm install` crashes with `Cannot read properties of null (reading 'edgesOut')`, that is an npm 10 resolver bug: use `npx npm@11.6.2 install` (the lockfile was produced with npm 11; `npm ci` works with npm 10).

When running e2e locally, stop any old `next start` on port 3100 first: Playwright reuses an existing server, and a stale one serves the previous build.

To add an algorithm, follow [adding-an-algorithm.md](adding-an-algorithm.md).
