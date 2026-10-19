import type { FocusTone, Scalar, Structure, Trace, VarValue } from "./protocol";

/** Transient emphasis produced by the most recent event; cleared before the next one applies. */
export interface Focus {
  s: string;
  tone: FocusTone;
  indices?: number[];
  nodes?: string[];
  edges?: string[];
  cells?: [number, number][];
  /** For array comparisons against a value that is not in the array (e.g. a search target). */
  value?: Scalar;
}

/**
 * The fully reconstructed visual state at one trace position.
 * `position` is the number of events applied (0 = initial state).
 */
export interface TraceState {
  position: number;
  structures: Record<string, Structure>;
  order: string[];
  vars: Record<string, VarValue>;
  line: number | null;
  note: string | null;
  focus: Focus[];
  counters: Record<string, number>;
  done: boolean;
}

export function initialState(trace: Pick<Trace, "initial">): TraceState {
  return {
    position: 0,
    structures: structuredClone(trace.initial.structures),
    order: [...trace.initial.order],
    vars: structuredClone(trace.initial.vars),
    line: null,
    note: null,
    focus: [],
    counters: { comparisons: 0, swaps: 0, reads: 0, writes: 0 },
    done: false,
  };
}

export function cloneState(state: TraceState): TraceState {
  return structuredClone(state);
}
