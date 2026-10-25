import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { majority, parseTimed, Simulation, wholeIn } from "./sim";

export interface RaftInput {
  servers: number;
  /** Client commands and when they arrive. */
  commands: { cmd: string; time: number }[];
  /** Servers that go down at `from` and restart at `to` (at most three). */
  crashes: { server: number; from: number; to: number }[];
  loss: number;
  seed: number;
}

export interface RaftOutput {
  /** Every election won: the term, the winner, when, and its log at that moment. */
  leaders: { term: number; server: number; time: number; log: string[] }[];
  /** Final logs, entries written "term:command". */
  logs: string[][];
  commitIndex: number[];
  /** Every advance of a server's commit index, entry by entry. */
  commits: { server: number; index: number; entry: string; time: number }[];
}

interface Entry {
  term: number;
  cmd: string;
}

type Msg =
  | { type: "vote"; term: number; lastIndex: number; lastTerm: number }
  | { type: "voteReply"; term: number; granted: boolean }
  | {
      type: "append";
      term: number;
      prev: number;
      prevTerm: number;
      entries: Entry[];
      commit: number;
    }
  | { type: "appendReply"; term: number; ok: boolean; match: number };

const HEARTBEAT = 4;
const ELECTION = 12;
const MAX_COMMANDS = 6;
const MAX_CRASHES = 3;
const show = (e: Entry) => `${e.term}:${e.cmd}`;

const input: InputSpec<RaftInput> = {
  fields: [
    { name: "servers", label: "Servers", placeholder: "3 or 5" },
    {
      name: "commands",
      label: "Client commands (command@time)",
      placeholder: "e.g. x=1@20, y=2@30",
    },
    {
      name: "crashes",
      label: "Crashes (server@from-to, optional)",
      placeholder: "e.g. 1@40-70, 3@80-100",
      help: "Each server stops at the first time and restarts at the second.",
    },
    { name: "loss", label: "Message loss (%)", placeholder: "e.g. 0" },
    { name: "seed", label: "Random seed", placeholder: "e.g. 1" },
  ],
  constraints: `3 or 5 servers; 1–${MAX_COMMANDS} commands (letters, digits, = + -) at times from 0 to 80; up to ${MAX_CRASHES} crashes between times 0 and 100 (one server's crashes may not overlap); loss 0–30%; seed 0–999999. Messages take 1–3 time units; heartbeats every ${HEARTBEAT}; election timeouts are random between ${ELECTION} and ${2 * ELECTION}.`,
  parse(fields) {
    const errors: string[] = [];
    const servers = wholeIn(fields.servers, 3, 5);
    if (servers === null || servers === 4) errors.push("Servers must be 3 or 5");
    const commands = parseTimed(fields.commands ?? "", {
      what: "command",
      max: MAX_COMMANDS,
      maxTime: 80,
      label: /^[A-Za-z0-9=+-]{1,6}$/,
      labelHint: "command",
    });
    if (!commands.ok) errors.push(...commands.errors);
    const crashes: RaftInput["crashes"] = [];
    const items = (fields.crashes ?? "")
      .split(/[,;\n]+/)
      .map((x) => x.trim())
      .filter(Boolean);
    if (items.length > MAX_CRASHES) errors.push(`Give at most ${MAX_CRASHES} crashes`);
    for (const item of items) {
      const m = /^S?(\d+)\s*@\s*(\d+)\s*-\s*(\d+)$/i.exec(item);
      if (!m) {
        errors.push(`Write each crash as server@from-to, e.g. "1@40-70" (not "${item}")`);
        continue;
      }
      const [server, from, to] = [Number(m[1]), Number(m[2]), Number(m[3])];
      if (servers !== null && (server < 1 || server > servers))
        errors.push(`The crashed server must be from 1 to ${servers}`);
      if (!(from < to) || to > 100) errors.push("Each crash needs from < to ≤ 100");
      const clash = crashes.find((c) => c.server === server - 1 && from <= c.to && c.from <= to);
      if (clash) errors.push(`Server ${server}'s crashes overlap`);
      crashes.push({ server: server - 1, from, to });
    }
    const loss = wholeIn(fields.loss, 0, 30);
    if (loss === null) errors.push("Message loss must be a whole number from 0 to 30");
    const seed = wholeIn(fields.seed, 0, 999_999);
    if (seed === null) errors.push("The seed must be a whole number from 0 to 999999");
    if (errors.length || !commands.ok) return { ok: false, errors };
    return {
      ok: true,
      value: {
        servers: servers!,
        commands: commands.value.map((c) => ({ cmd: c.label, time: c.time })),
        crashes,
        loss: loss!,
        seed: seed!,
      },
    };
  },
  format: (v) => ({
    servers: String(v.servers),
    commands: v.commands.map((c) => `${c.cmd}@${c.time}`).join(", "),
    crashes: v.crashes.map((c) => `${c.server + 1}@${c.from}-${c.to}`).join(", "),
    loss: String(v.loss),
    seed: String(v.seed),
  }),
  presets: [
    {
      id: "classic",
      label: "Elect a leader, replicate two commands",
      value: {
        servers: 3,
        commands: [
          { cmd: "x=1", time: 30 },
          { cmd: "y=2", time: 38 },
        ],
        crashes: [],
        loss: 0,
        seed: 1,
      },
    },
    {
      id: "failover",
      label: "The leader crashes and a new one takes over",
      value: {
        servers: 5,
        commands: [
          { cmd: "x=1", time: 30 },
          { cmd: "y=2", time: 70 },
        ],
        crashes: [{ server: 2, from: 40, to: 90 }],
        loss: 0,
        seed: 2,
      },
    },
    {
      id: "overwrite",
      label: "Uncommitted entries are overwritten by a later leader",
      value: {
        servers: 3,
        commands: ["c1", "c2", "c3", "c4", "c5", "c6"].map((cmd, i) => ({
          cmd,
          time: [21, 25, 28, 31, 34, 37][i]!,
        })),
        crashes: [{ server: 2, from: 29, to: 46 }],
        loss: 27,
        seed: 216195,
      },
    },
    {
      id: "figure8",
      label: "Why a leader never commits an older term's entries by counting copies",
      value: {
        servers: 3,
        commands: ["c1", "c2", "c3", "c4"].map((cmd, i) => ({ cmd, time: [22, 26, 33, 42][i]! })),
        crashes: [
          { server: 0, from: 71, to: 88 },
          { server: 1, from: 65, to: 83 },
          { server: 0, from: 24, to: 41 },
        ],
        loss: 22,
        seed: 838040,
      },
    },
    {
      id: "lossy",
      label: "10% of messages lost",
      value: {
        servers: 5,
        commands: [
          { cmd: "a", time: 30 },
          { cmd: "b", time: 40 },
          { cmd: "c", time: 50 },
        ],
        crashes: [],
        loss: 10,
        seed: 4,
      },
    },
  ],
  random(rng) {
    const n = rng.int(0, 1) ? 5 : 3;
    const k = rng.int(1, 4);
    const crashes: RaftInput["crashes"] = [];
    for (let c = rng.int(0, 2); c > 0; c--) {
      const server = rng.int(0, n - 1);
      const from = rng.int(20, 70);
      const to = Math.min(100, from + rng.int(8, 35));
      if (!crashes.some((x) => x.server === server && from <= x.to && x.from <= to))
        crashes.push({ server, from, to });
    }
    return {
      servers: n,
      commands: Array.from({ length: k }, (_, i) => ({
        cmd: `c${i + 1}`,
        time: 25 + 10 * i + rng.int(0, 5),
      })),
      crashes,
      loss: rng.int(0, 2) === 0 ? rng.int(5, 20) : 0,
      seed: rng.int(0, 999_999),
    };
  },
};

/**
 * Raft: servers elect a leader with randomized timeouts (a candidate needs votes from
 * a majority, and voters refuse candidates whose logs are behind theirs). The leader
 * appends client commands to its log and replicates them with AppendEntries, which
 * also act as heartbeats; an entry is committed once a majority stores it and it
 * belongs to the leader's current term.
 */
export const raft: AlgorithmModule<RaftInput, RaftOutput> = {
  id: "raft",
  version: 2,
  pseudocode: [
    "on election timeout: term += 1; become candidate; vote for self; send RequestVote(term, last log index and term)",
    "on RequestVote: grant if the term is current, no other vote this term, and the candidate's log is at least as up to date",
    "candidate with votes from a majority: become leader; send AppendEntries (heartbeats) every few time units",
    "leader on a client command: append (term, command) to its log",
    "on AppendEntries: if the log matches at prev, keep the new entries (dropping conflicts), follow the leader's commit index",
    "leader: commit index N once a majority stores entry N and its term is the current term",
    "on any message with a higher term: adopt the term and become a follower",
  ],
  input,

  run(input, t) {
    const n = input.servers;
    const need = majority(n);
    const S = (i: number) => `S${i + 1}`;
    const cmds = [...input.commands].sort((a, b) => a.time - b.time);
    const lastEvent = Math.max(cmds[cmds.length - 1]!.time, ...input.crashes.map((c) => c.to));
    const END = Math.min(150, Math.max(60, lastEvent + 40));
    const T = t.timeline("T", {
      label: "Servers",
      horizon: END,
      lanes: Array.from({ length: n }, (_, i) => ({ id: S(i) })),
    });
    const width = Math.max(1, cmds.length);
    const L = t.grid("L", n, width, null, {
      label: "Logs (term:command); committed entries marked",
      rowHeaders: Array.from({ length: n }, (_, i) => S(i)),
      colHeaders: Array.from({ length: width }, (_, i) => String(i + 1)),
    });
    const sim = new Simulation<Msg>(t, T, {
      seed: input.seed,
      lossPercent: input.loss,
      minDelay: 1,
      maxDelay: 3,
    });
    const srv = Array.from({ length: n }, () => ({
      term: 0,
      votedFor: null as number | null,
      log: [] as Entry[],
      commit: 0,
      role: "follower" as "follower" | "candidate" | "leader",
      votes: new Set<number>(),
      next: new Array<number>(n).fill(1),
      match: new Array<number>(n).fill(0),
      up: true,
      shown: [] as (string | null)[],
      shownCommit: 0,
    }));
    const leaders: RaftOutput["leaders"] = [];
    const commits: RaftOutput["commits"] = [];
    const STATUS = { follower: "unvisited", candidate: "frontier", leader: "current" } as const;

    const label = (i: number) => {
      const s = srv[i]!;
      if (!s.up) return;
      T.lane(S(i), STATUS[s.role]);
      T.annotate(S(i), `${s.role} · term ${s.term}`);
    };
    const drawLog = (i: number) => {
      const s = srv[i]!;
      for (let k = 0; k < width; k++) {
        const v = k < s.log.length ? show(s.log[k]!) : null;
        if (s.shown[k] !== v && (s.shown[k] !== undefined || v !== null)) {
          L.write(i, k, v, { line: 5 });
          s.shown[k] = v;
        }
      }
      const c = Math.min(s.commit, width);
      if (c !== s.shownCommit) {
        const lo = Math.min(c, s.shownCommit);
        const hi = Math.max(c, s.shownCommit);
        const cells = Array.from({ length: hi - lo }, (_, k): [number, number] => [i, lo + k]);
        L.mark(cells, c > s.shownCommit ? "path" : null, { line: 6 });
        s.shownCommit = c;
      }
    };
    const setCommit = (i: number, c: number) => {
      const s = srv[i]!;
      for (let k = s.commit + 1; k <= c; k++)
        commits.push({ server: i, index: k, entry: show(s.log[k - 1]!), time: sim.now });
      if (c > s.commit) {
        s.commit = c;
        drawLog(i);
      }
    };
    const electionTimer = (i: number) =>
      sim.setTimer(S(i), "election", sim.rng.int(ELECTION, 2 * ELECTION));
    const stepDown = (i: number, term: number) => {
      const s = srv[i]!;
      const wasLeader = s.role === "leader";
      if (term > s.term) {
        s.term = term;
        s.votedFor = null;
      }
      s.role = "follower";
      if (wasLeader) {
        sim.cancelTimer(S(i), "heartbeat");
        electionTimer(i);
      }
      label(i);
    };
    const sendAppend = (i: number, f: number) => {
      const s = srv[i]!;
      const prev = s.next[f]! - 1;
      const entries = s.log.slice(prev);
      sim.send(
        S(i),
        S(f),
        {
          type: "append",
          term: s.term,
          prev,
          prevTerm: prev > 0 ? s.log[prev - 1]!.term : 0,
          entries,
          commit: s.commit,
        },
        entries.length ? `append ${entries.map((e) => e.cmd).join(" ")}` : "heartbeat",
        { line: entries.length ? 5 : 3 },
      );
    };
    const advanceCommit = (i: number) => {
      const s = srv[i]!;
      for (let N = s.log.length; N > s.commit; N--) {
        if (s.log[N - 1]!.term !== s.term) break;
        const stored = s.match.filter((m, f) => (f === i ? s.log.length : m) >= N).length;
        if (stored >= need) {
          const newly = N - s.commit;
          setCommit(i, N);
          T.mark(S(i), `commit ${N}`, {
            line: 6,
            note: `${S(i)} commits up to entry ${N}: a majority (${stored} of ${n}) store it${newly > 1 ? ` (${newly} entries at once)` : ""}.`,
          });
          return;
        }
      }
    };

    for (let i = 0; i < n; i++) {
      label(i);
      electionTimer(i);
    }
    cmds.forEach((c, k) => sim.setTimer("client", `c${k}`, c.time));
    input.crashes.forEach((c, k) => {
      sim.setTimer(S(c.server), `crash${k}`, c.from);
      sim.setTimer(S(c.server), `restart${k}`, c.to);
    });

    for (let ev = sim.next(END); ev; ev = sim.next(END)) {
      if (ev.kind === "timer") {
        if (ev.node === "client") {
          const k = Number(ev.tag.slice(1));
          const c = cmds[k]!;
          let leader = -1;
          srv.forEach((s, i) => {
            if (s.up && s.role === "leader" && (leader === -1 || s.term > srv[leader]!.term))
              leader = i;
          });
          if (leader === -1) {
            sim.setTimer("client", ev.tag, 2);
            t.step({ line: 4, note: `No leader yet: the client will retry ${c.cmd} shortly.` });
            continue;
          }
          const s = srv[leader]!;
          s.log.push({ term: s.term, cmd: c.cmd });
          s.match[leader] = s.log.length;
          drawLog(leader);
          T.mark(S(leader), `client: ${c.cmd}`, {
            line: 4,
            note: `The client sends ${c.cmd} to the leader ${S(leader)}, which appends it at index ${s.log.length} in term ${s.term}.`,
          });
          for (let f = 0; f < n; f++) if (f !== leader) sendAppend(leader, f);
          continue;
        }
        const i = Number(ev.node.slice(1)) - 1;
        const s = srv[i]!;
        if (ev.tag.startsWith("crash")) {
          s.up = false;
          sim.cancelTimer(S(i), "election");
          sim.cancelTimer(S(i), "heartbeat");
          T.lane(S(i), "unreachable", {
            note: `${S(i)} crashes. It keeps its term, vote and log on disk.`,
          });
          T.annotate(S(i), "down");
          continue;
        }
        if (ev.tag.startsWith("restart")) {
          s.up = true;
          s.role = "follower";
          s.commit = 0; // volatile: relearned from the next leader
          drawLog(i);
          label(i);
          T.mark(S(i), "restart", { note: `${S(i)} restarts as a follower in term ${s.term}.` });
          electionTimer(i);
          continue;
        }
        if (!s.up) continue;
        if (ev.tag === "heartbeat" && s.role === "leader") {
          for (let f = 0; f < n; f++) if (f !== i) sendAppend(i, f);
          sim.setTimer(S(i), "heartbeat", HEARTBEAT);
          continue;
        }
        if (ev.tag === "election" && s.role !== "leader") {
          s.term++;
          s.role = "candidate";
          s.votedFor = i;
          s.votes = new Set([i]);
          t.tally("elections");
          label(i);
          const lastIndex = s.log.length;
          const lastTerm = lastIndex ? s.log[lastIndex - 1]!.term : 0;
          t.step({
            line: 1,
            vars: { term: s.term },
            note: `${S(i)} hears nothing from a leader before its timeout: it becomes a candidate for term ${s.term}.`,
          });
          for (let f = 0; f < n; f++)
            if (f !== i)
              sim.send(
                S(i),
                S(f),
                { type: "vote", term: s.term, lastIndex, lastTerm },
                `vote? t${s.term}`,
                { line: 1 },
              );
          electionTimer(i);
        }
        continue;
      }

      const i = Number(ev.to.slice(1)) - 1;
      const from = Number(ev.from.slice(1)) - 1;
      const s = srv[i]!;
      const m = ev.msg;
      if (!s.up) {
        sim.drop(ev, { note: `${S(i)} is down; the message is lost.` });
        continue;
      }
      if (m.term > s.term) stepDown(i, m.term);
      if (m.type === "vote") {
        const lastIndex = s.log.length;
        const lastTerm = lastIndex ? s.log[lastIndex - 1]!.term : 0;
        const upToDate =
          m.lastTerm > lastTerm || (m.lastTerm === lastTerm && m.lastIndex >= lastIndex);
        const grant = m.term === s.term && (s.votedFor === null || s.votedFor === from) && upToDate;
        if (grant) {
          s.votedFor = from;
          electionTimer(i);
        }
        sim.deliver(ev, grant ? "tree" : "rejected", {
          line: 2,
          note: grant
            ? `${S(i)} votes for ${S(from)} in term ${m.term}.`
            : `${S(i)} refuses ${S(from)}: ${m.term < s.term ? "its term is old" : !upToDate ? "its log is behind" : "it already voted this term"}.`,
        });
        sim.send(
          S(i),
          S(from),
          { type: "voteReply", term: s.term, granted: grant },
          grant ? "yes" : "no",
          { line: 2 },
        );
      } else if (m.type === "voteReply") {
        sim.deliver(ev, m.granted ? "back" : "rejected", { line: 3 });
        if (s.role === "candidate" && m.term === s.term && m.granted) {
          s.votes.add(from);
          if (s.votes.size >= need) {
            s.role = "leader";
            s.next.fill(s.log.length + 1);
            s.match.fill(0);
            s.match[i] = s.log.length;
            leaders.push({ term: s.term, server: i, time: sim.now, log: s.log.map(show) });
            sim.cancelTimer(S(i), "election");
            label(i);
            T.mark(S(i), `leader t${s.term}`, {
              line: 3,
              note: `${S(i)} has votes from ${s.votes.size} of ${n} servers: it is the leader for term ${s.term}.`,
            });
            for (let f = 0; f < n; f++) if (f !== i) sendAppend(i, f);
            sim.setTimer(S(i), "heartbeat", HEARTBEAT);
          }
        }
      } else if (m.type === "append") {
        if (m.term < s.term) {
          sim.deliver(ev, "rejected", {
            line: 5,
            note: `${S(i)} rejects an append from an old term.`,
          });
          sim.send(
            S(i),
            S(from),
            { type: "appendReply", term: s.term, ok: false, match: 0 },
            "no",
            { line: 5 },
          );
          continue;
        }
        if (s.role !== "follower") stepDown(i, m.term);
        electionTimer(i);
        const fits =
          m.prev <= s.log.length && (m.prev === 0 || s.log[m.prev - 1]!.term === m.prevTerm);
        if (!fits) {
          sim.deliver(ev, "rejected", {
            line: 5,
            note: `${S(i)}'s log does not match at index ${m.prev}; the leader will back up.`,
          });
          sim.send(
            S(i),
            S(from),
            { type: "appendReply", term: s.term, ok: false, match: 0 },
            "no",
            { line: 5 },
          );
          continue;
        }
        m.entries.forEach((e, k) => {
          const at = m.prev + k;
          if (at < s.log.length && s.log[at]!.term !== e.term) s.log.length = at;
          if (at >= s.log.length) s.log.push({ ...e });
        });
        sim.deliver(ev, m.entries.length ? "relaxed" : "tree", { line: 5 });
        drawLog(i);
        const match = m.prev + m.entries.length;
        if (m.commit > s.commit) setCommit(i, Math.min(m.commit, match));
        sim.send(
          S(i),
          S(from),
          { type: "appendReply", term: s.term, ok: true, match },
          `ok ${match}`,
          { line: 5 },
        );
      } else {
        sim.deliver(ev, m.ok ? "back" : "rejected", { line: 6 });
        if (s.role !== "leader" || m.term !== s.term) continue;
        if (m.ok) {
          s.match[from] = Math.max(s.match[from]!, m.match);
          s.next[from] = s.match[from]! + 1;
          advanceCommit(i);
        } else {
          s.next[from] = Math.max(1, s.next[from]! - 1);
          sendAppend(i, from);
        }
      }
    }

    const output: RaftOutput = {
      leaders,
      logs: srv.map((s) => s.log.map(show)),
      commitIndex: srv.map((s) => s.commit),
      commits,
    };
    const top = Math.max(...output.commitIndex);
    t.finish(input, output, {
      line: 6,
      vars: { term: null },
      note: `${leaders.length} election${leaders.length === 1 ? "" : "s"} won; ${top} entr${top === 1 ? "y" : "ies"} committed on at least one server.`,
    });
    return output;
  },

  check(input, out) {
    // Independent checks of Raft's safety properties on the recorded history.
    const terms = out.leaders.map((l) => l.term);
    if (new Set(terms).size !== terms.length) return "two leaders in one term";
    const term = (e: string) => Number(e.split(":")[0]);
    // Leaders only append entries of their own term, so terms never decrease along a log.
    for (const [s, log] of [
      ...out.logs.entries(),
      ...out.leaders.map((l) => [l.server, l.log] as const),
    ])
      if (log.some((e, i) => i > 0 && term(e) < term(log[i - 1]!)))
        return `server ${s + 1}'s log goes back in term: ${log.join(" ")}`;
    for (let a = 0; a < out.logs.length; a++)
      for (let b = a + 1; b < out.logs.length; b++) {
        const [la, lb] = [out.logs[a]!, out.logs[b]!];
        for (let i = Math.min(la.length, lb.length) - 1; i >= 0; i--)
          if (term(la[i]!) === term(lb[i]!)) {
            if (la.slice(0, i + 1).join() !== lb.slice(0, i + 1).join())
              return `logs of servers ${a + 1} and ${b + 1} share entry ${i + 1}'s term but differ before it`;
            break;
          }
      }
    const committed = new Map<number, string>();
    for (const c of out.commits) {
      const seen = committed.get(c.index);
      if (seen !== undefined && seen !== c.entry)
        return `index ${c.index} committed as ${seen} and ${c.entry}`;
      committed.set(c.index, c.entry);
    }
    for (const l of out.leaders)
      for (const c of out.commits)
        if (c.time < l.time && l.log[c.index - 1] !== c.entry)
          return `the term ${l.term} leader lacks committed entry ${c.index} (${c.entry})`;
    for (let s = 0; s < out.logs.length; s++)
      for (let i = 1; i <= out.commitIndex[s]!; i++)
        if (out.logs[s]![i - 1] !== committed.get(i))
          return `server ${s + 1}'s committed entry ${i} differs`;
    // With a reliable network and no crash, every command commits exactly once. (Their
    // order may differ from the arrival order: commands that arrive while there is no
    // leader are retried independently.)
    if (input.loss === 0 && input.crashes.length === 0) {
      const want = input.commands.map((c) => c.cmd).sort();
      const top = Math.max(...out.commitIndex);
      const got = Array.from(
        { length: top },
        (_, i) => committed.get(i + 1)!.split(":")[1]!,
      ).sort();
      if (got.join() !== want.join()) return `committed ${got} instead of ${want}`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const L = state.structures.L;
    if (L?.kind !== "grid") return "no log table";
    for (let s = 0; s < out.logs.length; s++) {
      const shown = L.cells[s]!.filter((v) => v !== null);
      if (shown.join() !== out.logs[s]!.slice(0, L.cols).join())
        return `server ${s + 1}'s log shown as ${shown}`;
      const marked = L.marks[s]!.filter((m) => m === "path").length;
      if (marked !== Math.min(out.commitIndex[s]!, L.cols))
        return `server ${s + 1} shows ${marked} committed`;
    }
    return null;
  },

  describeOutput: (out) => {
    const top = Math.max(...out.commitIndex);
    const best = out.commitIndex.indexOf(top);
    return `${out.leaders.length} leader${out.leaders.length === 1 ? "" : "s"} elected (terms ${out.leaders.map((l) => l.term).join(", ") || "none"}); committed: ${out.logs[best]!.slice(0, top).join(", ") || "nothing"}`;
  },
};
