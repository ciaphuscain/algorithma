import type { TraceState } from "@/engine/state";
import type { Op } from "../ops";
import { compareResults } from "../ops";
import type { AlgorithmModule } from "../types";
import { ops, setInput, setModel, type SetResult } from "../trees/balanced/common";

export const MAX_LEVEL = 4;

/**
 * Each key's tower height, from fixed "coin flips" derived from the key so runs are
 * reproducible: the number of trailing 1 bits of a hash, plus one, capped at MAX_LEVEL.
 * Over keys 0–99 roughly half get height ≥ 2, a quarter ≥ 3, and so on.
 */
export function levelOf(k: number): number {
  let x = (k * 157 + 71) & 255;
  let h = 1;
  while (x & 1 && h < MAX_LEVEL) {
    h++;
    x >>= 1;
  }
  return h;
}

export interface SkipListOutput {
  results: SetResult[];
  /** The keys present, in order, with their tower heights. */
  towers: { key: number; height: number }[];
}

const input = setInput({
  presets: [
    {
      id: "build",
      label: "Searches skip along the upper levels",
      value: ops("i30 i10 i50 i70 i20 i60 i40 i80 s60 s45"),
    },
    {
      id: "delete",
      label: "Deleting unlinks a whole tower",
      value: ops("i12 i25 i37 i44 i58 i63 d37 s44 d12 s12"),
    },
    {
      id: "sorted",
      label: "Sorted insertions need no rebalancing",
      value: ops("i1 i2 i3 i4 i5 i6 i7 i8 s7"),
    },
  ],
});

/**
 * A skip list (Pugh, 1990): a sorted linked list with extra "express" lists above it.
 * Each key gets a tower of random height; level i links the keys whose towers reach i.
 * A search starts at the top of the head tower, moves right while the next key is
 * smaller, and drops a level when it would overshoot — expected O(log n) steps, with no
 * rebalancing. Drawn as a table: one row per level, one column per key; a row's filled
 * cells, left to right, are that level's linked list.
 */
export const skipList: AlgorithmModule<Op[], SkipListOutput> = {
  id: "skip-list",
  version: 1,
  pseudocode: [
    "search k: x ← head; for each level from the top down:",
    "  while x's next node on this level has a key < k: x ← that node",
    "  remember x as the last node before k on this level; drop down a level",
    "  k is present if the next node on the bottom level holds k",
    "insert k: search; if absent, choose a height h (coin flips) and link k after the",
    "  remembered node on each of the bottom h levels",
    "delete k: search; if present, unlink k from every level of its tower",
  ],
  input,

  run(list, t) {
    const keys = [...new Set(list.filter((o) => o.name === "insert").map((o) => o.value!))].sort(
      (a, b) => a - b,
    );
    const col = new Map(keys.map((k, i) => [k, i + 1]));
    const G = t.grid("S", MAX_LEVEL, keys.length + 1, null, {
      label: "Skip list (each row is one level's linked list)",
      rowHeaders: Array.from({ length: MAX_LEVEL }, (_, r) => `level ${MAX_LEVEL - r}`),
      colHeaders: ["head", ...keys.map(String)],
    });
    const row = (level: number) => MAX_LEVEL - level;
    for (let l = 1; l <= MAX_LEVEL; l++) G.write(row(l), 0, "H", { line: 1 });
    const present = new Set<number>();
    const marked: [number, number][] = [];
    const clear = (line: number) => {
      if (marked.length) G.mark(marked.splice(0), null, { line });
    };
    const mark = (r: number, c: number, m: "path" | "active", line: number, note?: string) => {
      marked.push([r, c]);
      G.mark([[r, c]], m, { line, ...(note ? { note } : {}) });
    };
    /** The next column after `c` whose tower reaches `level`. */
    const nextOn = (c: number, level: number): number | null => {
      for (let j = c + 1; j <= keys.length; j++)
        if (present.has(keys[j - 1]!) && levelOf(keys[j - 1]!) >= level) return j;
      return null;
    };
    /** Returns the last column before k on each level (index = level) and whether k is present. */
    const search = (k: number) => {
      const update: number[] = [];
      let x = 0;
      mark(row(MAX_LEVEL), 0, "path", 1, `Start at the top of the head tower.`);
      for (let level = MAX_LEVEL; level >= 1; level--) {
        for (;;) {
          const nx = nextOn(x, level);
          if (nx === null) {
            t.step({ line: 2, vars: { level }, note: `Nothing further on level ${level}.` });
            break;
          }
          const key = keys[nx - 1]!;
          t.tally("comparisons");
          mark(row(level), nx, "active", 2, `Level ${level}: the next key is ${key}.`);
          if (key < k) {
            x = nx;
            mark(row(level), nx, "path", 2, `${key} < ${k}: move right.`);
          } else {
            mark(row(level), nx, "path", 2, `${key} ≥ ${k}: do not move.`);
            break;
          }
        }
        update[level] = x;
        if (level > 1) {
          mark(row(level - 1), x, "path", 3, `Drop down to level ${level - 1}.`);
          t.tally("drops");
        }
      }
      const nx = nextOn(x, 1);
      return { update, found: nx !== null && keys[nx - 1] === k };
    };

    const results: SetResult[] = [];
    for (const op of list) {
      clear(1);
      const k = op.value!;
      t.step({
        line: op.name === "insert" ? 5 : op.name === "delete" ? 7 : 1,
        vars: { op: op.name, key: k, level: null },
        note: `${op.name[0]!.toUpperCase()}${op.name.slice(1)} ${k}.`,
      });
      const { found } = search(k);
      if (op.name === "search") {
        t.step({
          line: 4,
          note: found ? `The next key on level 1 is ${k}: found.` : `${k} is not in the list.`,
        });
        results.push(found ? "found" : "missing");
        continue;
      }
      if (op.name === "insert") {
        if (found) {
          t.step({ line: 4, note: `${k} is already in the list.` });
          results.push("present");
          continue;
        }
        const h = levelOf(k);
        present.add(k);
        t.step({
          line: 5,
          vars: { level: h },
          note: `${k}'s coin flips give a tower of height ${h}.`,
        });
        for (let level = 1; level <= h; level++) {
          G.write(row(level), col.get(k)!, k, {
            line: 6,
            note: `Link ${k} into level ${level}, after the remembered node.`,
          });
          t.tally("links", 2);
        }
        results.push("inserted");
        continue;
      }
      if (!found) {
        t.step({ line: 7, note: `${k} is not in the list.` });
        results.push("missing");
        continue;
      }
      present.delete(k);
      for (let level = levelOf(k); level >= 1; level--) {
        G.write(row(level), col.get(k)!, null, {
          line: 7,
          note: `Unlink ${k} from level ${level}: its predecessor now points past it.`,
        });
        t.tally("links");
      }
      results.push("deleted");
    }
    clear(7);
    const towers = keys.filter((k) => present.has(k)).map((k) => ({ key: k, height: levelOf(k) }));
    const output: SkipListOutput = { results, towers };
    t.finish(list, output, {
      vars: { op: null, key: null, level: null },
      note: `${towers.length} keys; tower heights ${towers.map((x) => x.height).join(", ") || "—"}.`,
    });
    return output;
  },

  check(list, out) {
    const want = setModel(list);
    const r = compareResults(list, out.results, want.results);
    if (r) return r;
    if (out.towers.map((x) => x.key).join() !== want.keys.join())
      return `keys ${out.towers.map((x) => x.key)}, expected ${want.keys}`;
    const bad = out.towers.find((x) => x.height !== levelOf(x.key));
    return bad
      ? `${bad.key} has height ${bad.height}, its coin flips give ${levelOf(bad.key)}`
      : null;
  },

  fidelity(state: TraceState, out) {
    const S = state.structures.S;
    if (S?.kind !== "grid") return "no grid";
    const drawn: { key: number; height: number }[] = [];
    for (let c = 1; c < S.cols; c++) {
      const col = S.cells.map((r) => r[c]).reverse(); // bottom level first
      const height = col.filter((v) => v !== null).length;
      if (col.slice(0, height).some((v) => v === null)) return `column ${c} has a gap in its tower`;
      if (height) drawn.push({ key: col[0] as number, height });
    }
    return JSON.stringify(drawn) === JSON.stringify(out.towers)
      ? null
      : "the drawn towers differ from the result";
  },

  describeOutput: (o) =>
    `${o.results.join(", ")}; ${o.towers.map((x) => `${x.key}^${x.height}`).join(" ") || "empty"}`,
};
