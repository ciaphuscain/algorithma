# ADR-0003: Do not execute user-supplied code until an isolation boundary exists and is tested

- Status: accepted (2026-10-19)

## Context

The Code module and Algorithm Studio eventually need user programs (Python, C++, Java, JavaScript). User code is hostile by default: it can loop forever, exhaust memory, exfiltrate data from the origin it runs in, or attack the server.

## Decision

The current release executes only reviewed, in-repo algorithm modules. Lessons show reference code (which runs in CI, not in the product). The Studio accepts **trace data**, which is validated structurally and semantically with resource limits, never code.

## Options for later, in order of preference for this product

1. **Browser execution in a sandboxed, cross-origin iframe + Web Worker** (JS; Python via Pyodide/WASM). The code runs on the user's own machine, in an opaque origin with no access to the app's cookies or storage; `Worker.terminate()` enforces wall-clock limits. Suitable for running _your own_ code. Not sufficient for running _other people's_ published code without review, and does not support C++/Java without WASM toolchains.
2. **Server-side microVM workers (Firecracker/gVisor-class isolation)** with CPU, memory, process, output and time limits, no network, ephemeral filesystems and a job queue. Needed for multi-language support and for grading.
3. Plain containers or in-process sandboxes (`vm`, `iframe` alone) are **rejected** as security boundaries.

## Consequences

- No user-code features yet; this is stated in the UI.
- When option 1 or 2 is built, it must ship with adversarial tests (infinite loops, fork bombs, large output, memory exhaustion, network attempts, filesystem escapes, timing out cancellation) before being enabled.
