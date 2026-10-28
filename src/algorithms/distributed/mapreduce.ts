import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { wholeIn } from "./sim";

export interface MapReduceInput {
  /** One input split per document. */
  documents: string[];
  mappers: number;
  reducers: number;
  /** Sum counts on each mapper before the shuffle. */
  combiner: boolean;
  /** A mapper (index) that crashes on its first task, or null. */
  failing: number | null;
}

export interface MapReduceOutput {
  /** Word counts, alphabetically. */
  counts: [string, number][];
  /** The reducer each word went to. */
  reducerOf: Record<string, number>;
  /** Key–value pairs sent from mappers to reducers. */
  shuffled: number;
  /** Map tasks given to a second mapper after a failure. */
  reassigned: number;
}

const MAX_DOCS = 6;
const MAX_WORDS = 10;
const MAX_DISTINCT = 30;
const TIMEOUT = 4;

export const wordsOf = (doc: string) => doc.toLowerCase().match(/[a-z]+/g) ?? [];

/** The partition function: the sum of the letter codes, modulo the number of reducers. */
export const partition = (word: string, reducers: number) =>
  [...word].reduce((s, ch) => s + ch.charCodeAt(0), 0) % reducers;

const input: InputSpec<MapReduceInput> = {
  fields: [
    {
      name: "documents",
      label: "Documents (one per line)",
      placeholder: "the cat sat\nthe dog sat",
      multiline: true,
    },
    { name: "mappers", label: "Mappers", placeholder: "e.g. 2" },
    { name: "reducers", label: "Reducers", placeholder: "e.g. 2" },
    { name: "combiner", label: "Combiner (yes or no)", placeholder: "no" },
    {
      name: "failing",
      label: "Failing mapper (optional)",
      placeholder: "e.g. 2",
      help: "That mapper crashes on its first task; the master gives the task to another.",
    },
  ],
  constraints: `1–${MAX_DOCS} documents of 1–${MAX_WORDS} words (letters only are counted, case is ignored), at most ${MAX_DISTINCT} different words; 1–4 mappers; 1–3 reducers; a failing mapper needs at least 2 mappers.`,
  parse(fields) {
    const errors: string[] = [];
    const docs = (fields.documents ?? "")
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);
    if (docs.length < 1 || docs.length > MAX_DOCS) errors.push(`Give 1–${MAX_DOCS} documents`);
    docs.forEach((d, i) => {
      const n = wordsOf(d).length;
      if (n < 1 || n > MAX_WORDS)
        errors.push(`Document ${i + 1} has ${n} words; give 1–${MAX_WORDS}`);
    });
    if (new Set(docs.flatMap(wordsOf)).size > MAX_DISTINCT)
      errors.push(`Use at most ${MAX_DISTINCT} different words`);
    const mappers = wholeIn(fields.mappers, 1, 4);
    if (mappers === null) errors.push("Mappers must be a whole number from 1 to 4");
    const reducers = wholeIn(fields.reducers, 1, 3);
    if (reducers === null) errors.push("Reducers must be a whole number from 1 to 3");
    const ct = (fields.combiner ?? "").trim().toLowerCase();
    if (!["yes", "no", ""].includes(ct)) errors.push('Combiner must be "yes" or "no"');
    let failing: number | null = null;
    const ft = (fields.failing ?? "").trim();
    if (ft) {
      const f = wholeIn(ft, 1, 4);
      if (f === null || mappers === null || f > mappers)
        errors.push(`The failing mapper must be from 1 to ${mappers ?? 4}`);
      else if (mappers < 2) errors.push("A failing mapper needs at least 2 mappers");
      else failing = f - 1;
    }
    if (errors.length) return { ok: false, errors: errors.slice(0, 5) };
    return {
      ok: true,
      value: {
        documents: docs,
        mappers: mappers!,
        reducers: reducers!,
        combiner: ct === "yes",
        failing,
      },
    };
  },
  format: (v) => ({
    documents: v.documents.join("\n"),
    mappers: String(v.mappers),
    reducers: String(v.reducers),
    combiner: v.combiner ? "yes" : "no",
    failing: v.failing === null ? "" : String(v.failing + 1),
  }),
  presets: [
    {
      id: "classic",
      label: "Word count: three documents, two mappers, two reducers",
      value: {
        documents: ["the cat sat on the mat", "the dog sat", "a cat and a dog"],
        mappers: 2,
        reducers: 2,
        combiner: false,
        failing: null,
      },
    },
    {
      id: "combiner",
      label: "The same job with a combiner",
      value: {
        documents: ["the cat sat on the mat", "the dog sat", "a cat and a dog"],
        mappers: 2,
        reducers: 2,
        combiner: true,
        failing: null,
      },
    },
    {
      id: "failure",
      label: "Mapper 2 crashes; its task is re-executed",
      value: {
        documents: ["to be or not to be", "that is the question", "to sleep perchance to dream"],
        mappers: 3,
        reducers: 2,
        combiner: false,
        failing: 1,
      },
    },
  ],
  random(rng) {
    const vocab = ["a", "big", "cat", "dog", "ran", "sat", "the", "on", "mat", "red", "sun", "and"];
    const docs = Array.from({ length: rng.int(1, MAX_DOCS) }, () =>
      Array.from({ length: rng.int(1, 8) }, () => vocab[rng.int(0, vocab.length - 1)]).join(" "),
    );
    const mappers = rng.int(1, 4);
    return {
      documents: docs,
      mappers,
      reducers: rng.int(1, 3),
      combiner: rng.int(0, 1) === 1,
      failing: mappers >= 2 && rng.int(0, 2) === 0 ? rng.int(0, mappers - 1) : null,
    };
  },
};

/**
 * MapReduce word count, simulated in time steps. The master hands each document (an
 * input split) to an idle mapper, which emits (word, 1) pairs grouped by reducer. When
 * every split is done, each reducer fetches its partition from every mapper, sums the
 * counts per word and reports back. A mapper that does not answer within a timeout is
 * presumed dead and its split is re-executed elsewhere.
 */
export const mapReduce: AlgorithmModule<MapReduceInput, MapReduceOutput> = {
  id: "mapreduce",
  version: 1,
  pseudocode: [
    "master: give each input split to an idle mapper",
    "mapper: for each word w in the split, emit (w, 1) into partition hash(w) mod R   (combiner: sum per word first)",
    "master: if a mapper has not finished a split within the timeout, give the split to another mapper",
    "when every split is mapped: each reducer fetches its partition from every mapper (the shuffle)",
    "reducer: group the pairs by word and sum the counts",
    "master: the job is done when every reducer has reported",
  ],
  input,

  run(input, t) {
    const { documents, mappers: m, reducers: r, combiner, failing } = input;
    const Mk = (i: number) => `M${i + 1}`;
    const Rk = (j: number) => `R${j + 1}`;
    const T = t.timeline("T", {
      label: "Master and workers",
      // Two time units per round of map tasks, the timeout if a mapper fails, then
      // shuffle, reduce and report.
      horizon: 2 * Math.ceil(documents.length / m) + (failing === null ? 0 : TIMEOUT + 2) + 4,
      lanes: [
        { id: "master" },
        ...Array.from({ length: m }, (_, i) => ({ id: Mk(i), label: `mapper ${i + 1}` })),
        ...Array.from({ length: r }, (_, j) => ({ id: Rk(j), label: `reducer ${j + 1}` })),
      ],
    });
    const G = t.grid("G", documents.length, r, null, {
      label: "Pairs each split sends to each reducer",
      rowHeaders: documents.map((_, k) => `split ${k + 1}`),
      colHeaders: Array.from({ length: r }, (_, j) => `to R${j + 1}`),
    });
    const words = [...new Set(documents.flatMap(wordsOf))].sort();
    const RES = t.grid("C", words.length, 2, null, {
      label: "Result",
      rowHeaders: words,
      colHeaders: ["count", "reducer"],
    });

    // Map output held by each mapper: split -> reducer -> pairs.
    const held = new Map<number, { mapper: number; parts: [string, number][][] }>();
    const idle = Array.from({ length: m }, (_, i) => i);
    const pending = documents.map((_, k) => k);
    const running = new Map<number, { split: number; since: number }>();
    const dead = new Set<number>();
    let reassigned = 0;
    let now = 0;
    const tick = (time: number) => {
      now = time;
      T.tick(time);
    };

    const assign = () => {
      while (pending.length && idle.length) {
        const split = pending.shift()!;
        const mapper = idle.shift()!;
        running.set(mapper, { split, since: now });
        const id = T.send("master", Mk(mapper), `map split ${split + 1}`, { line: 1 });
        T.lane(Mk(mapper), "current");
        inbox.push({ at: now + 1, id, mapper, split });
      }
    };
    const inbox: { at: number; id: string; mapper: number; split: number }[] = [];
    const reports: { at: number; id: string; mapper: number; split: number }[] = [];
    T.lane("master", "current", {
      line: 1,
      note: `${documents.length} splits for ${m} mapper${m === 1 ? "" : "s"}.`,
    });
    assign();

    // Map phase: one time unit to deliver, one to compute and report.
    for (let guard = 0; held.size < documents.length; guard++) {
      if (guard > 100) throw new Error("mapreduce: the map phase did not finish");
      tick(now + 1);
      for (const job of inbox.filter((x) => x.at === now)) {
        inbox.splice(inbox.indexOf(job), 1);
        if (job.mapper === failing && !dead.has(job.mapper)) {
          dead.add(job.mapper);
          T.deliver(job.id, "tree");
          T.lane(Mk(job.mapper), "unreachable", {
            line: 3,
            note: `Mapper ${job.mapper + 1} crashes while working on split ${job.split + 1}.`,
          });
          T.annotate(Mk(job.mapper), "crashed");
          continue;
        }
        T.deliver(job.id, "tree", { line: 2 });
        const ws = wordsOf(documents[job.split]!);
        t.tally("words mapped", ws.length);
        const parts: [string, number][][] = Array.from({ length: r }, () => []);
        if (combiner) {
          const sums = new Map<string, number>();
          for (const w of ws) sums.set(w, (sums.get(w) ?? 0) + 1);
          for (const [w, c] of [...sums].sort()) parts[partition(w, r)]!.push([w, c]);
        } else for (const w of ws) parts[partition(w, r)]!.push([w, 1]);
        held.set(job.split, { mapper: job.mapper, parts });
        parts.forEach((p, j) =>
          G.write(job.split, j, p.length, {
            line: 2,
            note:
              j === 0
                ? `Mapper ${job.mapper + 1} maps split ${job.split + 1}: ${ws.length} words → ${parts.map((q) => q.length).join(" + ")} pairs${combiner ? " after combining" : ""}.`
                : undefined,
          }),
        );
        T.annotate(Mk(job.mapper), `split ${job.split + 1} mapped`);
        const id = T.send(Mk(job.mapper), "master", `done ${job.split + 1}`, { line: 2 });
        reports.push({ at: now + 1, id, mapper: job.mapper, split: job.split });
      }
      for (const rep of reports.filter((x) => x.at === now)) {
        reports.splice(reports.indexOf(rep), 1);
        T.deliver(rep.id, "back", { line: 1 });
        running.delete(rep.mapper);
        idle.push(rep.mapper);
        T.lane(Mk(rep.mapper), "visited");
      }
      for (const [mapper, job] of [...running]) {
        if (dead.has(mapper) && now - job.since >= TIMEOUT && !held.has(job.split)) {
          running.delete(mapper);
          pending.unshift(job.split);
          reassigned++;
          T.mark("master", `re-run split ${job.split + 1}`, {
            line: 3,
            note: `Mapper ${mapper + 1} has not answered in ${TIMEOUT} time units: the master gives split ${job.split + 1} to another mapper.`,
          });
        }
      }
      idle.sort((a, b) => a - b);
      assign();
    }

    // Shuffle: every reducer fetches its partition from every split's output.
    tick(now + 1);
    T.lane("master", "visited", {
      line: 4,
      note: "Every split is mapped: the reducers fetch their partitions.",
    });
    let shuffled = 0;
    const transfers: string[] = [];
    const inputs: [string, number][][] = Array.from({ length: r }, () => []);
    for (const [split, out] of [...held].sort((a, b) => a[0] - b[0]))
      out.parts.forEach((pairs, j) => {
        if (pairs.length === 0) return;
        shuffled += pairs.length;
        t.tally("pairs shuffled", pairs.length);
        inputs[j]!.push(...pairs);
        transfers.push(
          T.send(
            Mk(out.mapper),
            Rk(j),
            `${pairs.length} pair${pairs.length === 1 ? "" : "s"} (split ${split + 1})`,
            { line: 4 },
          ),
        );
      });
    tick(now + 1);
    for (const id of transfers) T.deliver(id, "tree", { line: 4 });

    // Reduce.
    tick(now + 1);
    const counts = new Map<string, number>();
    const reducerOf: Record<string, number> = {};
    const results: string[] = [];
    inputs.forEach((pairs, j) => {
      T.lane(Rk(j), "current", { line: 5 });
      const sums = new Map<string, number>();
      for (const [w, c] of pairs) sums.set(w, (sums.get(w) ?? 0) + c);
      for (const [w, c] of [...sums].sort()) {
        counts.set(w, c);
        reducerOf[w] = j;
        const row = words.indexOf(w);
        RES.write(row, 0, c, { line: 5 });
        RES.write(row, 1, `R${j + 1}`);
      }
      T.annotate(Rk(j), `${sums.size} word${sums.size === 1 ? "" : "s"}`);
      results.push(T.send(Rk(j), "master", `${sums.size} counts`, { line: 6 }));
    });
    tick(now + 1);
    for (const [j, id] of results.entries()) {
      T.deliver(id, "path", { line: 6 });
      T.lane(Rk(j), "visited");
    }
    T.lane("master", "path");
    T.mark("master", "job done", {
      line: 6,
      note: `${words.length} different words counted; ${shuffled} pairs crossed the network.`,
    });
    const output: MapReduceOutput = {
      counts: [...counts].sort((a, b) => (a[0] < b[0] ? -1 : 1)),
      reducerOf,
      shuffled,
      reassigned,
    };
    t.finish(input, output, { line: 6 });
    return output;
  },

  check(input, out) {
    // Independent oracle: count the words directly.
    const want = new Map<string, number>();
    for (const w of input.documents.flatMap(wordsOf)) want.set(w, (want.get(w) ?? 0) + 1);
    const expected = [...want].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    if (JSON.stringify(out.counts) !== JSON.stringify(expected))
      return `counts ${JSON.stringify(out.counts)}`;
    for (const [w] of expected)
      if (out.reducerOf[w] !== partition(w, input.reducers))
        return `${w} went to the wrong reducer`;
    const pairs = input.combiner
      ? input.documents.reduce((s, d) => s + new Set(wordsOf(d)).size, 0)
      : input.documents.reduce((s, d) => s + wordsOf(d).length, 0);
    if (out.shuffled !== pairs) return `${out.shuffled} pairs shuffled, expected ${pairs}`;
    // The failing mapper's first split is re-run exactly once, if it got one.
    if (out.reassigned > (input.failing === null ? 0 : 1)) return `${out.reassigned} re-executions`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const C = state.structures.C;
    if (C?.kind !== "grid") return "no result table";
    const shown = C.rowHeaders!.map((w, i) => [w, C.cells[i]![0]]);
    return JSON.stringify(shown) === JSON.stringify(out.counts)
      ? null
      : `result shown ${JSON.stringify(shown)}`;
  },

  describeOutput: (out) =>
    `${out.counts.map(([w, c]) => `${w} ${c}`).join(", ")} · ${out.shuffled} pairs shuffled${out.reassigned ? ` · ${out.reassigned} split re-executed` : ""}`,
};
