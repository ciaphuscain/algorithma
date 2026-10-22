# Progress and continuation record

_Last updated 2026-10-22._

## Where things stand

ALGORITHMA has a working learning platform for 28 algorithms on one generalised trace engine, with Studio, Arena, practice, exam notes, the 600-item curriculum, and a browser code sandbox that is built and tested but switched off by default. It is still an early release: accounts, community features, server-side execution and most of the long-term vision are not built.

| Area         | State                                                                                                                                                                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Trace engine | Protocol v2 (5 structure kinds, 26 event types; v1 traces migrate), one reducer, √N keyframe player, validator with limits and full replay, tracer SDK with record/count modes and explicit truncation                                                                                                                                           |
| Algorithms   | 28 traced modules. Searching: linear, binary. Sorting: bubble, selection, insertion, merge, quick, heap. Graphs: BFS, DFS, Dijkstra, Bellman–Ford, Floyd–Warshall, topological sort (Kahn and DFS), union-find, Kruskal, Prim. DP: edit distance, LCS, 0/1 knapsack, LIS. Strings: KMP. Trees: traversals, BST, trie, segment tree, Fenwick tree |
| Lessons      | 28 entries, each with 5 depth levels, complexity, tested Python and JavaScript, practice with hints, exam notes and references. All `draft` (prose not yet expert-reviewed)                                                                                                                                                                      |
| Curriculum   | All 600 items with parts, sections, tiers, duplicates, learning order, DP patterns and mastery goals. 34 distinct items covered (38 counting duplicates that point to them). Priority tiers: Tier 1 has 21 of 23 items covered (Memoization and Tabulation have no entry of their own); Tier 2 has 2 of 21 (Bellman–Ford, Floyd–Warshall)        |
| Pages        | Home, Explore, Roadmap, algorithm workspace (7 tabs), Arena, Studio                                                                                                                                                                                                                                                                              |
| Code runner  | Run and edit each lesson's JavaScript in an opaque-origin iframe + Worker with no network access; adversarially tested; **off in default builds** until an independent security review ([ADR-0007](decisions/0007-browser-code-sandbox.md))                                                                                                      |
| Persistence  | Browser-local only (recent pages, practice results)                                                                                                                                                                                                                                                                                              |
| Not built    | Accounts, database, server-side or multi-language execution, AI tutor, community/review workflow, educator tools, research publishing, geometry and timeline visualizations                                                                                                                                                                      |

## Quality gates

| Dimension              | Evidence                                                                                                                                                                                                                                            | Current state                                  | Weaknesses / next step                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Correctness            | 1,217 unit, property, conformance and content tests; an independent oracle per module; cross-algorithm properties (Kruskal = Prim, Bellman–Ford = Dijkstra, Floyd–Warshall = Bellman–Ford); 14 injected bugs, all caught ([testing.md](testing.md)) | Strong for shipped algorithms                  | Empirical, not proofs; oracles for exotic inputs (huge weights, Unicode) untested                                                  |
| Educational quality    | Every TeX string renders; code samples executed; every worked-example table and practice answer checked against the traced run                                                                                                                      | Numbers verified; prose unreviewed             | Needs subject-expert review before any entry is marked `reviewed`                                                                  |
| Visualization fidelity | Traces are produced by wrappers that perform the real operations; replayed final state = output; backward = forward states; tree edits share one implementation across tracer, reducer and validator                                                | Strong                                         | Narration text is not machine-checked                                                                                              |
| Extensibility          | Renderer-reuse test with unregistered algorithms; the tree kind was added without per-algorithm renderer code; contributor guide followed for 19 modules                                                                                            | Demonstrated for 5 structure kinds             | Geometry and timelines need new kinds                                                                                              |
| Security               | Untrusted traces validated with limits and full replay; production CSP; error boundaries; code sandbox with 11 adversarial e2e tests; `npm audit` in CI                                                                                             | Appropriate for current scope                  | Sandbox needs independent review and Firefox/WebKit runs before it is enabled ([ADR-0007](decisions/0007-browser-code-sandbox.md)) |
| Performance            | Trace experiment: 0.37 ms p50 seek, 2.4 MB at 90k events; 240 µs per playback step                                                                                                                                                                  | Well within assumed targets for bounded inputs | Page-load and Lighthouse not measured; Arena runs on the main thread (chunked)                                                     |
| Reliability            | Validator never throws; malformed traces rejected with event index; renderer failures contained by error boundaries; storage failures tolerated                                                                                                     | Good for a client-only app                     | No telemetry                                                                                                                       |
| Accessibility          | axe (WCAG 2.0–2.2 A/AA) on 21 page paths × 2 colour schemes plus the rendered Arena chart; keyboard playback; text descriptions; non-colour cues; reduced motion                                                                                    | Automated checks pass                          | No screen-reader walkthrough yet                                                                                                   |
| Maintainability        | Strict TypeScript, lint-enforced layering, Prettier, 7 ADRs, contributor guide                                                                                                                                                                      | Good                                           | —                                                                                                                                  |
| Observability          | None beyond the browser console                                                                                                                                                                                                                     | Appropriate for a static app                   | Add error reporting when deployed                                                                                                  |
| Product                | 75 e2e tests pass in Chromium (desktop + phone)                                                                                                                                                                                                     | Core learning loop works end to end            | Not tested with real learners                                                                                                      |

## Backlog

Done since the previous record: tree structure kind (protocol v2); twelve algorithms (traversals, BST, trie, segment tree, union-find, Kruskal, Prim, DFS topological sort, LIS, Fenwick tree, and the Tier 2 Bellman–Ford and Floyd–Warshall); error boundaries; a production CSP; and the browser code sandbox (built, tested, off by default).

**P0 — next**

1. Independent security review of the code sandbox; run its suite in Firefox and WebKit; then decide whether to enable it ([ADR-0007](decisions/0007-browser-code-sandbox.md)).
2. Expert review workflow for lessons (reviewer, date, diff of what changed), starting with the Tier 1 entries.
3. Heap-as-tree view and recursion trees for merge and quick sort, now that the tree kind exists.

**P1** 4. Tier 2 algorithms, 19 still missing: prefix sums, sliding window, two pointers, monotonic stack and queue, sparse table, binary lifting, heavy-light decomposition, strongly connected components (Kosaraju, Tarjan), bridges and articulation points, A\*, Aho–Corasick, Manacher, suffix array, suffix tree, suffix automaton, matrix exponentiation. Also a Tier 1 entry on memoization vs tabulation. 5. Learning paths from prerequisites; practice history per topic. 6. Arena: searching and graph algorithms; run in a Web Worker. 7. Compression for exported traces.

**P2** 8. Accounts + PostgreSQL (progress sync, saved Studio traces, project revisions) — see ADR-0005. 9. Printable exam booklet across several algorithms; GATE-style question bank. 10. CSP with nonces once pages render per request.

**P3** 11. Python in the browser (Pyodide) on the same sandbox design. 12. Optional AI tutor behind a provider interface, grounded in reviewed lessons and clearly labelled advisory.

**P4 / research** 13. Community contributions with moderation and provenance; research entries with claim status. 14. Server-side multi-language execution in microVM workers (needed for running other people's code and for grading).

**Rejected for now:** microservices, Kubernetes, message queues, real-time collaboration infrastructure — no current workflow needs them.

## How to resume

```bash
npm ci
npm run check                          # typecheck, lint, 1,217 unit tests
npm run build:e2e && npm run test:e2e  # 75 Playwright tests (Chromium 1194 via @playwright/test 1.56.1)
npm run dev                            # http://localhost:3000 (add NEXT_PUBLIC_ENABLE_CODE_RUNNER=1 for the runner)
npm run bench:trace                    # trace reconstruction measurements
```

`build:e2e` enables the code runner so its adversarial suite runs; `npm run build` produces the default build with the runner off.

If `npm install` crashes with `Cannot read properties of null (reading 'edgesOut')`, that is an npm 10 resolver bug: use `npx npm@11.6.2 install` (the lockfile was produced with npm 11; `npm ci` works with npm 10).

When running e2e locally, stop any old `next start` on port 3100 first: Playwright reuses an existing server, and a stale one serves the previous build.

To add an algorithm, follow [adding-an-algorithm.md](adding-an-algorithm.md).
