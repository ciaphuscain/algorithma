import type { Structure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import { heapSize } from "./heap-view";

/**
 * Plain-text description of a state, for screen readers and the "text view". Every
 * visual cue the renderers draw has a textual counterpart here.
 */
export function describeStructure(name: string, s: Structure): string {
  const label = s.label ?? name;
  switch (s.kind) {
    case "array": {
      const marked = s.values
        .map((v, i) => (s.marks[i] ? `${i}:${s.marks[i]}` : null))
        .filter(Boolean)
        .join(", ");
      const pointers = Object.entries(s.pointers)
        .map(([p, i]) => `${p}=${i}`)
        .join(", ");
      const heap =
        s.display === "heap"
          ? `; as a heap, the first ${heapSize(s)} element${heapSize(s) === 1 ? "" : "s"}${heapSize(s) ? ` with root ${String(s.values[0])}` : ""}`
          : "";
      return `${label} = [${s.values.map(String).join(", ")}]${marked ? `; marked ${marked}` : ""}${pointers ? `; pointers ${pointers}` : ""}${heap}.`;
    }
    case "graph": {
      const byStatus = new Map<string, string[]>();
      for (const n of s.nodes) {
        const st = s.nodeStatus[n.id] ?? "unvisited";
        byStatus.set(st, [
          ...(byStatus.get(st) ?? []),
          n.id + (s.annotations[n.id] ? ` (${s.annotations[n.id]})` : ""),
        ]);
      }
      const nodes = [...byStatus].map(([st, ids]) => `${st}: ${ids.join(", ")}`).join("; ");
      const tree = s.edges
        .filter((e) => s.edgeStatus[e.id] === "tree" || s.edgeStatus[e.id] === "path")
        .map((e) => e.id);
      return `${label} — ${nodes}${tree.length ? `; highlighted edges ${tree.join(", ")}` : ""}.`;
    }
    case "sequence":
      return `${label} (${s.discipline}) = [${s.items.map(String).join(", ")}].`;
    case "tree": {
      if (s.root === null) return `${label}: empty tree.`;
      const show = (id: string | null): string => {
        if (id === null) return "·";
        const n = s.nodes[id]!;
        const v = `${n.edgeLabel !== undefined ? `${n.edgeLabel}:` : ""}${String(n.value)}`;
        const kids = n.children;
        if (kids.every((c) => c === null)) return v;
        return `${v}(${kids.map(show).join(", ")})`;
      };
      const marked = Object.entries(s.nodeStatus)
        .filter(([, st]) => st !== "unvisited")
        .map(([id, st]) => `${String(s.nodes[id]?.value)}:${st}`);
      return `${label} (tree) = ${show(s.root)}${marked.length ? `; ${marked.join(", ")}` : ""}.`;
    }
    case "plane": {
      const byStatus = new Map<string, string[]>();
      for (const p of s.points) {
        const st = s.pointStatus[p.id] ?? "unvisited";
        byStatus.set(st, [
          ...(byStatus.get(st) ?? []),
          `${p.label ?? p.id} (${p.x}, ${p.y})${s.annotations[p.id] ? ` ${s.annotations[p.id]}` : ""}`,
        ]);
      }
      const points = [...byStatus].map(([st, ids]) => `${st}: ${ids.join(", ")}`).join("; ");
      const shapes = s.shapes.map((sh) => {
        const at =
          sh.kind === "circle"
            ? `circle at (${sh.x}, ${sh.y}) radius ${sh.r}`
            : `${sh.kind === "rect" ? "box" : "segment"} (${sh.x1}, ${sh.y1})–(${sh.x2}, ${sh.y2})`;
        return `${sh.label ? `${sh.label}: ` : ""}${at}, ${sh.status}`;
      });
      return `${label} (plane) — ${points}${shapes.length ? `; shapes: ${shapes.join("; ")}` : ""}.`;
    }
    case "timeline": {
      const lanes = s.lanes
        .map((l) => {
          const st = s.laneStatus[l.id] ?? "unvisited";
          const ann = s.annotations[l.id];
          return `${l.label ?? l.id} (${st}${ann ? `, ${ann}` : ""})`;
        })
        .join("; ");
      const name = (id: string) => s.lanes.find((l) => l.id === id)?.label ?? id;
      const flying = s.messages.filter((m) => m.received === null);
      const recent = s.messages.filter((m) => m.received === s.now || m.sent === s.now);
      const show = (m: (typeof s.messages)[number]) =>
        `${m.label ?? "message"} ${name(m.from)} → ${name(m.to)}${m.lost ? " (lost)" : ""}`;
      const marks = s.marks
        .filter((m) => m.time === s.now)
        .map((m) => `${name(m.lane)}: ${m.label}`);
      return `${label} (timeline) at time ${s.now} — ${lanes}. ${s.messages.length} messages so far${flying.length ? `; in flight: ${flying.map(show).join(", ")}` : ""}${recent.length ? `; now: ${recent.map(show).join(", ")}` : ""}${marks.length ? `; events: ${marks.join(", ")}` : ""}.`;
    }
    case "grid":
      return `${label}: ${s.rows}×${s.cols} table; rows ${s.cells.map((r) => `[${r.map((c) => (c === null ? "·" : String(c))).join(" ")}]`).join(" ")}.`;
  }
}

export function describeState(state: TraceState): string {
  return state.order.map((name) => describeStructure(name, state.structures[name]!)).join(" ");
}
