import type { Metadata } from "next";
import Link from "next/link";
import { StudioClient } from "@/ui/StudioClient";
import { CODE_RUNNER_ENABLED } from "@/lib/features";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Visualize your own algorithm by importing a trace that follows the ALGORITHMA trace protocol.",
};

const SDK_EXAMPLE = `import { Tracer } from "@/engine/tracer";

const t = new Tracer({ id: "my/two-sum", version: 1 });
const A = t.array("A", [1, 3, 4, 6, 8, 11], { display: "cells" });
let lo = 0, hi = A.length - 1;
const target = 10;
while (lo < hi) {
  A.pointer("lo", lo);
  A.pointer("hi", hi);
  const sum = A.num(lo) + A.num(hi);
  t.step({ line: 3, vars: { lo, hi, sum }, note: \`A[lo] + A[hi] = \${sum}\` });
  if (sum === target) { A.mark([lo, hi], "found"); break; }
  if (sum < target) lo++; else hi--;
}
const trace = t.finish({ target }, null);
console.log(JSON.stringify(trace));   // paste the output here`;

export default function StudioPage() {
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Studio</p>
        <h1>Visualize your own algorithm</h1>
        <p>
          Any algorithm that describes its execution with the ALGORITHMA trace protocol (specified
          in <code>docs/trace-protocol.md</code>) gets the same visualizer as the built-in ones:
          arrays, graphs, queues and stacks, and tables, with pseudocode, variables, counters and
          backward stepping. Nothing in the renderers needs to change.
        </p>
      </header>
      <StudioClient />
      <section className="section prose">
        <h2>Producing a trace</h2>
        <p>
          Write your algorithm against the tracer SDK. Mutating data through the traced wrappers
          records each operation as it happens, so the trace cannot drift from what the code did:
        </p>
        <pre className="code">
          <code>{SDK_EXAMPLE}</code>
        </pre>
        <p>
          To add an algorithm to the encyclopedia itself, with input forms, tests and a lesson,
          follow the contributor guide in <code>docs/adding-an-algorithm.md</code>. See also the{" "}
          <Link href="/algorithms/binary-search">binary search</Link> visualizer, which uses the
          same pointer and mark operations as the example above.
        </p>
        <h2>Why the Studio takes traces, not code</h2>
        <p>
          Running code typed into a web page safely needs an isolation boundary. A browser sandbox
          for your own JavaScript has been built and tested against hostile programs (infinite
          loops, network access, memory exhaustion, output floods);{" "}
          {CODE_RUNNER_ENABLED
            ? "in this build you can use it from the Code tab of every algorithm."
            : "it is switched off in this build until it has had an independent security review."}{" "}
          The Studio itself accepts traces, which are data, not code: they are checked against size
          limits, a strict schema and a full replay before anything is drawn, so a malformed or
          malicious file is rejected with a precise error instead.
        </p>
      </section>
    </div>
  );
}
