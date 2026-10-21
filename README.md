# ALGORITHMA

**Learn. Visualize. Implement. Experiment. Innovate.**

ALGORITHMA is an algorithm encyclopedia whose entries can be run. Pick an algorithm, read it at the depth you need, give it your own input, and step through its real execution — forwards and backwards — with the pseudocode, variables and operation counts beside it.

## What is here

- **16 interactive algorithms**: linear and binary search; bubble, selection, insertion, merge, quick and heap sort; BFS, DFS, Dijkstra and topological sort; edit distance, LCS and 0/1 knapsack; KMP string matching.
- **Lessons at five depths** (intuition → mechanics → implementation → mathematics → advanced), tested Python and JavaScript code, practice questions with hints, and printable exam notes.
- **A 600-algorithm roadmap** with priority tiers, showing honestly which entries exist and which are planned.
- **Arena**: compare sorting algorithms on identical, seeded inputs by exact operation counts.
- **Studio**: visualize any algorithm that emits a trace in the documented format; untrusted traces are validated before anything is drawn.

## How it works

Algorithms are written against a small tracer SDK. They mutate their data _through_ traced wrappers, so every recorded event is an operation the algorithm actually performed. A trace is a versioned list of semantic events over named structures (arrays, graphs, queues/stacks, tables). One reducer defines what each event means, a keyframed player reconstructs any position in well under a millisecond, and four renderers draw any valid trace — without knowing which algorithm produced it.

```
input ─▶ algorithm (tracer SDK) ─▶ trace ─▶ validate ─▶ player (√N keyframes) ─▶ renderers
                     └──▶ output ──▶ independent checker
```

## Getting started

Requires Node 20.9+ (22 recommended). Python 3 is used by the tests to run the lesson code samples.

```bash
npm ci
npm run dev            # http://localhost:3000
npm run check          # typecheck, lint, unit/property/conformance/content tests
npm run build && npm run test:e2e
```

## Documentation

| Document                                                                             | What it covers                                                                   |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| [docs/architecture.md](docs/architecture.md)                                         | Engineering assessment, options considered, module boundaries, risks, priorities |
| [docs/trace-protocol.md](docs/trace-protocol.md)                                     | The trace format, event semantics, validation limits, versioning                 |
| [docs/adding-an-algorithm.md](docs/adding-an-algorithm.md)                           | Step-by-step contributor guide, with pitfalls                                    |
| [docs/testing.md](docs/testing.md)                                                   | Test layers, mutation evidence, what tests do not prove                          |
| [docs/security.md](docs/security.md)                                                 | Trust boundaries and threat register                                             |
| [docs/experiments/trace-reconstruction.md](docs/experiments/trace-reconstruction.md) | Measured comparison of snapshot, replay and keyframe strategies                  |
| [docs/decisions/](docs/decisions/)                                                   | Architecture decision records                                                    |
| [docs/assumptions.md](docs/assumptions.md)                                           | Assumption register                                                              |
| [docs/content-review.md](docs/content-review.md)                                     | Review states and what is verified automatically                                 |
| [docs/progress.md](docs/progress.md)                                                 | Current state, quality gates, backlog, how to resume                             |

## Status

This is an early release. Lesson prose was written with AI assistance and is marked as an unreviewed draft; code, numbers and maths syntax in the lessons are checked by tests. User code execution, accounts and community features are not built yet — see [docs/progress.md](docs/progress.md).
