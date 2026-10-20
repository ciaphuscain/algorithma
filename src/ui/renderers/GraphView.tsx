import { useId } from "react";
import type { EdgeStatus, GraphStructure } from "@/engine/protocol";
import type { Focus } from "@/engine/state";

const W = 800;
const H = 480;
const R = 20;
const ARROW_STATUSES: EdgeStatus[] = [
  "idle",
  "examining",
  "tree",
  "relaxed",
  "rejected",
  "path",
  "back",
];

export function GraphView({
  name,
  structure,
  focus,
}: {
  name: string;
  structure: GraphStructure;
  focus: Focus[];
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pos = new Map(
    structure.nodes.map((n) => [n.id, { x: 40 + n.x * (W - 80), y: 30 + n.y * (H - 70) }]),
  );
  const focusNodes = new Set<string>();
  const focusEdges = new Set<string>();
  for (const f of focus) {
    if (f.s !== name) continue;
    f.nodes?.forEach((n) => focusNodes.add(n));
    f.edges?.forEach((e) => focusEdges.add(e));
  }
  // Draw idle edges first so highlighted ones sit on top.
  const edges = [...structure.edges].sort(
    (a, b) =>
      Number(structure.edgeStatus[a.id] !== "idle") - Number(structure.edgeStatus[b.id] !== "idle"),
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Graph ${structure.label ?? name}`}>
      {structure.directed && (
        <defs>
          {ARROW_STATUSES.map((s) => (
            <marker
              key={s}
              id={`${uid}-arrow-${s}`}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                d="M0,0 L10,5 L0,10 z"
                className={`g-arrow g-edge--${s}`}
                style={{ strokeWidth: 0 }}
              />
            </marker>
          ))}
        </defs>
      )}
      {edges.map((e) => {
        const a = pos.get(e.from)!;
        const b = pos.get(e.to)!;
        const status = structure.edgeStatus[e.id] ?? "idle";
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const x1 = a.x + ux * R;
        const y1 = a.y + uy * R;
        const x2 = b.x - ux * (R + (structure.directed ? 3 : 0));
        const y2 = b.y - uy * (R + (structure.directed ? 3 : 0));
        // Offset weight labels perpendicular to the edge so they do not sit on the line.
        const mx = (a.x + b.x) / 2 - uy * 12;
        const my = (a.y + b.y) / 2 + ux * 12;
        return (
          <g key={e.id}>
            <line
              className={`g-edge g-edge--${status}${focusEdges.has(e.id) ? " g-edge--focus" : ""}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              markerEnd={structure.directed ? `url(#${uid}-arrow-${status})` : undefined}
            />
            {e.weight !== undefined && (
              <text className="g-weight" x={mx} y={my + 4} textAnchor="middle">
                {e.weight}
              </text>
            )}
          </g>
        );
      })}
      {structure.nodes.map((n) => {
        const p = pos.get(n.id)!;
        const status = structure.nodeStatus[n.id] ?? "unvisited";
        const ann = structure.annotations[n.id];
        return (
          <g
            key={n.id}
            className={`g-node g-node--${status}${focusNodes.has(n.id) ? " g-node--focus" : ""}`}
          >
            <circle cx={p.x} cy={p.y} r={R} />
            <text className="g-node__label" x={p.x} y={p.y + 5} textAnchor="middle">
              {n.label ?? n.id}
            </text>
            {ann && (
              <text className="g-node__ann" x={p.x} y={p.y + R + 15} textAnchor="middle">
                {ann}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function GraphLegend() {
  const node = (cls: string, label: string) => (
    <span className="legend__item" key={cls}>
      <svg viewBox="0 0 22 14" aria-hidden="true">
        <g className={`g-node g-node--${cls}`}>
          <circle cx="11" cy="7" r="5.5" />
        </g>
      </svg>
      {label}
    </span>
  );
  const edge = (cls: string, label: string) => (
    <span className="legend__item" key={cls}>
      <svg viewBox="0 0 22 14" aria-hidden="true">
        <line className={`g-edge g-edge--${cls}`} x1="1" y1="7" x2="21" y2="7" />
      </svg>
      {label}
    </span>
  );
  return (
    <div className="legend" aria-label="Graph legend">
      {node("unvisited", "unvisited")}
      {node("frontier", "in frontier (dashed)")}
      {node("current", "current")}
      {node("visited", "done")}
      {node("unreachable", "unreachable")}
      {edge("tree", "tree edge")}
      {edge("examining", "examining")}
      {edge("rejected", "skipped (dotted)")}
    </div>
  );
}
