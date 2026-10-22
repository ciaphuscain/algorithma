# ALGORITHMA

**Learn. Visualize. Implement. Experiment. Innovate.**

ALGORITHMA is an algorithm encyclopedia whose entries can be run. Pick an algorithm, read it at the depth you need, give it your own input, and step through its real execution — forwards and backwards — with the pseudocode, variables and operation counts beside it.

## What is here

- **28 interactive algorithms**: linear and binary search; bubble, selection, insertion, merge, quick and heap sort; BFS, DFS, Dijkstra, Bellman–Ford, Floyd–Warshall, topological sort (Kahn and DFS), union-find, Kruskal and Prim; edit distance, LCS, 0/1 knapsack and longest increasing subsequence; KMP string matching; tree traversals, binary search trees, tries, segment trees and Fenwick trees.
- **Lessons at five depths** (intuition → mechanics → implementation → mathematics → advanced), tested Python and JavaScript code, practice questions with hints, and printable exam notes.
- **A 600-algorithm roadmap** with priority tiers, showing honestly which entries exist and which are planned.
- **Arena**: compare sorting algorithms on identical, seeded inputs by exact operation counts.
- **Studio**: visualize any algorithm that emits a trace in the documented format; untrusted traces are validated before anything is drawn.
- **Code runner** (built and tested, off by default): edit and run each lesson's JavaScript in an isolated browser sandbox with no network access. It stays off in default builds until it has had an independent security review ([ADR-0007](docs/decisions/0007-browser-code-sandbox.md)).

## How it works

Algorithms are written against a small tracer SDK. They mutate their data _through_ traced wrappers, so every recorded event is an operation the algorithm actually performed. A trace is a versioned list of semantic events over named structures (arrays, graphs, queues/stacks, tables, trees). One reducer defines what each event means, a keyframed player reconstructs any position in well under a millisecond, and five renderers draw any valid trace — without knowing which algorithm produced it.

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
npm run build:e2e && npm run test:e2e   # e2e against a production build with the code runner on
```

## Documentation

| Document                                                                             | What it covers                                                                   |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| [docs/architecture.md](docs/architecture.md)                                         | Engineering assessment, options considered, module boundaries, risks, priorities |
| [docs/trace-protocol.md](docs/trace-protocol.md)                                     | The trace format, event semantics, validation limits, versioning                 |
| [docs/adding-an-algorithm.md](docs/adding-an-algorithm.md)                           | Step-by-step contributor guide, with pitfalls                                    |
| [docs/testing.md](docs/testing.md)                                                   | Test layers, mutation evidence, what tests do not prove                          |
| [docs/security.md](docs/security.md)                                                 | Trust boundaries and threat register, including the code sandbox                 |
| [docs/experiments/trace-reconstruction.md](docs/experiments/trace-reconstruction.md) | Measured comparison of snapshot, replay and keyframe strategies                  |
| [docs/decisions/](docs/decisions/)                                                   | Architecture decision records                                                    |
| [docs/assumptions.md](docs/assumptions.md)                                           | Assumption register                                                              |
| [docs/content-review.md](docs/content-review.md)                                     | Review states and what is verified automatically                                 |
| [docs/progress.md](docs/progress.md)                                                 | Current state, quality gates, backlog, how to resume                             |

## Status

This is an early release. Lesson prose was written with AI assistance and is marked as an unreviewed draft; code, numbers and maths syntax in the lessons are checked by tests. The code runner is off by default pending an independent security review. Accounts, server-side execution and community features are not built yet — see [docs/progress.md](docs/progress.md).
