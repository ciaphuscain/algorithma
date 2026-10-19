import { Tracer, type TracerOptions } from "@/engine/tracer";
import type { Trace } from "@/engine/protocol";
import type { AlgorithmModule } from "./types";

export interface RunResult<O> {
  output: O;
  trace: Trace;
}

/** Execute a module on an already-validated input and return its output and trace. */
export function runAlgorithm<I, O>(
  module: AlgorithmModule<I, O>,
  input: I,
  options: TracerOptions = {},
): RunResult<O> {
  const tracer = new Tracer({ id: module.id, version: module.version }, options);
  const output = module.run(input, tracer);
  // Modules normally call finish() themselves to attach closing narration.
  const trace = tracer.trace ?? tracer.finish(input, output);
  return { output, trace };
}
