# Trace protocol (version 2)

Source of truth: [`src/engine/protocol.ts`](../src/engine/protocol.ts) (types), [`reduce.ts`](../src/engine/reduce.ts) (semantics), [`validate.ts`](../src/engine/validate.ts) (acceptance rules).

## Shape

```jsonc
{
  "protocol": "algorithma.trace",
  "version": 2,
  "algorithm": { "id": "bubble-sort", "version": 1 },
  "input": [5, 1, 4], // opaque to the engine
  "initial": {
    "structures": {
      "A": { "kind": "array", "values": [5, 1, 4], "marks": [null, null, null], "pointers": {} },
    },
    "order": ["A"], // display order
    "vars": {},
  },
  "events": [
    {
      "type": "array.compare",
      "s": "A",
      "i": 0,
      "j": 1,
      "line": 5,
      "vars": { "j": 0 },
      "note": "Compare A[0] = 5 with A[1] = 1.",
    },
    { "type": "array.swap", "s": "A", "i": 0, "j": 1, "line": 6 },
    { "type": "done" },
  ],
  "result": [1, 4, 5], // the algorithm's own return value
  "meta": {
    "eventCount": 3,
    "truncated": null,
    "counters": { "comparisons": 1, "swaps": 1, "reads": 0, "writes": 0 },
  },
}
```

Position _p_ means "after the first _p_ events"; position 0 is the initial state. A trace has `eventCount + 1` positions.

## Structures

| kind       | fields                                                                                                               | notes                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `array`    | `values`, `marks[]`, `pointers{}`, optional `display: "bars" \| "cells"`                                             | marks: `sorted`, `pivot`, `found`, `discarded`, `active`, `min`                                                                            |
| `graph`    | `directed`, `nodes[{id,x,y,label?}]`, `edges[{id,from,to,weight?}]`, `nodeStatus{}`, `edgeStatus{}`, `annotations{}` | x, y in the unit square, supplied by the producer so replay draws the same picture                                                         |
| `sequence` | `discipline: queue \| stack \| priority`, `items[]`                                                                  | priority pops name the index removed                                                                                                       |
| `grid`     | `rows`, `cols`, `cells[][]`, `marks[][]`, optional `rowHeaders`, `colHeaders`                                        | DP tables, matrices                                                                                                                        |
| `tree`     | `binary`, `root`, `nodes{id: {value, children[], edgeLabel?}}`, `nodeStatus{}`, `annotations{}`                      | binary trees keep two slots `[left, right]` (`null` = empty); general trees keep an ordered child list. Layout is computed by the renderer |

## Events

Every event may carry `line` (1-based pseudocode line; persists until changed), `note` (narration; shown for this event only), `vars` (merged into the inspector; `null` deletes) and `count` (custom counter increments).

| event                                             | effect                                                                                                      | counters       |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------- |
| `array.compare {s,i,j?,value?}`                   | focus _i, j_ (or _i_ vs a value)                                                                            | comparisons +1 |
| `array.read {s,i}`                                | focus _i_                                                                                                   | reads +1       |
| `array.write {s,i,value}`                         | `values[i] = value`                                                                                         | writes +1      |
| `array.swap {s,i,j}`                              | swap `values[i]`, `values[j]`                                                                               | swaps +1       |
| `array.mark {s,indices,mark}`                     | set persistent marks (`null` clears)                                                                        |                |
| `array.pointer {s,name,index}`                    | move or remove (`null`) a named pointer; −1 and _n_ allowed                                                 |                |
| `graph.node {s,node,status}`                      | node status                                                                                                 |                |
| `graph.edge {s,edge,status}`                      | edge status; focus its endpoints                                                                            |                |
| `graph.annotate {s,node,text}`                    | short label under a node (`null` clears)                                                                    |                |
| `seq.push {s,value}`                              | append                                                                                                      |                |
| `seq.pop {s,index?}`                              | remove front (queue), back (stack) or `index` (priority)                                                    |                |
| `grid.write {s,r,c,value}`                        | set a cell                                                                                                  | writes +1      |
| `grid.read {s,cells}`                             | focus cells                                                                                                 | reads +cells   |
| `grid.mark {s,cells,mark}`                        | persistent cell marks                                                                                       |                |
| `tree.add {s,node,value,parent,slot?,edgeLabel?}` | add a node; `parent: null` makes it the root of an empty tree; `slot` is 0/1 (binary) or an insertion index | writes +1      |
| `tree.set {s,node,value}`                         | change a node's value                                                                                       | writes +1      |
| `tree.compare {s,node,value}`                     | focus a node compared with a value                                                                          | comparisons +1 |
| `tree.node {s,node,status}`                       | node status (same statuses as graphs)                                                                       |                |
| `tree.annotate {s,node,text}`                     | short label under a node (`null` clears)                                                                    |                |
| `tree.remove {s,node}`                            | delete a leaf                                                                                               |                |
| `tree.splice {s,node}`                            | delete a node with at most one child; the child takes its place                                             |                |
| `tree.move {s,node,parent,slot?}`                 | re-attach a non-root node, with its subtree, under a node outside that subtree                              |                |
| `structure.create {s,structure}`                  | add a structure mid-run                                                                                     |                |
| `structure.remove {s}`                            | remove it                                                                                                   |                |
| `step`                                            | narration / line change only                                                                                |                |
| `done`                                            | end of trace; any later event is invalid                                                                    |                |

**Focus** is transient: it is recomputed from each event and cleared before the next one, so stepping backwards never leaves stale highlights.

## Acceptance rules for untrusted traces

`validateTrace(json)` never throws. It checks protocol and version, every field type, unknown event types and unknown fields (rejected, not ignored), duplicate node and edge ids, dangling edges, matrix shapes, `meta.eventCount`, and these limits:

| limit               | value       |
| ------------------- | ----------- |
| events              | 200,000     |
| array length        | 2,000       |
| graph nodes / edges | 500 / 5,000 |
| grid cells          | 40,000      |
| tree nodes          | 500         |
| structures          | 32          |
| string length       | 500         |

It then **replays** the trace: an event that references a missing structure, an out-of-range index, an unknown node, or a pop from an empty sequence fails with the event's index. Initial trees must have one root, every node reachable exactly once (no cycles, no node with two parents) and binary nodes with exactly two slots. Tree events are applied by functions that refuse any edit that would break this: a second root, an occupied slot, removing a node that still has children, splicing out a node with two children, or moving a node into its own subtree.

Tree operations are implemented once (`src/engine/tree.ts`) and shared by the tracer, the reducer and the validator, so a tree edit means the same thing when it is recorded, replayed and checked.

## Truncation

Producers have an event budget (default 50,000). When it is exhausted the tracer stops recording, keeps executing, writes a final `done`, and sets `meta.truncated = { afterEvents, reason }`. `meta.counters` and `result` describe the _whole_ execution; the replayed state describes only the recorded prefix. The UI shows a warning; it never presents a truncated trace as complete.

## Versions

| version | change                                                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1       | arrays, graphs, sequences, grids                                                                                              |
| 2       | adds the `tree` structure and the eight `tree.*` events. Every v1 trace is a valid v2 trace; migration only bumps the version |

`tree.move`, `tree.remove` and `tree.splice` change no counter: they are structural. When an algorithm both stores a pointer in an array and draws it as a tree edge (union-find), the array write is the counted operation.

## Evolution

- Adding an optional field or a new event/structure kind is a **minor** change: bump the protocol version, teach the validator and reducer, and add a migration only if older traces need rewriting.
- `migrateTrace` upgrades `v(n) → v(n+1)` step by step and refuses versions newer than the app, so old saved traces keep loading and new ones fail with a clear message on old clients.
- Algorithm modules have their own `version`, bumped when their emitted events or pseudocode lines change, so a saved trace can be matched to the pseudocode it refers to.
