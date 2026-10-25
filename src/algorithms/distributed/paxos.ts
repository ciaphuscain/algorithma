import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { majority, parseTimed, Simulation, wholeIn } from "./sim";

export interface PaxosInput {
  acceptors: number;
  /** Each proposer's value and the time it starts. */
  proposals: { value: string; start: number }[];
  /** Chance (percent) that any one message is lost. */
  loss: number;
  seed: number;
}

export interface PaxosOutput {
  /** The value the first proposer to finish learned was chosen, or null. */
  chosen: string | null;
  decisions: { proposer: number; ballot: number; value: string; time: number }[];
  /** Every accept by every acceptor, in order: the history the checker inspects. */
  accepts: { acceptor: number; ballot: number; value: string; time: number }[];
  /** Prepare rounds started, over all proposers. */
  rounds: number;
}

type Msg =
  | { type: "prepare"; n: number }
  | { type: "promise"; n: number; accepted: { n: number; v: string } | null }
  | { type: "accept"; n: number; v: string }
  | { type: "accepted"; n: number; v: string }
  | { type: "nack"; n: number; promised: number };

const END = 120;
const MAX_PROPOSERS = 3;
const RETRY = 9;

const input: InputSpec<PaxosInput> = {
  fields: [
    { name: "acceptors", label: "Acceptors", placeholder: "3 or 5" },
    {
      name: "proposals",
      label: "Proposals (value@start time)",
      placeholder: "e.g. X@0, Y@2",
      help: "One proposer per item; values are short words.",
    },
    { name: "loss", label: "Message loss (%)", placeholder: "e.g. 0" },
    { name: "seed", label: "Random seed", placeholder: "e.g. 1" },
  ],
  constraints: `3 or 5 acceptors; 1–${MAX_PROPOSERS} proposals, each a word of up to 8 letters or digits starting at a time from 0 to 60; loss 0–40%; seed 0–999999. Messages take 1–3 time units; the run stops at time ${END}.`,
  parse(fields) {
    const errors: string[] = [];
    const acceptors = wholeIn(fields.acceptors, 3, 5);
    if (acceptors === null || acceptors === 4) errors.push("Acceptors must be 3 or 5");
    const proposals = parseTimed(fields.proposals ?? "", {
      what: "proposal",
      max: MAX_PROPOSERS,
      maxTime: 60,
      label: /^[A-Za-z0-9]{1,8}$/,
      labelHint: "value",
    });
    if (!proposals.ok) errors.push(...proposals.errors);
    const loss = wholeIn(fields.loss, 0, 40);
    if (loss === null) errors.push("Message loss must be a whole number from 0 to 40");
    const seed = wholeIn(fields.seed, 0, 999_999);
    if (seed === null) errors.push("The seed must be a whole number from 0 to 999999");
    if (errors.length || !proposals.ok) return { ok: false, errors };
    return {
      ok: true,
      value: {
        acceptors: acceptors!,
        proposals: proposals.value.map((p) => ({ value: p.label, start: p.time })),
        loss: loss!,
        seed: seed!,
      },
    };
  },
  format: (v) => ({
    acceptors: String(v.acceptors),
    proposals: v.proposals.map((p) => `${p.value}@${p.start}`).join(", "),
    loss: String(v.loss),
    seed: String(v.seed),
  }),
  presets: [
    {
      id: "classic",
      label: "One proposer, three acceptors",
      value: { acceptors: 3, proposals: [{ value: "X", start: 0 }], loss: 0, seed: 1 },
    },
    {
      id: "duel",
      label: "Two proposers race",
      value: {
        acceptors: 3,
        proposals: [
          { value: "X", start: 0 },
          { value: "Y", start: 2 },
        ],
        loss: 0,
        seed: 3,
      },
    },
    {
      id: "lossy",
      label: "Five acceptors, 20% of messages lost",
      value: {
        acceptors: 5,
        proposals: [
          { value: "X", start: 0 },
          { value: "Y", start: 4 },
        ],
        loss: 20,
        seed: 5,
      },
    },
  ],
  random(rng) {
    const k = rng.int(1, MAX_PROPOSERS);
    return {
      acceptors: rng.int(0, 1) ? 5 : 3,
      proposals: Array.from({ length: k }, (_, i) => ({
        value: ["X", "Y", "Z"][i]!,
        start: rng.int(0, 10),
      })),
      loss: rng.int(0, 3) === 0 ? rng.int(5, 30) : 0,
      seed: rng.int(0, 999_999),
    };
  },
};

/**
 * Single-decree Paxos: proposers run numbered ballots in two phases. Phase 1
 * (prepare/promise) asks a majority of acceptors to ignore lower ballots and report
 * what they have accepted; phase 2 (accept/accepted) proposes the value of the highest
 * ballot reported, or the proposer's own value if none. A value is chosen once a
 * majority accepts it in one ballot, and every later ballot can only propose it.
 */
export const paxos: AlgorithmModule<PaxosInput, PaxosOutput> = {
  id: "paxos",
  version: 1,
  pseudocode: [
    "proposer: n ← a ballot number higher than any it has used; send prepare(n) to all acceptors",
    "acceptor on prepare(n): if n > promised: promised ← n; reply promise(n, accepted)  else reply nack",
    "proposer on promises from a majority: v ← value of the highest-numbered accepted (n′, v′) reported, else its own",
    "  send accept(n, v) to all acceptors",
    "acceptor on accept(n, v): if n ≥ promised: promised ← n; accepted ← (n, v); reply accepted(n, v)  else nack",
    "proposer on accepted(n, v) from a majority: v is chosen",
    "on a nack or a timeout: wait a random time, then start again with a higher ballot",
  ],
  input,

  run(input, t) {
    const { acceptors: na, proposals } = input;
    const k = proposals.length;
    const need = majority(na);
    const P = (i: number) => `P${i + 1}`;
    const A = (j: number) => `A${j + 1}`;
    const T = t.timeline("T", {
      label: "Proposers and acceptors",
      horizon: 20,
      lanes: [
        ...proposals.map((p, i) => ({ id: P(i), label: `${P(i)} (wants ${p.value})` })),
        ...Array.from({ length: na }, (_, j) => ({ id: A(j) })),
      ],
    });
    const G = t.grid("G", na, 3, null, {
      label: "Acceptor state",
      rowHeaders: Array.from({ length: na }, (_, j) => A(j)),
      colHeaders: ["promised", "accepted ballot", "accepted value"],
    });
    const sim = new Simulation<Msg>(t, T, {
      seed: input.seed,
      lossPercent: input.loss,
      minDelay: 1,
      maxDelay: 3,
    });
    const acc = Array.from({ length: na }, () => ({
      promised: 0,
      accepted: null as { n: number; v: string } | null,
    }));
    const prop = proposals.map((p) => ({
      own: p.value,
      round: 0,
      ballot: 0,
      phase: "idle" as "idle" | "prepare" | "accept" | "done",
      promises: new Map<number, { n: number; v: string } | null>(),
      accepted: new Set<number>(),
      value: p.value,
    }));
    const accepts: PaxosOutput["accepts"] = [];
    const decisions: PaxosOutput["decisions"] = [];
    let rounds = 0;
    for (let i = 0; i < k; i++) sim.setTimer(P(i), "start", proposals[i]!.start);

    const startRound = (i: number) => {
      const p = prop[i]!;
      p.round++;
      p.ballot = p.round * k + i + 1;
      p.phase = "prepare";
      p.promises.clear();
      p.accepted.clear();
      rounds++;
      t.tally("ballots");
      T.lane(P(i), "current", { line: 1, vars: { ballot: p.ballot } });
      T.annotate(P(i), `ballot ${p.ballot}: preparing`);
      for (let j = 0; j < na; j++)
        sim.send(P(i), A(j), { type: "prepare", n: p.ballot }, `prepare ${p.ballot}`, {
          line: 1,
        });
      sim.setTimer(P(i), "retry", RETRY);
    };
    const backOff = (i: number, why: string) => {
      const p = prop[i]!;
      p.phase = "idle";
      T.lane(P(i), "frontier", { line: 7, note: `${P(i)} gives up ballot ${p.ballot}: ${why}.` });
      T.annotate(P(i), `waiting to retry`);
      sim.setTimer(P(i), "retry", sim.rng.int(2, 6));
    };

    for (let ev = sim.next(END); ev; ev = sim.next(END)) {
      if (ev.kind === "timer") {
        const i = Number(ev.node.slice(1)) - 1;
        const p = prop[i]!;
        if (p.phase === "done") continue;
        if (ev.tag === "start") startRound(i);
        else if (p.phase === "idle") startRound(i);
        else backOff(i, "no majority answered in time");
        continue;
      }
      const msg = ev.msg;
      if (ev.to.startsWith("A")) {
        const j = Number(ev.to.slice(1)) - 1;
        const a = acc[j]!;
        const i = Number(ev.from.slice(1)) - 1;
        if (msg.type === "prepare") {
          if (msg.n > a.promised) {
            a.promised = msg.n;
            sim.deliver(ev, "tree", { line: 2 });
            G.write(j, 0, msg.n, { line: 2 });
            const rep = a.accepted ? ` (${a.accepted.n}, ${a.accepted.v})` : "";
            sim.send(
              A(j),
              P(i),
              { type: "promise", n: msg.n, accepted: a.accepted },
              `promise ${msg.n}${rep}`,
              {
                line: 2,
                note: `${A(j)} promises to ignore ballots below ${msg.n}${a.accepted ? ` and reports it accepted ${a.accepted.v} in ballot ${a.accepted.n}` : ""}.`,
              },
            );
          } else {
            sim.deliver(ev, "rejected", { line: 2 });
            sim.send(
              A(j),
              P(i),
              { type: "nack", n: msg.n, promised: a.promised },
              `nack (promised ${a.promised})`,
              {
                line: 2,
                note: `${A(j)} has already promised ballot ${a.promised} ≥ ${msg.n}.`,
              },
            );
          }
        } else if (msg.type === "accept") {
          if (msg.n >= a.promised) {
            a.promised = msg.n;
            a.accepted = { n: msg.n, v: msg.v };
            accepts.push({ acceptor: j, ballot: msg.n, value: msg.v, time: sim.now });
            t.tally("accepts");
            sim.deliver(ev, "relaxed", { line: 5 });
            G.write(j, 0, msg.n);
            G.write(j, 1, msg.n);
            G.write(j, 2, msg.v, { line: 5 });
            sim.send(
              A(j),
              P(i),
              { type: "accepted", n: msg.n, v: msg.v },
              `accepted ${msg.n}, ${msg.v}`,
              {
                line: 5,
                note: `${A(j)} accepts ${msg.v} in ballot ${msg.n}.`,
              },
            );
          } else {
            sim.deliver(ev, "rejected", { line: 5 });
            sim.send(
              A(j),
              P(i),
              { type: "nack", n: msg.n, promised: a.promised },
              `nack (promised ${a.promised})`,
              {
                line: 5,
                note: `${A(j)} refuses: it promised ballot ${a.promised} > ${msg.n}.`,
              },
            );
          }
        }
        continue;
      }
      // A reply reaches a proposer.
      const i = Number(ev.to.slice(1)) - 1;
      const j = Number(ev.from.slice(1)) - 1;
      const p = prop[i]!;
      const current = "n" in msg && msg.n === p.ballot;
      if (!current || p.phase === "done" || p.phase === "idle") {
        sim.deliver(ev, "back", { note: `${P(i)} ignores a reply to an old ballot.` });
        continue;
      }
      if (msg.type === "nack") {
        sim.deliver(ev, "rejected", { line: 7 });
        backOff(i, `${A(j)} promised ballot ${msg.promised}`);
        // Never reuse a ballot below what some acceptor has promised.
        while (p.round * k + i + 1 <= msg.promised) p.round++;
        continue;
      }
      if (msg.type === "promise" && p.phase === "prepare") {
        p.promises.set(j, msg.accepted);
        sim.deliver(ev, "back", { line: 3, vars: { promises: p.promises.size } });
        if (p.promises.size === need) {
          let best: { n: number; v: string } | null = null;
          for (const rep of p.promises.values()) if (rep && (!best || rep.n > best.n)) best = rep;
          p.value = best ? best.v : p.own;
          p.phase = "accept";
          T.annotate(P(i), `ballot ${p.ballot}: proposing ${p.value}`);
          t.step({
            line: 3,
            note: best
              ? `A majority promised. The highest accepted ballot reported is ${best.n} with ${best.v}, so ${P(i)} must propose ${best.v}.`
              : `A majority promised and none had accepted anything, so ${P(i)} proposes its own value ${p.own}.`,
          });
          for (let a2 = 0; a2 < na; a2++)
            sim.send(
              P(i),
              A(a2),
              { type: "accept", n: p.ballot, v: p.value },
              `accept ${p.ballot}, ${p.value}`,
              {
                line: 4,
              },
            );
          sim.setTimer(P(i), "retry", RETRY);
        }
        continue;
      }
      if (msg.type === "accepted" && p.phase === "accept") {
        p.accepted.add(j);
        sim.deliver(ev, "back", { line: 6, vars: { accepted: p.accepted.size } });
        if (p.accepted.size === need) {
          p.phase = "done";
          sim.cancelTimer(P(i), "retry");
          decisions.push({ proposer: i, ballot: p.ballot, value: p.value, time: sim.now });
          T.lane(P(i), "path", { line: 6 });
          T.annotate(P(i), `learned: ${p.value} is chosen`);
          T.mark(P(i), `chosen ${p.value}`, {
            line: 6,
            note: `A majority accepted ${p.value} in ballot ${p.ballot}: ${p.value} is chosen.`,
          });
        }
        continue;
      }
      sim.deliver(ev, "back");
    }
    const output: PaxosOutput = {
      chosen: decisions[0]?.value ?? null,
      decisions,
      accepts,
      rounds,
    };
    t.finish(input, output, {
      line: 6,
      vars: { ballot: null, promises: null, accepted: null },
      note: decisions.length
        ? `Chosen: ${decisions[0]!.value}. ${decisions.length} of ${k} proposer${k === 1 ? "" : "s"} learned it.`
        : `No value was chosen by time ${END}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent safety checker over the acceptors' history.
    const need = majority(input.acceptors);
    const votes = new Map<string, Set<number>>();
    for (const a of out.accepts) {
      const key = `${a.ballot}|${a.value}`;
      votes.set(key, (votes.get(key) ?? new Set()).add(a.acceptor));
    }
    const chosen = [...votes].filter(([, s]) => s.size >= need).map(([key]) => key.split("|"));
    const values = new Set(chosen.map(([, v]) => v));
    if (values.size > 1) return `two values were chosen: ${[...values].join(", ")}`;
    const proposed = new Set(input.proposals.map((p) => p.value));
    for (const v of values) if (!proposed.has(v!)) return `${v} was never proposed`;
    // Once v is chosen at ballot b, no acceptor accepts anything else at a higher ballot.
    if (chosen.length) {
      const first = Math.min(...chosen.map(([b]) => Number(b)));
      const v = chosen[0]![1];
      const bad = out.accepts.find((a) => a.ballot >= first && a.value !== v);
      if (bad) return `acceptor ${bad.acceptor + 1} accepted ${bad.value} at ballot ${bad.ballot}`;
    }
    // An acceptor's accepted ballots only increase.
    for (let j = 0; j < input.acceptors; j++) {
      const mine = out.accepts.filter((a) => a.acceptor === j).map((a) => a.ballot);
      if (mine.some((b, i) => i > 0 && b <= mine[i - 1]!)) return `acceptor ${j + 1} went back`;
    }
    for (const d of out.decisions) {
      if (!values.has(d.value))
        return `proposer ${d.proposer + 1} learned ${d.value}, which was not chosen`;
      if ((votes.get(`${d.ballot}|${d.value}`)?.size ?? 0) < need)
        return `proposer ${d.proposer + 1} learned without a majority`;
    }
    if (out.chosen !== (out.decisions[0]?.value ?? null))
      return "chosen differs from the first decision";
    // With no losses a lone proposer always succeeds.
    if (
      input.loss === 0 &&
      input.proposals.length === 1 &&
      out.chosen !== input.proposals[0]!.value
    )
      return "a lone proposer on a reliable network failed";
    return null;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "timeline") return "no timeline";
    const marks = T.marks.map((m) => m.label);
    const want = out.decisions.map((d) => `chosen ${d.value}`);
    return JSON.stringify(marks) === JSON.stringify(want) ? null : `marks ${marks}`;
  },

  describeOutput: (out) =>
    out.chosen === null
      ? `Nothing chosen (${out.rounds} ballots)`
      : `Chosen: ${out.chosen} (${out.rounds} ballot${out.rounds === 1 ? "" : "s"}, ${out.decisions.length} proposer${out.decisions.length === 1 ? "" : "s"} learned it)`,
};
