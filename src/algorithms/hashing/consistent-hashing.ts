import type { PlanePoint } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import {
  afterChange,
  checkMinimalMovement,
  hash32,
  placementInput,
  type PlacementInput,
  type PlacementOutput,
} from "./placement";

export interface ConsistentInput extends PlacementInput {
  /** Positions on the ring per server (virtual nodes), 1–3. */
  vnodes: number;
}

/** Position on the ring, in degrees 0..359. */
export const ringPosition = (name: string) => hash32(name) % 360;

/** A server's positions: its name, then name#1, name#2 for further virtual nodes. */
export const serverPositions = (s: string, vnodes: number) =>
  Array.from({ length: vnodes }, (_, i) => ringPosition(i === 0 ? s : `${s}#${i}`));

/**
 * Each server's share of the ring, in degrees: a position owns the arc from the
 * previous position (exclusive) up to itself. Shares sum to 360.
 */
export function ringShares(servers: string[], vnodes: number): Record<string, number> {
  const all = servers
    .flatMap((s) => serverPositions(s, vnodes).map((d) => ({ s, d })))
    .sort((a, b) => a.d - b.d || (a.s < b.s ? -1 : 1));
  const share: Record<string, number> = Object.fromEntries(servers.map((s) => [s, 0]));
  all.forEach((p, i) => {
    const prev = all[(i - 1 + all.length) % all.length]!;
    share[p.s]! += all.length === 1 ? 360 : (p.d - prev.d + 360) % 360;
  });
  return share;
}

const at = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  // 0° at the top, increasing clockwise, like a clock face.
  return { x: Number((r * Math.sin(a)).toFixed(4)), y: Number((r * Math.cos(a)).toFixed(4)) };
};

/** Clockwise distance from a to b on the ring. */
const cw = (a: number, b: number) => (b - a + 360) % 360;

const base = placementInput([]);

const input: InputSpec<ConsistentInput> = {
  ...base,
  fields: [
    ...base.fields,
    { name: "vnodes", label: "Positions per server (1–3)", placeholder: "1" },
  ],
  constraints: `${base.constraints} Each server takes 1–3 positions on the ring (virtual nodes).`,
  parse(f) {
    const r = base.parse(f);
    const vs = (f.vnodes ?? "").trim() || "1";
    const vnodes = /^[123]$/.test(vs) ? Number(vs) : null;
    if (vnodes === null)
      return {
        ok: false,
        errors: [...(r.ok ? [] : r.errors), "Positions per server must be 1, 2 or 3"],
      };
    return r.ok ? { ok: true, value: { ...r.value, vnodes } } : r;
  },
  format: (v) => ({ ...base.format(v), vnodes: String(v.vnodes) }),
  presets: [
    {
      id: "classic",
      label: "Add a fourth server: only nearby keys move",
      value: {
        servers: ["A", "B", "C"],
        keys: ["apple", "fig", "kiwi", "lime", "pear", "plum", "date", "lemon"],
        change: { kind: "add", server: "D" },
        vnodes: 1,
      },
    },
    {
      id: "remove",
      label: "Remove a server: its keys pass on",
      value: {
        servers: ["A", "B", "C", "D"],
        keys: ["apple", "fig", "kiwi", "lime", "pear", "plum", "date", "lemon"],
        change: { kind: "remove", server: "C" },
        vnodes: 1,
      },
    },
    {
      id: "vnodes",
      label: "Three positions per server",
      value: {
        servers: ["A", "B", "C"],
        keys: ["apple", "fig", "kiwi", "lime", "pear", "plum", "date", "lemon"],
        change: { kind: "add", server: "D" },
        vnodes: 3,
      },
    },
  ],
  random(rng, size) {
    return { ...base.random(rng, size), vnodes: rng.int(1, 3) };
  },
};

/** The owner of key k: the server position at the smallest clockwise distance (ties by name). */
function owner(k: string, live: string[], vnodes: number, count?: () => void): string {
  const pos = ringPosition(k);
  let best: { s: string; d: number } | null = null;
  for (const s of live)
    for (const p of serverPositions(s, vnodes)) {
      count?.();
      const d = cw(pos, p);
      if (!best || d < best.d || (d === best.d && s < best.s)) best = { s, d };
    }
  return best!.s;
}

/**
 * Consistent hashing: servers and keys are hashed to positions on a ring (here 0–359°);
 * each key belongs to the first server position clockwise from it. Adding a server takes
 * over only the keys between its positions and the ones before them; removing one hands
 * its keys to the next positions. Other keys stay where they are. Several positions per
 * server (virtual nodes) even out how many keys each server gets.
 */
export const consistentHashing: AlgorithmModule<ConsistentInput, PlacementOutput> = {
  id: "consistent-hashing",
  version: 1,
  pseudocode: [
    "place each server s on the ring at hash(s) mod 360 (and at hash(s#i) for extra virtual nodes)",
    "for each key k: walk clockwise from hash(k) mod 360 to the first server position",
    "change: add or remove one server",
    "for each key k: look up its server again; it moves only if that server changed",
  ],
  input,

  run(input, t) {
    const { vnodes } = input;
    const servers = [
      ...new Set([...input.servers, ...(input.change ? [input.change.server] : [])]),
    ];
    const vid = (s: string, i: number) => `S:${s}#${i}`;
    const points: PlanePoint[] = [
      ...servers.flatMap((s) =>
        serverPositions(s, vnodes).map((deg, i) => ({ id: vid(s, i), label: s, ...at(deg, 1) })),
      ),
      ...input.keys.map((k) => ({ id: `K:${k}`, label: k, ...at(ringPosition(k), 0.78) })),
    ];
    const R = t.plane("R", {
      points,
      label: "The ring: servers outside, keys inside; 0° at the top, clockwise",
      bounds: { minX: -1.35, minY: -1.35, maxX: 1.35, maxY: 1.35 },
    });
    R.draw("ring", { kind: "circle", x: 0, y: 0, r: 1 }, "idle", { line: 1 });
    const present = new Set(input.servers);
    for (const s of servers) {
      const degs = serverPositions(s, vnodes);
      degs.forEach((deg, i) => {
        R.annotate(vid(s, i), `${deg}°`, { line: 1 });
        R.point(vid(s, i), present.has(s) ? "current" : "unvisited", {
          line: 1,
          note: present.has(s) && i === 0 ? `Server ${s} sits at ${degs.join("°, ")}°.` : undefined,
        });
      });
    }
    for (const k of input.keys) R.annotate(`K:${k}`, `${ringPosition(k)}°`, { line: 2 });

    // The line from key k ends at the server position that owns it.
    const ownerPosition = (k: string, s: string) => {
      const pos = ringPosition(k);
      const degs = serverPositions(s, vnodes);
      return degs.reduce((b, d) => (cw(pos, d) < cw(pos, b) ? d : b), degs[0]!);
    };
    const assign = (live: string[], line: number, previous?: Record<string, string>) => {
      const result: Record<string, string> = {};
      for (const k of input.keys) {
        const s = owner(k, live, vnodes, () => t.tally("checks"));
        result[k] = s;
        const moved = previous !== undefined && previous[k] !== s;
        const [a, b] = [at(ringPosition(k), 0.78), at(ownerPosition(k, s), 1)];
        R.draw(
          `a:${k}`,
          { kind: "segment", x1: a.x, y1: a.y, x2: b.x, y2: b.y },
          moved ? "highlight" : "tree",
          {
            line,
            note:
              previous === undefined
                ? `${k} is at ${ringPosition(k)}°; the first server position clockwise belongs to ${s} (${ownerPosition(k, s)}°).`
                : moved
                  ? `${k} moves from ${previous[k]} to ${s}.`
                  : undefined,
          },
        );
        R.point(`K:${k}`, moved ? "highlight" : "visited", { line });
      }
      return result;
    };

    const before = assign(input.servers, 2);
    let after: Record<string, string> | null = null;
    let moved: string[] = [];
    if (input.change) {
      const { kind, server } = input.change;
      serverPositions(server, vnodes).forEach((_, i) =>
        R.point(vid(server, i), kind === "add" ? "current" : "unreachable", {
          line: 3,
          note:
            i > 0
              ? undefined
              : kind === "add"
                ? `Add server ${server} at ${serverPositions(server, vnodes).join("°, ")}°.`
                : `Remove server ${server}; its keys pass to the next server positions clockwise.`,
        }),
      );
      after = assign(afterChange(input), 4, before);
      moved = input.keys.filter((k) => before[k] !== after![k]);
      t.tally("moved", moved.length);
    }
    const output: PlacementOutput = { before, after, moved };
    const shares = ringShares(afterChange(input), vnodes);
    const counts = afterChange(input).map(
      (s) =>
        `${s}: ${input.keys.filter((k) => (after ?? before)[k] === s).length} (${Math.round((shares[s]! / 360) * 100)}% of the ring)`,
    );
    t.finish(input, output, {
      line: 4,
      note: `${input.change ? `${moved.length} of ${input.keys.length} keys moved. ` : ""}Keys per server: ${counts.join(", ")}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: sort every server position by clockwise distance from the key
    // (ties by name) and take the first, rather than scanning for the minimum.
    const sortedOwner = (k: string, live: string[]) => {
      const pos = ringPosition(k);
      const all = live.flatMap((s) =>
        serverPositions(s, input.vnodes).map((d) => ({ s, d: cw(pos, d) })),
      );
      all.sort((a, b) => a.d - b.d || (a.s < b.s ? -1 : 1));
      return all[0]!.s;
    };
    for (const k of input.keys) {
      if (out.before[k] !== sortedOwner(k, input.servers))
        return `${k} placed on ${out.before[k]}, expected ${sortedOwner(k, input.servers)}`;
      if (out.after && out.after[k] !== sortedOwner(k, afterChange(input)))
        return `${k} placed on ${out.after[k]} after the change, expected ${sortedOwner(k, afterChange(input))}`;
    }
    return checkMinimalMovement(input, out);
  },

  fidelity(state: TraceState, out) {
    const R = state.structures.R;
    if (R?.kind !== "plane") return "no plane R";
    const final = out.after ?? out.before;
    for (const [k, s] of Object.entries(final)) {
      const shape = R.shapes.find((x) => x.id === `a:${k}`);
      if (!shape || shape.kind !== "segment") return `no line from ${k}`;
      const end = R.points.find(
        (p) => p.x === shape.x2 && p.y === shape.y2 && p.id.startsWith("S:") && p.label === s,
      );
      if (!end) return `${k}'s line does not end at a position of ${s}`;
    }
    return null;
  },

  describeOutput: (o) => {
    const final = o.after ?? o.before;
    const list = Object.entries(final)
      .map(([k, s]) => `${k}→${s}`)
      .join(", ");
    return o.after ? `${list}; moved: ${o.moved.join(", ") || "none"}` : list;
  },
};
