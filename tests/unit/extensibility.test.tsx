// @vitest-environment jsdom
/**
 * The platform's core extensibility claim, tested end to end:
 *
 *   An algorithm that is NOT registered anywhere, written only against the public
 *   tracer SDK (or delivered as raw JSON), is validated, replayed and drawn by the
 *   existing renderers — with no change to renderer or engine code.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ALGORITHM_MODULES } from "@/algorithms/registry";
import { runAlgorithm } from "@/algorithms/run";
import { TracePlayer } from "@/engine/player";
import { Tracer } from "@/engine/tracer";
import { validateTrace } from "@/engine/validate";
import { STUDIO_EXAMPLES, pascalTrace, sieveTrace } from "@/studio/examples";
import { StructurePanel } from "@/ui/renderers";
import { describeState } from "@/ui/renderers/describe";
import { TraceViewer } from "@/ui/visualizer/TraceViewer";

afterEach(cleanup);

/** A brand-new algorithm, defined only in this test: two-pointer pair sum on a sorted array. */
function twoPointerTrace(values: number[], target: number) {
  const t = new Tracer({ id: "test/two-pointer-sum", version: 1 });
  const A = t.array("A", values, { display: "cells", label: "A" });
  let lo = 0;
  let hi = A.length - 1;
  let found: [number, number] | null = null;
  while (lo < hi) {
    A.pointer("lo", lo, { line: 2 });
    A.pointer("hi", hi, { line: 2 });
    const sum = A.num(lo) + A.num(hi);
    t.step({ line: 3, vars: { lo, hi, sum }, note: `A[${lo}] + A[${hi}] = ${sum}` });
    if (sum === target) {
      found = [lo, hi];
      A.mark([lo, hi], "found", { line: 4, note: "Found the pair." });
      break;
    }
    if (sum < target) lo++;
    else hi--;
  }
  return t.finish({ values, target }, found);
}

const roundTrip = (trace: unknown) => {
  const result = validateTrace(JSON.parse(JSON.stringify(trace)));
  if (!result.ok) throw new Error(result.errors.join("\n"));
  return result;
};

describe("unregistered algorithms reuse the existing renderers", () => {
  it("the example algorithms are not registered modules", () => {
    const ids = new Set(ALGORITHM_MODULES.map((m) => m.id));
    for (const trace of [sieveTrace(), pascalTrace(), twoPointerTrace([1, 2, 3], 4)]) {
      expect(ids.has(trace.algorithm.id)).toBe(false);
    }
  });

  it("Sieve of Eratosthenes (array cells) renders the primes it found", () => {
    const { player, trace } = roundTrip(sieveTrace(30));
    expect(trace.result).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    const final = player.finalState();
    render(<StructurePanel name="N" structure={final.structures.N!} focus={final.focus} />);
    const svg = screen.getByRole("img", { name: /Numbers 2..n/ });
    // Every number 2..30 is drawn, and the found/discarded marks are applied per position.
    for (const v of [2, 17, 29, 30])
      expect(within(svg as unknown as HTMLElement).getAllByText(String(v)).length).toBeGreaterThan(
        0,
      );
    const N = final.structures.N!;
    if (N.kind !== "array") throw new Error("expected an array");
    const primes = N.values.filter((_, i) => N.marks[i] === "found");
    expect(primes).toEqual(trace.result);
  });

  it("Pascal's triangle (grid) renders binomial coefficients", () => {
    const { player } = roundTrip(pascalTrace(7));
    const final = player.finalState();
    render(<StructurePanel name="C" structure={final.structures.C!} focus={final.focus} />);
    const table = screen.getByRole("table", { name: /C\(i, j\)/ });
    const row6 = within(table).getByRole("row", { name: /i=6/ });
    expect(
      within(row6)
        .getAllByRole("cell")
        .map((c) => c.textContent),
    ).toEqual(["1", "6", "15", "20", "15", "6", "1"]);
  });

  it("a test-local algorithm plays forward and backward in the full viewer", async () => {
    const user = userEvent.setup();
    const { player } = roundTrip(twoPointerTrace([1, 3, 4, 6, 8, 11], 10));
    render(
      <TraceViewer
        player={player}
        pseudocode={[
          "procedure twoSum(A, target)",
          "  lo ← 0; hi ← n − 1",
          "  sum ← A[lo] + A[hi]",
          "  if sum = target: done",
        ]}
      />,
    );

    const forward = screen.getByRole("button", { name: "Step forward" });
    for (let i = 0; i < 3; i++) await user.click(forward);
    expect(screen.getByTestId("narration")).toHaveTextContent("A[0] + A[5] = 12");
    expect(screen.getByText("sum").nextSibling).toHaveTextContent("12");
    expect(document.querySelector('.pseudo li[aria-current="step"]')).toHaveTextContent(
      "sum ← A[lo] + A[hi]",
    );

    await user.click(screen.getByRole("button", { name: "Jump to end" }));
    expect(screen.getByTestId("narration")).toHaveTextContent("Finished.");
    expect(describeState(player.finalState())).toContain("marked 2:found, 3:found");

    await user.click(screen.getByRole("button", { name: "Step back" }));
    expect(screen.getByTestId("narration")).toHaveTextContent("Found the pair.");
    await user.click(screen.getByRole("button", { name: "Step back" }));
    expect(screen.getByTestId("narration")).toHaveTextContent("A[2] + A[3] = 10");
  });

  it("the broken example is rejected with a precise error instead of rendering", () => {
    const broken = STUDIO_EXAMPLES.find((e) => e.id === "broken")!.build();
    const result = validateTrace(broken);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.errors[0]).toMatch(/event #3: index 42 out of range for array "N"/);
  });

  it("renderers contain no algorithm-specific code", () => {
    const dir = join(process.cwd(), "src/ui/renderers");
    const ids = ALGORITHM_MODULES.map((m) => m.id);
    for (const file of readdirSync(dir)) {
      const source = readFileSync(join(dir, file), "utf8");
      for (const id of ids)
        expect(source.includes(`"${id}"`), `${file} mentions ${id}`).toBe(false);
      expect(source).not.toMatch(/@\/algorithms/);
    }
  });
});

describe("every registered algorithm renders at every structure kind it uses", () => {
  it.each(ALGORITHM_MODULES.map((m) => [m.id, m] as const))(
    "%s renders at start, middle and end",
    (_id, module) => {
      const { trace } = runAlgorithm(module, module.input.presets[0]!.value);
      const player = new TracePlayer(trace);
      for (const p of [0, Math.floor(player.length / 2), player.length]) {
        const state = player.stateAt(p);
        const { unmount } = render(
          <>
            {state.order.map((name) => (
              <StructurePanel
                key={name}
                name={name}
                structure={state.structures[name]!}
                focus={state.focus}
              />
            ))}
          </>,
        );
        expect(document.querySelectorAll("[data-structure]").length).toBe(state.order.length);
        unmount();
      }
    },
  );
});
