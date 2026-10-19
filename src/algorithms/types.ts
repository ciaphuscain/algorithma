import type { Tracer } from "@/engine/tracer";
import type { TraceState } from "@/engine/state";
import type { Rng } from "@/lib/random";

export type ParseResult<T> = { ok: true; value: T } | { ok: false; errors: string[] };

/** One text field of an input form. Every input kind is edited as a few text fields. */
export interface InputField {
  name: string;
  label: string;
  placeholder?: string;
  help?: string;
  multiline?: boolean;
}

export interface InputPreset<I> {
  id: string;
  label: string;
  value: I;
}

/**
 * How an algorithm's input is edited, validated and generated. `parse` is the only
 * way user text becomes an input, so all size limits and constraints live there.
 */
export interface InputSpec<I> {
  fields: InputField[];
  parse(fields: Record<string, string>): ParseResult<I>;
  format(value: I): Record<string, string>;
  presets: InputPreset<I>[];
  /** Generate a random valid input. `size` is a hint, clamped to the spec's limits. */
  random(rng: Rng, size?: number): I;
  /** Human-readable summary of constraints, shown beside the form. */
  constraints: string;
}

/**
 * A traceable algorithm. Contributors implement this interface; nothing in the
 * engine or renderers changes when a new module is registered. See
 * docs/adding-an-algorithm.md.
 */
export interface AlgorithmModule<I = unknown, O = unknown> {
  id: string;
  /** Bump when the emitted trace changes shape or meaning (pseudocode lines, events). */
  version: number;
  /** Pseudocode lines; events refer to them by 1-based `line`. */
  pseudocode: string[];
  input: InputSpec<I>;
  /** Execute on a validated input, emitting events through the tracer. */
  run(input: I, tracer: Tracer): O;
  /**
   * Independent correctness oracle: return an error message if `output` is wrong for
   * `input`, otherwise null. Must not reuse the traced implementation.
   */
  check(input: I, output: O): string | null;
  /**
   * Confirm that the replayed final state shows the same answer as `output`.
   * Return an error message on mismatch, otherwise null.
   */
  fidelity(finalState: TraceState, output: O): string | null;
  /** Short description of the output for the result panel. */
  describeOutput(output: O): string;
}

/** Erase generics for registries that hold heterogeneous modules. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAlgorithmModule = AlgorithmModule<any, any>;
