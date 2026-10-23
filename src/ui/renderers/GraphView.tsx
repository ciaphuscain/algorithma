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
  "highlight",
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
            {status === "highlight" && (
              <circle className="g-node__ring" cx={p.x} cy={p.y} r={R + 5} />
            )}
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

const NODE_LEGEND: Record<string, string> = {
  unvisited: "not reached",
  frontier: "waiting (dashed)",
  current: "current",
  visited: "done",
  path: "on path",
  unreachable: "unreachable (dotted)",
  highlight: "highlighted (double ring)",
};
const EDGE_LEGEND: Record<string, string> = {
  examining: "being examined",
  tree: "tree / chosen edge",
  relaxed: "improved",
  rejected: "discarded (dotted)",
  path: "path",
  back: "back edge (dashed)",
  highlight: "highlighted (long dashes)",
};

/** Geometry wording for the same statuses: points are considered, kept or discarded. */
const POINT_LEGEND: Record<string, string> = {
  unvisited: "not yet considered",
  frontier: "candidate (dashed)",
  current: "current",
  visited: "considered",
  path: "in the answer",
  unreachable: "discarded (dotted)",
  highlight: "highlighted (double ring)",
};
const SHAPE_LEGEND: Record<string, string> = {
  idle: "drawn",
  examining: "being examined",
  tree: "kept",
  relaxed: "improved",
  rejected: "discarded (dotted)",
  path: "in the answer",
  back: "dashed",
  highlight: "highlighted (long dashes)",
};

/**
 * Legend for the statuses that occur anywhere in this trace, with wording that does
 * not assume a particular algorithm.
 */
export function GraphLegend({
  nodeStatuses,
  edgeStatuses,
  plane = false,
}: {
  nodeStatuses: string[];
  edgeStatuses: string[];
  /** Use point and shape wording. */
  plane?: boolean;
}) {
  const nodeWords = plane ? POINT_LEGEND : NODE_LEGEND;
  const edgeWords = plane ? SHAPE_LEGEND : EDGE_LEGEND;
  return (
    <div className="legend" aria-label={plane ? "Plane legend" : "Graph legend"}>
      {nodeStatuses
        .filter((s) => nodeWords[s])
        .map((s) => (
          <span className="legend__item" key={`n-${s}`}>
            <svg viewBox="0 0 22 14" aria-hidden="true">
              <g className={`g-node g-node--${s}`}>
                {s === "highlight" && <circle className="g-node__ring" cx="11" cy="7" r="6.5" />}
                <circle cx="11" cy="7" r={s === "highlight" ? 4 : 5.5} />
              </g>
            </svg>
            {nodeWords[s]}
          </span>
        ))}
      {edgeStatuses
        .filter((s) => edgeWords[s])
        .map((s) => (
          <span className="legend__item" key={`e-${s}`}>
            <svg viewBox="0 0 22 14" aria-hidden="true">
              <line className={`g-edge g-edge--${s}`} x1="1" y1="7" x2="21" y2="7" />
            </svg>
            {edgeWords[s]}
          </span>
        ))}
    </div>
  );
}
