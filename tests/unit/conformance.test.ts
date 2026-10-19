/**
 * Conformance suite run against EVERY registered algorithm module.
 *
 * A contributor who registers a module gets these guarantees checked automatically:
 *  1. the output is correct according to the module's independent oracle,
 *  2. the trace survives JSON serialisation and passes untrusted-trace validation,
 *  3. replaying the trace reproduces the output (trace fidelity),
 *  4. replayed counters equal the counters observed during execution,
 *  5. execution is deterministic (same input → byte-identical trace),
 *  6. counting mode produces the same counters with no events,
 *  7. every event's pseudocode line exists,
 *  8. stepping backwards yields the same states as stepping forwards,
 *  9. presets parse back from their formatted text form.
 */
import { describe, expect, it } from "vitest";
import { ALGORITHM_MODULES } from "@/algorithms/registry";
import { runAlgorithm } from "@/algorithms/run";
import { TracePlayer } from "@/engine/player";
import { validateTrace } from "@/engine/validate";
import { createRng } from "@/lib/random";

const RANDOM_CASES = 25;

describe.each(ALGORITHM_MODULES.map((m) => [m.id, m] as const))("%s", (_id, module) => {
  const inputs = [
    ...module.input.presets.map((p) => ({ label: `preset ${p.id}`, value: p.value })),
    ...Array.from({ length: RANDOM_CASES }, (_, i) => {
      const rng = createRng(1000 + i);
      return { label: `random seed ${1000 + i}`, value: module.input.random(rng, 2 + (i % 12)) };
    }),
  ];

  it.each(inputs)("$label: correct, faithful, valid and deterministic", ({ value }) => {
    const { output, trace } = runAlgorithm(module, value);
    expect(module.check(value, output)).toBeNull();
    expect(trace.meta.truncated).toBeNull();

    const json = JSON.stringify(trace);
    const validated = validateTrace(JSON.parse(json));
    if (!validated.ok) throw new Error(validated.errors.join("\n"));
    const final = validated.player.finalState();
    expect(module.fidelity(final, output)).toBeNull();
    expect(final.counters).toEqual(trace.meta.counters);
    expect(final.done).toBe(true);

    expect(JSON.stringify(runAlgorithm(module, value).trace)).toBe(json);

    const counted = runAlgorithm(module, value, { mode: "count" });
    expect(counted.trace.events).toHaveLength(0);
    expect(counted.trace.meta.counters).toEqual(trace.meta.counters);
    expect(counted.output).toEqual(output);

    for (const e of trace.events) {
      if (e.line !== undefined) {
        expect(e.line).toBeGreaterThanOrEqual(1);
        expect(e.line).toBeLessThanOrEqual(module.pseudocode.length);
      }
    }
  });

  it("steps backwards to exactly the states reached stepping forwards", () => {
    const { trace } = runAlgorithm(module, module.input.presets[0]!.value);
    const player = new TracePlayer(trace, { keyframeInterval: 7 });
    const forward = [];
    for (let p = 0; p <= player.length; p++) forward.push(player.stateAt(p));
    for (let p = player.length; p >= 0; p--) expect(player.stateAt(p)).toEqual(forward[p]);
  });

  it("parses every preset back from its formatted text", () => {
    for (const preset of module.input.presets) {
      const parsed = module.input.parse(module.input.format(preset.value));
      expect(parsed).toEqual({ ok: true, value: preset.value });
    }
  });

  it("generates random inputs that pass its own parser", () => {
    for (let i = 0; i < 20; i++) {
      const value = module.input.random(createRng(i), i + 1);
      expect(module.input.parse(module.input.format(value)).ok).toBe(true);
    }
  });
});
