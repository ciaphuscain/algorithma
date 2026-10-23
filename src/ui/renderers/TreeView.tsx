import type { TreeStructure } from "@/engine/protocol";
import type { Focus } from "@/engine/state";
import { layoutTree } from "./tree-layout";

const SLOT = 52;
const LEVEL = 74;
const R = 18;

const short = (v: unknown) => {
  const s = v === null ? "" : String(v);
  return s.length > 5 ? `${s.slice(0, 4)}…` : s;
};

export function TreeView({
  name,
  structure,
  focus,
}: {
  name: string;
  structure: TreeStructure;
  focus: Focus[];
}) {
  const { pos, columns, depth } = layoutTree(structure);
  const focusNodes = new Map<string, string>();
  let compareValue: unknown;
  for (const f of focus) {
    if (f.s !== name) continue;
    f.nodes?.forEach((n) => focusNodes.set(n, f.tone));
    if (f.value !== undefined) compareValue = f.value;
  }
  if (structure.root === null) {
    return (
      <p className="seq__empty" style={{ margin: "8px 0" }}>
        empty tree
      </p>
    );
  }
  const width = Math.max(760, columns * SLOT + 40);
  const offset = (width - columns * SLOT) / 2 + SLOT / 2;
  const height = depth * LEVEL + 30;
  const px = (x: number) => offset + x * SLOT;
  const py = (y: number) => 30 + y * LEVEL;

  const edges: { from: string; to: string; label?: string }[] = [];
  for (const [id, data] of Object.entries(structure.nodes)) {
    for (const c of data.children) {
      if (c !== null && pos.has(id) && pos.has(c)) {
        edges.push({
          from: id,
          to: c,
          ...(structure.nodes[c]!.edgeLabel !== undefined
            ? { label: structure.nodes[c]!.edgeLabel }
            : {}),
        });
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Tree ${structure.label ?? name}`}
    >
      {edges.map(({ from, to, label }) => {
        const a = pos.get(from)!;
        const b = pos.get(to)!;
        const [x1, y1, x2, y2] = [px(a.x), py(a.y), px(b.x), py(b.y)];
        return (
          <g key={`${from}-${to}`}>
            <line className="g-edge" x1={x1} y1={y1 + R} x2={x2} y2={y2 - R} />
            {label !== undefined && (
              <text
                className="g-weight"
                x={(x1 + x2) / 2 + (x2 >= x1 ? 8 : -8)}
                y={(y1 + y2) / 2 + 4}
                textAnchor="middle"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
      {[...pos.entries()].map(([id, p]) => {
        const status = structure.nodeStatus[id] ?? "unvisited";
        const tone = focusNodes.get(id);
        const ann = structure.annotations[id];
        return (
          <g
            key={id}
            className={`g-node g-node--${status}${tone ? " g-node--focus" : ""}`}
            data-node={id}
          >
            {status === "highlight" && (
              <circle className="g-node__ring" cx={px(p.x)} cy={py(p.y)} r={R + 5} />
            )}
            <circle cx={px(p.x)} cy={py(p.y)} r={R} />
            <text
              className="g-node__label"
              x={px(p.x)}
              y={py(p.y) + 5}
              textAnchor="middle"
              style={{ fontSize: 13 }}
            >
              {short(structure.nodes[id]!.value)}
            </text>
            {ann && (
              <text className="g-node__ann" x={px(p.x)} y={py(p.y) + R + 14} textAnchor="middle">
                {ann}
              </text>
            )}
            {tone === "compare" && compareValue !== undefined && (
              <text
                className="focus-label focus-label--compare"
                x={px(p.x) + R + 4}
                y={py(p.y) - R + 2}
              >
                vs {String(compareValue)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
