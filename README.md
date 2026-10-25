# ALGORITHMA

**Learn. Visualize. Implement. Experiment. Innovate.**

ALGORITHMA is an algorithm encyclopedia whose entries can be run. Pick an algorithm, read it at the depth you need, give it your own input, and step through its real execution — forwards and backwards — with the pseudocode, variables and operation counts beside it.

## What is here

- **73 interactive algorithms**, covering every Tier 1, 2 and 3 item of the curriculum and more:
  - searching and sorting: linear and binary search; bubble, selection, insertion, Shell, merge, quick and heap sort; counting and radix sort; randomized quickselect;
  - arrays: prefix sums, sliding window, two pointers, monotonic stack and queue, sparse table;
  - graphs: BFS, DFS, Dijkstra, A\*, Bellman–Ford, Floyd–Warshall, topological sort (Kahn and DFS), strongly connected components (Kosaraju, Tarjan), bridges and articulation points, union-find, Kruskal, Prim; maximum flow (Dinic, push–relabel) and bipartite matching (Hopcroft–Karp);
  - dynamic programming: memoization vs tabulation, edit distance, LCS, 0/1 knapsack, longest increasing subsequence, Held–Karp, assignment by bitmask DP, digit DP, the convex hull trick;
  - strings: KMP, Aho–Corasick, Manacher, suffix array, suffix tree, suffix automaton;
  - trees: traversals, binary search trees, tries, segment trees, Fenwick trees, binary lifting (LCA), heavy-light decomposition, k-d trees;
  - maths: the extended Euclidean algorithm, the sieve of Eratosthenes, matrix exponentiation, Miller–Rabin, Pollard's rho, the Chinese remainder theorem, NTT and FFT;
  - geometry: Graham scan, closest pair of points;
  - search and learning: Monte Carlo tree search, gradient descent;
  - parallel and distributed: MapReduce, Paxos, Raft, on a simulated network with message loss, crashes and partitions.
- **Lessons at five depths** (intuition → mechanics → implementation → mathematics → advanced), tested Python and JavaScript code, practice questions with hints, and printable exam notes. Each lesson shows a learning path through its prerequisites and links to the entries that build on it.
- **Progress**: practice results by topic, kept in the browser, with suggestions for what is ready to learn next.
- **A 600-algorithm roadmap** with priority tiers, showing honestly which entries exist and which are planned.
- **Arena**: compare sorting, searching or shortest-path algorithms on identical, seeded inputs by exact operation counts, in a Web Worker; every output is checked.
- **Studio**: visualize any algorithm that emits a trace in the documented format, as JSON or gzip-compressed JSON; untrusted traces are validated before anything is drawn.
- **Code runner** (built and tested, off by default): edit and run each lesson's JavaScript in an isolated browser sandbox with no network access. It stays off in default builds until it has had an independent security review ([ADR-0007](docs/decisions/0007-browser-code-sandbox.md)).

## How it works

Algorithms are written against a small tracer SDK. They mutate their data _through_ traced wrappers, so every recorded event is an operation the algorithm actually performed. A trace is a versioned list of semantic events over named structures (arrays, graphs, queues/stacks, tables, trees, points in the plane, and process timelines). One reducer defines what each event means, a keyframed player reconstructs any position in well under a millisecond, and seven renderers draw any valid trace — without knowing which algorithm produced it.

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
| [docs/content-review.md](docs/content-review.md)                                     | Review states, what is verified automatically, how to record a review            |
| [docs/progress.md](docs/progress.md)                                                 | Current state, quality gates, backlog, how to resume                             |

## Status

This is an early release. Lesson prose was written with AI assistance and is marked as an unreviewed draft; code, numbers and maths syntax in the lessons are checked by tests. The code runner is off by default pending an independent security review. Accounts, server-side execution and community features are not built yet — see [docs/progress.md](docs/progress.md).
