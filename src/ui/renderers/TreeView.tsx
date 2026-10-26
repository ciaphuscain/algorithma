import type { TreeStructure } from "@/engine/protocol";
import type { Focus } from "@/engine/state";
import { layoutTree } from "./tree-layout";

const SLOT = 52;
const LEVEL = 74;
const R = 18;

/** Long enough for a B-tree node of five two-digit keys ("35·45·55·65·75"). */
const MAX_LABEL = 16;
/** Values of up to 3 characters sit in a circle; longer ones get a pill that fits them. */
const label = (v: unknown) => {
  const s = v === null ? "" : String(v);
  return s.length > MAX_LABEL ? `${s.slice(0, MAX_LABEL - 1)}…` : s;
};
const nodeWidth = (text: string) => (text.length <= 3 ? 2 * R : text.length * 8 + 16);

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
  const labels = new Map([...pos.keys()].map((id) => [id, label(structure.nodes[id]!.value)]));
  const slot = Math.max(SLOT, ...[...labels.values()].map((s) => nodeWidth(s) + 12));
  const width = Math.max(760, columns * slot + 40);
  const offset = (width - columns * slot) / 2 + slot / 2;
  const height = depth * LEVEL + 30;
  const px = (x: number) => offset + x * slot;
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
        const text = labels.get(id)!;
        const w = nodeWidth(text);
        const [cx, cy] = [px(p.x), py(p.y)];
        return (
          <g
            key={id}
            className={`g-node g-node--${status}${tone ? " g-node--focus" : ""}`}
            data-node={id}
          >
            {status === "highlight" &&
              (w === 2 * R ? (
                <circle className="g-node__ring" cx={cx} cy={cy} r={R + 5} />
              ) : (
                <rect
                  className="g-node__ring"
                  x={cx - w / 2 - 5}
                  y={cy - R - 5}
                  width={w + 10}
                  height={2 * R + 10}
                  rx={R + 5}
                />
              ))}
            {w === 2 * R ? (
              <circle cx={cx} cy={cy} r={R} />
            ) : (
              <rect x={cx - w / 2} y={cy - R} width={w} height={2 * R} rx={R} />
            )}
            <text
              className="g-node__label"
              x={px(p.x)}
              y={py(p.y) + 5}
              textAnchor="middle"
              style={{ fontSize: 13 }}
            >
              {text}
            </text>
            {ann && (
              <text className="g-node__ann" x={px(p.x)} y={py(p.y) + R + 14} textAnchor="middle">
                {ann}
              </text>
            )}
            {tone === "compare" && compareValue !== undefined && (
              <text
                className="focus-label focus-label--compare"
                x={cx + w / 2 + 4}
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
