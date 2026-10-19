import type { Trace } from "./protocol";
import { applyEvent } from "./reduce";
import { cloneState, initialState, type TraceState } from "./state";

export interface PlayerOptions {
  /**
   * Events between stored keyframes. Seeking to any position costs at most
   * `keyframeInterval` event applications plus one state clone; memory holds
   * `events / keyframeInterval` snapshots. Default: max(16, ceil(sqrt(events))),
   * which balances the two (see docs/experiments/trace-reconstruction.md).
   */
  keyframeInterval?: number;
}

/**
 * Random-access reconstruction of trace states.
 *
 * Construction replays the whole trace once. That replay doubles as semantic
 * validation: an inconsistent trace throws a TraceReplayError here, before any UI
 * renders it. Positions run from 0 (initial state) to `length` (all events applied).
 *
 * States returned by `stateAt` are fresh copies; callers may hold or mutate them freely.
 */
export class TracePlayer {
  readonly length: number;
  readonly keyframeInterval: number;
  private readonly keyframes: TraceState[] = [];
  private cache: TraceState;

  constructor(
    readonly trace: Trace,
    options: PlayerOptions = {},
  ) {
    this.length = trace.events.length;
    this.keyframeInterval = Math.max(
      1,
      Math.floor(options.keyframeInterval ?? Math.max(16, Math.ceil(Math.sqrt(this.length)))),
    );

    const working = initialState(trace);
    this.keyframes.push(cloneState(working));
    trace.events.forEach((event, i) => {
      applyEvent(working, event, i);
      if ((i + 1) % this.keyframeInterval === 0) this.keyframes.push(cloneState(working));
    });
    this.cache = working;
  }

  /** Number of stored snapshots, exposed for measurement. */
  get keyframeCount(): number {
    return this.keyframes.length;
  }

  stateAt(position: number): TraceState {
    const target = Math.min(Math.max(0, Math.floor(position)), this.length);

    // Sequential forward playback reuses the last computed state: O(1) events per step.
    let base: TraceState;
    const keyframe = this.keyframes[Math.floor(target / this.keyframeInterval)]!;
    if (this.cache.position <= target && this.cache.position >= keyframe.position) {
      base = this.cache;
    } else {
      base = keyframe;
    }

    const state = cloneState(base);
    for (let i = state.position; i < target; i++) applyEvent(state, this.trace.events[i]!, i);
    this.cache = state;
    return cloneState(state);
  }

  finalState(): TraceState {
    return this.stateAt(this.length);
  }
}
