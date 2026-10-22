# Adding an algorithm

This guide takes a new algorithm from code to a published, visualized, tested entry. It was written while adding the first nine modules and has since been followed for nineteen more; the pitfalls section lists bugs that actually happened.

You will touch at most four files, none of them engine or renderer code:

| Step                         | File                                                       | Checked by             |
| ---------------------------- | ---------------------------------------------------------- | ---------------------- |
| 1. Implement against the SDK | `src/algorithms/<family>/<id>.ts`                          | conformance suite      |
| 2. Register it               | `src/algorithms/registry.ts`                               | conformance suite, e2e |
| 3. Add invariants            | `tests/unit/properties.test.ts`                            | property tests         |
| 4. Write the lesson          | `src/content/entries/<slug>.ts` + `src/content/catalog.ts` | content tests          |

## 1. Implement the module

An algorithm is an `AlgorithmModule<Input, Output>` (`src/algorithms/types.ts`):

```ts
export const linearSearch: AlgorithmModule<SearchInput, number> = {
  id: "linear-search",
  version: 1,                        // bump when events or pseudocode lines change
  pseudocode: [
    "procedure linearSearch(A, x)",
    "  for i ← 0 to n − 1",
    "    if A[i] = x: return i",
    "  return −1",
  ],
  input: sortedSearchInput({ ... }), // or numberArrayInput, graphInput, stringPairInput, or your own
  run(input, t) {
    const A = t.array("A", input.values, { display: "cells" });
    for (let i = 0; i < A.length; i++) {
      if (A.compareWith(i, input.target, { line: 3, vars: { i } }) === 0) {
        A.mark(i, "found", { line: 3, note: `Found at ${i}.` });
        t.finish(input, i);
        return i;
      }
    }
    t.finish(input, -1, { line: 4 });
    return -1;
  },
  check: (input, out) => /* independent oracle: return an error string or null */ null,
  fidelity: (finalState, out) => /* does the replayed state show `out`? */ null,
  describeOutput: (out) => (out === -1 ? "Not found" : `Index ${out}`),
};
```

### The tracer SDK

Create structures, then mutate them **only through the returned wrappers**. Each wrapper performs the real operation and records it, so the trace cannot disagree with the computation.

| Structure                | Create                                                         | Operations                                                                                                                                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Array                    | `t.array(name, values, { label?, display? })`                  | `get`, `num`, `read`, `compare(i, j)`, `compareWith(i, value)`, `write`, `swap`, `mark(indices, mark)`, `pointer(name, index)`                                                                                                                                                               |
| Graph                    | `t.graph(name, { directed, nodes, edges })`                    | `node(id, status)`, `edge(id, status)`, `annotate(id, text)`                                                                                                                                                                                                                                 |
| Queue / stack / priority | `t.sequence(name, discipline)`                                 | `push`, `pop` (queue/stack), `popAt(index)` (priority), `peekAll`                                                                                                                                                                                                                            |
| Table                    | `t.grid(name, rows, cols, fill, { rowHeaders?, colHeaders? })` | `get`, `num`, `read(cells)`, `write(r, c, v)`, `mark(cells, mark)`                                                                                                                                                                                                                           |
| Tree                     | `t.tree(name, { binary, label? })`                             | `add(value, parent, slot?, meta?, { id?, edgeLabel? })` returns the node id; `set`, `compare(id, value)`, `status`, `annotate`, `remove` (leaf), `splice` (≤ 1 child), `move(id, parent, slot?)`; reads: `root`, `size`, `has`, `value`, `num`, `children`, `child(id, 0 \| 1)`, `edgeLabel` |
| —                        | —                                                              | `t.step(meta)` (narration only), `t.tally(counter)` (custom counter), `t.initVars`, `t.remove(name)`, `t.finish(input, output, meta?)`                                                                                                                                                       |

Every operation takes optional metadata `{ line, note, vars }`. Pass a **function** returning the metadata when it builds strings: it is evaluated only when recording, so Arena's counting mode stays fast.

Structures created after the first event appear mid-trace (`structure.create`); use this for temporary buffers.

### Input specs

`parse` is the only way user text becomes input, so it owns every limit. For graphs, `graphInput({ directed, weighted, limits, presets })` parses edge lists; pass `withSource: false` when the algorithm has no start vertex (Kruskal, Floyd–Warshall, topological sort), so the form does not ask for one. Keep visual inputs small (≤ 40 array elements, ≤ 26 graph nodes): beyond that, steps stop being readable. Presets must round-trip through `format` → `parse` (the conformance suite checks this), and `random(rng, size)` must only produce inputs that `parse` accepts.

### The oracle (`check`)

Do not call your own implementation. Use a different method: a library sort, a brute-force search, Bellman–Ford for shortest paths, a memoised recursion for a DP. Pairs of algorithms for the same problem make good mutual oracles: Kruskal is checked by a naive Prim and Prim by a naive Kruskal; Bellman–Ford by Floyd–Warshall and the reverse (`src/algorithms/graph/common.ts`). For problems with many valid answers (DFS orders, shortest-path trees), check the defining properties instead of one exact answer.

## 2. Register

Add the module to `ALGORITHM_MODULES` in `src/algorithms/registry.ts`, then run:

```bash
npm test -- conformance
```

The conformance suite runs every preset and 25 seeded random inputs and checks the oracle, JSON round-trip validation, replay fidelity, determinism, counter consistency, counting mode, pseudocode line numbers, and backward/forward equality. Nothing else is needed for the visualizer: renderers are picked by structure kind.

## 3. Add invariants

Add a property test for anything that must hold on _every_ input — operation-count formulas, output properties, metric axioms. Existing examples: swaps equal inversions (bubble sort), at most ⌊log₂ n⌋ + 1 comparisons (binary search), the parenthesis theorem (DFS), and for every sort "a position marked `sorted` already holds its final value".

## 4. Write the lesson

Create an `AlgorithmEntry` (`src/content/types.ts`) and add it to `ENTRIES` in `src/content/catalog.ts`, listing the curriculum numbers it covers (duplicates such as #330 → #276 resolve automatically). Set `visualizer` to your module id.

- Five levels: intuition, mechanics (with a worked example), implementation, mathematics, advanced. Inline `$TeX$`, `**bold**`, `` `code` `` and `*emphasis*` are supported.
- Python and JavaScript implementations with test cases — they are executed by `tests/unit/content.test.ts`.
- Practice questions: give the reason each wrong option is wrong, and hints that do not reveal the answer.
- Exam notes, including generic answer outlines by marks. Do not invent institutional marking schemes.
- References: well-known sources only, each with what it supports. Never cite something you have not verified exists.
- `review.status: "draft"` until a subject-matter expert reviews it ([content-review.md](content-review.md)).

Then add a test in the "worked examples agree with the engine" block for every number your lesson states: counts, intermediate arrays, tables. This caught mistakes during development.

## 5. Verify

```bash
npm run check                 # typecheck, lint, unit/property/conformance/content tests
npm run build && npm run test:e2e
```

Open `/algorithms/<slug>`, step through the presets in both colour schemes, and read the narration as a learner would. Add the page to `tests/e2e/a11y.spec.ts`.

## When no structure kind fits

Geometry and timelines still need new kinds. Adding one is a protocol change, made once for all future algorithms of that family. The tree kind was added this way (protocol v2: `src/engine/tree.ts`, `TreeView.tsx`) and then used unchanged by five algorithms:

1. Add the type to `src/engine/protocol.ts` and bump `TRACE_VERSION` if old traces would be affected.
2. Add its events to the reducer (`reduce.ts`), validator (`validate.ts`) and tracer wrappers (`tracer.ts`), with engine tests.
3. Add one renderer and one `describeStructure` case in `src/ui/renderers/`.

Do not add algorithm-specific code to renderers; a test fails if renderer sources mention algorithm ids.

## Pitfalls (all of these happened)

- **Narration evaluated after the mutation.** Lazy metadata for `swap`, `write` and `pop` runs _after_ the data changes. Capture values first: `const [x, y] = [A.get(i), A.get(j)]; A.swap(i, j, () => ({ note: \`${x} > ${y}\` }))`.
- **Marks belong to positions, not values.** When quicksort swapped its pivot into place, the "pivot" mark stayed on the old position. Clear marks you move away from.
- **The final position is the `done` event.** Its narration is "Finished." unless you pass metadata to `finish`.
- **Ties and iteration order.** Sort neighbours (`adjacency()` does) and break priority ties explicitly, or traces stop being deterministic.
- **Dangling links.** `related` must name published entries; a test enforces it.
- **Stale variables.** Variables persist until overwritten, so a value from the previous iteration can sit next to new ones (Kruskal showed the last edge's root beside the current edge). Set every per-iteration variable, or `null`, on the first event of the iteration.
- **Presets outside your own limits.** A preset with 101 in an input limited to ±99 failed the round-trip check. Keep presets inside the limits `parse` enforces.
- **`initVars` only works before the first event.** Inside a loop, announce changing state with `t.step({ vars })` instead.
- **Rows in input order.** Floyd–Warshall first labelled its table A, C, B, D because vertices appear in the order the edge list mentions them. Sort ids where a reader expects order.
