import type { InputPreset, InputSpec } from "../types";

/** 32-bit FNV-1a hash of a string. Deterministic and simple; not for adversarial input. */
export function fnv1a32(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * FNV-1a followed by MurmurHash3's 32-bit finalizer. FNV-1a alone barely changes
 * between short names that differ in one character ("A" and "C" land 2° apart modulo
 * 360); the finalizer mixes every input bit into every output bit.
 */
export function hash32(text: string): number {
  let h = fnv1a32(text);
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

export interface PlacementInput {
  servers: string[];
  keys: string[];
  /** One change after the first placement: add or remove a server, or none. */
  change: { kind: "add" | "remove"; server: string } | null;
}

export interface PlacementOutput {
  before: Record<string, string>;
  after: Record<string, string> | null;
  /** Keys whose server changed. */
  moved: string[];
}

const NAME = /^[A-Za-z][A-Za-z0-9]{0,5}$/;
const MAX_SERVERS = 6;
const MAX_KEYS = 12;

const names = (text: string | undefined) =>
  (text ?? "")
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Servers, keys and an optional change written "+D" (add server D) or "-B" (remove B). */
export function placementInput(presets: InputPreset<PlacementInput>[]): InputSpec<PlacementInput> {
  return {
    fields: [
      { name: "servers", label: "Servers", placeholder: "e.g. A, B, C" },
      { name: "keys", label: "Keys", placeholder: "e.g. apple, kiwi, lime" },
      {
        name: "change",
        label: "Then (+X adds server X, -X removes it; optional)",
        placeholder: "e.g. +D",
      },
    ],
    constraints: `1–${MAX_SERVERS} servers and 1–${MAX_KEYS} keys, each a name of 1–6 letters or digits starting with a letter; no repeats. A change adds a new server or removes one (not the last).`,
    parse(f) {
      const errors: string[] = [];
      const servers = names(f.servers);
      const keys = names(f.keys);
      for (const [list, what, max] of [
        [servers, "server", MAX_SERVERS],
        [keys, "key", MAX_KEYS],
      ] as const) {
        if (list.length === 0) errors.push(`Give at least one ${what}`);
        if (list.length > max) errors.push(`Give at most ${max} ${what}s`);
        for (const x of list) if (!NAME.test(x)) errors.push(`"${x}" is not a valid ${what} name`);
        if (new Set(list).size !== list.length) errors.push(`${what} names must be distinct`);
      }
      let change: PlacementInput["change"] = null;
      const c = (f.change ?? "").trim();
      if (c) {
        const m = /^([+-])\s*([A-Za-z][A-Za-z0-9]{0,5})$/.exec(c);
        if (!m) errors.push('Write the change as "+X" or "-X"');
        else {
          const server = m[2]!;
          if (m[1] === "+" && servers.includes(server))
            errors.push(`${server} is already a server`);
          if (m[1] === "+" && servers.length >= MAX_SERVERS)
            errors.push(`At most ${MAX_SERVERS} servers`);
          if (m[1] === "-" && !servers.includes(server)) errors.push(`${server} is not a server`);
          if (m[1] === "-" && servers.length === 1) errors.push("Cannot remove the last server");
          change = { kind: m[1] === "+" ? "add" : "remove", server };
        }
      }
      return errors.length
        ? { ok: false, errors: errors.slice(0, 5) }
        : { ok: true, value: { servers, keys, change } };
    },
    format: (v) => ({
      servers: v.servers.join(", "),
      keys: v.keys.join(", "),
      change: v.change ? `${v.change.kind === "add" ? "+" : "-"}${v.change.server}` : "",
    }),
    presets,
    random(rng) {
      const pool = ["A", "B", "C", "D", "E", "F"];
      const s = rng.int(2, 5);
      const servers = pool.slice(0, s);
      const fruit = [
        "apple",
        "fig",
        "kiwi",
        "lime",
        "pear",
        "plum",
        "date",
        "lemon",
        "mango",
        "peach",
        "grape",
        "melon",
      ];
      const keys = fruit.slice(0, rng.int(3, 12));
      const r = rng.int(0, 2);
      const change: PlacementInput["change"] =
        r === 0
          ? null
          : r === 1
            ? { kind: "add", server: pool[s]! }
            : { kind: "remove", server: servers[rng.int(0, s - 1)]! };
      return { servers, keys, change };
    },
  };
}

/** Server list after the change. */
export const afterChange = (input: PlacementInput) =>
  !input.change
    ? input.servers
    : input.change.kind === "add"
      ? [...input.servers, input.change.server]
      : input.servers.filter((s) => s !== input.change!.server);

/**
 * The property both schemes promise, checked from the output alone: when a server is
 * added, a key moves only to the new server; when one is removed, only its keys move.
 */
export function checkMinimalMovement(input: PlacementInput, out: PlacementOutput): string | null {
  if (!input.change)
    return out.after === null && out.moved.length === 0 ? null : "nothing should change";
  if (!out.after) return "missing the placement after the change";
  const moved = input.keys.filter((k) => out.before[k] !== out.after![k]);
  if (moved.join() !== out.moved.join()) return `moved ${out.moved}, but ${moved} changed server`;
  const { kind, server } = input.change;
  for (const k of moved) {
    if (kind === "add" && out.after[k] !== server)
      return `${k} moved to ${out.after[k]}, not to the new server`;
    if (kind === "remove" && out.before[k] !== server)
      return `${k} moved although ${out.before[k]} stayed`;
  }
  return null;
}
