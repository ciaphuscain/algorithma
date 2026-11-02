# ADR-0002: Versioned semantic-event traces over named structures, with in-memory √N keyframes

- Status: accepted (2026-10-19). Evidence: [trace-reconstruction experiment](../experiments/trace-reconstruction.md)

## Context

Visualizations must be reusable across unrelated algorithms, faithful to execution, steppable backwards, and robust to malformed input (imported traces). Options for the trace format: (1) full snapshots per step, (2) semantic events, (3) state diffs, (4) snapshots + events.

## Decision

- The wire format is **semantic events** (`array.compare`, `array.swap`, `graph.edge`, `seq.push`, `grid.write`, …) applied to **named structures** of four kinds: array, graph, sequence, grid. A single reducer defines each event's effect.
- Snapshots are **derived, not stored**: the player replays once and keeps keyframes every ⌈√N⌉ events.
- Traces carry `protocol` and `version`; `migrateTrace` upgrades old versions and rejects newer ones with a clear message.
- A tracer **event budget** bounds trace size; exhaustion marks the trace `truncated` rather than silently dropping events.

## Alternatives

- **Full snapshots:** simplest playback, but measured 711 MB for a 90k-event trace and no semantic information (cannot count comparisons or narrate).
- **Generic diffs (JSON patches):** compact and generic, but lose meaning: a renderer cannot tell a comparison from a write, and operation counts become impossible.
- **Per-algorithm event types:** expressive, but every algorithm would need renderer changes — the exact coupling we are avoiding.

## Consequences

- New algorithms reuse renderers if they fit the four structure kinds; new kinds require a protocol minor version (types, validator, reducer, renderer).
- Semantics of each event live in exactly one function, so replay is deterministic and testable.
- Narration is ~47% of trace bytes; acceptable in memory, compress if traces are stored.
