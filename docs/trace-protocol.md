# Trace protocol (version 1)

Source of truth: [`src/engine/protocol.ts`](../src/engine/protocol.ts) (types), [`reduce.ts`](../src/engine/reduce.ts) (semantics), [`validate.ts`](../src/engine/validate.ts) (acceptance rules).

## Shape

```jsonc
{
  "protocol": "algorithma.trace",
  "version": 1,
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

| kind       | fields                                                                                                               | notes                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `array`    | `values`, `marks[]`, `pointers{}`, optional `display: "bars" \| "cells"`                                             | marks: `sorted`, `pivot`, `found`, `discarded`, `active`, `min`                    |
| `graph`    | `directed`, `nodes[{id,x,y,label?}]`, `edges[{id,from,to,weight?}]`, `nodeStatus{}`, `edgeStatus{}`, `annotations{}` | x, y in the unit square, supplied by the producer so replay draws the same picture |
| `sequence` | `discipline: queue \| stack \| priority`, `items[]`                                                                  | priority pops name the index removed                                               |
| `grid`     | `rows`, `cols`, `cells[][]`, `marks[][]`, optional `rowHeaders`, `colHeaders`                                        | DP tables, matrices                                                                |

## Events

Every event may carry `line` (1-based pseudocode line; persists until changed), `note` (narration; shown for this event only), `vars` (merged into the inspector; `null` deletes) and `count` (custom counter increments).

| event                            | effect                                                      | counters       |
| -------------------------------- | ----------------------------------------------------------- | -------------- |
| `array.compare {s,i,j?,value?}`  | focus _i, j_ (or _i_ vs a value)                            | comparisons +1 |
| `array.read {s,i}`               | focus _i_                                                   | reads +1       |
| `array.write {s,i,value}`        | `values[i] = value`                                         | writes +1      |
| `array.swap {s,i,j}`             | swap `values[i]`, `values[j]`                               | swaps +1       |
| `array.mark {s,indices,mark}`    | set persistent marks (`null` clears)                        |                |
| `array.pointer {s,name,index}`   | move or remove (`null`) a named pointer; −1 and _n_ allowed |                |
| `graph.node {s,node,status}`     | node status                                                 |                |
| `graph.edge {s,edge,status}`     | edge status; focus its endpoints                            |                |
| `graph.annotate {s,node,text}`   | short label under a node (`null` clears)                    |                |
| `seq.push {s,value}`             | append                                                      |                |
| `seq.pop {s,index?}`             | remove front (queue), back (stack) or `index` (priority)    |                |
| `grid.write {s,r,c,value}`       | set a cell                                                  | writes +1      |
| `grid.read {s,cells}`            | focus cells                                                 | reads +cells   |
| `grid.mark {s,cells,mark}`       | persistent cell marks                                       |                |
| `structure.create {s,structure}` | add a structure mid-run                                     |                |
| `structure.remove {s}`           | remove it                                                   |                |
| `step`                           | narration / line change only                                |                |
| `done`                           | end of trace; any later event is invalid                    |                |

**Focus** is transient: it is recomputed from each event and cleared before the next one, so stepping backwards never leaves stale highlights.

## Acceptance rules for untrusted traces

`validateTrace(json)` never throws. It checks protocol and version, every field type, unknown event types and unknown fields (rejected, not ignored), duplicate node and edge ids, dangling edges, matrix shapes, `meta.eventCount`, and these limits:

| limit               | value       |
| ------------------- | ----------- |
| events              | 200,000     |
| array length        | 2,000       |
| graph nodes / edges | 500 / 5,000 |
| grid cells          | 40,000      |
| structures          | 32          |
| string length       | 500         |

It then **replays** the trace: an event that references a missing structure, an out-of-range index, an unknown node, or a pop from an empty sequence fails with the event's index.

## Truncation

Producers have an event budget (default 50,000). When it is exhausted the tracer stops recording, keeps executing, writes a final `done`, and sets `meta.truncated = { afterEvents, reason }`. `meta.counters` and `result` describe the _whole_ execution; the replayed state describes only the recorded prefix. The UI shows a warning; it never presents a truncated trace as complete.

## Evolution

- Adding an optional field or a new event/structure kind is a **minor** change: bump the protocol version, teach the validator and reducer, and add a migration only if older traces need rewriting.
- `migrateTrace` upgrades `v(n) → v(n+1)` step by step and refuses versions newer than the app, so old saved traces keep loading and new ones fail with a clear message on old clients.
- Algorithm modules have their own `version`, bumped when their emitted events or pseudocode lines change, so a saved trace can be matched to the pseudocode it refers to.
