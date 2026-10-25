import type { MetaArg, TracedTimeline, Tracer } from "@/engine/tracer";
import type { EdgeStatus } from "@/engine/protocol";
import { createRng, type Rng } from "@/lib/random";

export interface Delivery<M> {
  kind: "message";
  id: string;
  from: string;
  to: string;
  msg: M;
  time: number;
  seq: number;
}

export interface Alarm {
  kind: "timer";
  node: string;
  tag: string;
  time: number;
  seq: number;
}

type Queued<M> = (Delivery<M> & { lost: boolean }) | Alarm;

/**
 * A deterministic discrete-event network for protocol visualizers. Every message gets
 * a random delay and may be lost, both drawn from a seeded generator when it is sent,
 * so a seed replays the same run. Events at the same time run in the order they were
 * scheduled. Messages and timers are drawn on a timeline as they happen.
 */
export class Simulation<M> {
  readonly rng: Rng;
  private readonly queue: Queued<M>[] = [];
  private seq = 0;
  /** The live alarm for each node:tag; re-arming replaces it, cancelling removes it. */
  private readonly timers = new Map<string, number>();

  constructor(
    private readonly t: Tracer,
    readonly T: TracedTimeline,
    private readonly options: {
      seed: number;
      lossPercent: number;
      minDelay: number;
      maxDelay: number;
    },
  ) {
    this.rng = createRng(options.seed);
  }

  get now(): number {
    return this.T.now;
  }

  send(from: string, to: string, msg: M, label: string, meta?: MetaArg): void {
    const id = this.T.send(from, to, label, meta);
    this.t.tally("messages");
    const lost = this.rng.next() * 100 < this.options.lossPercent;
    const delay = this.rng.int(this.options.minDelay, this.options.maxDelay);
    this.push({ kind: "message", id, from, to, msg, lost, time: this.now + delay, seq: 0 });
  }

  setTimer(node: string, tag: string, delay: number): void {
    const seq = this.push({ kind: "timer", node, tag, time: this.now + delay, seq: 0 });
    this.timers.set(`${node}:${tag}`, seq);
  }

  cancelTimer(node: string, tag: string): void {
    this.timers.delete(`${node}:${tag}`);
  }

  /**
   * The next delivery or alarm no later than `end`, with the clock moved to its time.
   * Lost messages are drawn as lost on the way and skipped. Returns null when nothing
   * is left before `end`.
   */
  next(end: number): Delivery<M> | Alarm | null {
    while (this.queue.length > 0 && this.queue[0]!.time <= end) {
      const item = this.queue.shift()!;
      if (item.kind === "timer") {
        const key = `${item.node}:${item.tag}`;
        if (this.timers.get(key) !== item.seq) continue;
        this.timers.delete(key);
        this.T.tick(item.time);
        return item;
      }
      this.T.tick(item.time);
      if (item.lost) {
        this.T.lose(item.id, { note: `A message from ${item.from} to ${item.to} is lost.` });
        continue;
      }
      const { lost: _lost, ...delivery } = item;
      return delivery;
    }
    return null;
  }

  deliver(item: Delivery<M>, status: EdgeStatus, meta?: MetaArg): void {
    this.T.deliver(item.id, status, meta);
  }

  /** The receiver is down: the message is lost on arrival. */
  drop(item: Delivery<M>, meta?: MetaArg): void {
    this.T.lose(item.id, meta);
  }

  private push(item: Queued<M>): number {
    item.seq = this.seq++;
    let lo = 0;
    let hi = this.queue.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const q = this.queue[mid]!;
      if (q.time < item.time || (q.time === item.time && q.seq < item.seq)) lo = mid + 1;
      else hi = mid;
    }
    this.queue.splice(lo, 0, item);
    return item.seq;
  }
}

/** Parse "label@time" items separated by commas, e.g. "X@0, Y@3". */
export function parseTimed(
  text: string,
  options: { what: string; max: number; maxTime: number; label: RegExp; labelHint: string },
): { ok: true; value: { label: string; time: number }[] } | { ok: false; errors: string[] } {
  const items = text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const errors: string[] = [];
  const value: { label: string; time: number }[] = [];
  for (const item of items) {
    const m = /^(.+?)\s*@\s*(\d+)$/.exec(item);
    if (!m) {
      errors.push(`"${item}" should look like ${options.labelHint}@time`);
      continue;
    }
    const [label, time] = [m[1]!, Number(m[2])];
    if (!options.label.test(label)) errors.push(`"${label}" is not a valid ${options.what}`);
    if (time > options.maxTime) errors.push(`${time} is after time ${options.maxTime}`);
    value.push({ label, time });
  }
  if (value.length === 0 && errors.length === 0) errors.push(`Give at least one ${options.what}`);
  if (value.length > options.max) errors.push(`Give at most ${options.max} ${options.what}s`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value };
}

export const majority = (n: number) => Math.floor(n / 2) + 1;

export const wholeIn = (text: string | undefined, min: number, max: number) => {
  const s = (text ?? "").trim();
  return /^\d+$/.test(s) && Number(s) >= min && Number(s) <= max ? Number(s) : null;
};
