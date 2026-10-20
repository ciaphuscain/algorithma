# Testing

```bash
npm test             # unit, property, conformance and content tests (Vitest)
npm run build && npm run test:e2e   # Playwright journeys, accessibility, mobile (against the production build)
npm run check        # typecheck + lint + unit tests
npm run bench:trace  # trace reconstruction experiment (not a test; prints measurements)
```

Python 3 must be on `PATH` for the Python implementation tests; without it those tests are skipped and reported as skipped.

## Layers

| Layer                 | Where                            | What it proves                                                                                                                                                                                                                                                                                                    |
| --------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Engine unit tests     | `src/engine/engine.test.ts`      | Each event's semantics; error reporting with event index; forward/backward/random seeks give identical states for several keyframe intervals; record vs count mode agree; truncation is explicit and still replayable; validator rejects malformed, oversized and semantically impossible traces and never throws |
| **Conformance suite** | `tests/unit/conformance.test.ts` | For _every_ registered algorithm, on all presets and 25 seeded random inputs: oracle-correct output, JSON round-trip validates, replay reproduces the output, counters match, deterministic, count mode matches, pseudocode lines exist, backward = forward states, presets and random inputs parse               |
| Property-based        | `tests/unit/properties.test.ts`  | Sorting: ordered permutation; exactly n(n−1)/2 comparisons; swaps = inversions; no element lost in any intermediate state. BFS: edge constraint \|d(u) − d(v)\| ≤ 1, symmetric reachability, every reachable vertex dequeued once                                                                                 |
| Content               | `tests/unit/content.test.ts`     | Every TeX string renders in KaTeX; Python and JavaScript samples run against their cases; question answers valid; worked-example numbers in lessons equal what the engine produces; search behaviour                                                                                                              |
| Curriculum            | `tests/unit/curriculum.test.ts`  | 600 items, anchor numbers, part ranges, duplicate mapping, tiers and learning order reference real items                                                                                                                                                                                                          |
| End-to-end            | `tests/e2e/journeys.spec.ts`     | Beginner journey with custom input and backward stepping; invalid input; keyboard playback; autoplay stops at end; BFS with disconnected graph; learn depth; practice feedback and progress; exam and code tabs; explore URL filters; roadmap honesty; 404                                                        |
| Accessibility         | `tests/e2e/a11y.spec.ts`         | axe WCAG 2.0/2.1/2.2 A and AA rules on every page type, light and dark                                                                                                                                                                                                                                            |
| Mobile                | `tests/e2e/mobile.spec.ts`       | No horizontal overflow at phone width; controls work                                                                                                                                                                                                                                                              |

## Evidence the tests can fail

Mutation checks performed while building the suite (2026-10-19): making bubble sort skip swaps at index 2 failed 21 conformance cases; adding 1 to BFS distances for one node failed 21 cases. Both were caught by the independent oracles, not by snapshot comparisons.

## What tests do not prove

- Passing the conformance and property suites is **empirical evidence**, not a proof of correctness. Correctness arguments are in each lesson's Mathematics level.
- Automated accessibility checks cover a subset of WCAG; screen-reader walkthroughs have not been done yet.
- Lesson prose is not verified by tests (only its maths syntax, code and numbers).
