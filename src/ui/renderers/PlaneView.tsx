import { useId } from "react";
import type { PlaneShape, PlaneStructure } from "@/engine/protocol";
import type { Focus } from "@/engine/state";

const W = 800;
const H = 480;
const PAD = 34;
const R = 6;

/** A round step (1, 2 or 5 × 10ᵏ) giving about `target` grid lines across `span`. */
export function niceStep(span: number, target = 8): number {
  const raw = span / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

const ticks = (lo: number, hi: number, step: number) => {
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step)
    out.push(Number(v.toPrecision(12)));
  return out;
};

// Background boxes first, then circles, then segments, so lines stay visible.
const LAYER: Record<PlaneShape["kind"], number> = { rect: 0, circle: 1, segment: 2 };

/** Points in the plane with shapes over them, at one scale on both axes (y grows upwards). */
export function PlaneView({
  name,
  structure,
  focus,
}: {
  name: string;
  structure: PlaneStructure;
  focus: Focus[];
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { minX, minY, maxX, maxY } = structure.bounds;
  const scale = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / (maxY - minY));
  const ox = (W - (maxX - minX) * scale) / 2;
  const oy = (H - (maxY - minY) * scale) / 2;
  const px = (x: number) => ox + (x - minX) * scale;
  const py = (y: number) => H - oy - (y - minY) * scale;
  const focusPoints = new Set<string>();
  const focusShapes = new Set<string>();
  for (const f of focus) {
    if (f.s !== name) continue;
    f.nodes?.forEach((n) => focusPoints.add(n));
    f.edges?.forEach((e) => focusShapes.add(e));
  }
  const step = niceStep(Math.max(maxX - minX, maxY - minY));
  const shapes = structure.shapes
    .map((s, i) => ({ s, i }))
    .sort((a, b) => LAYER[a.s.kind] - LAYER[b.s.kind] || a.i - b.i)
    .map(({ s }) => s);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Plane ${structure.label ?? name}`}>
      <defs>
        <clipPath id={`${uid}-clip`}>
          <rect
            x={px(minX)}
            y={py(maxY)}
            width={px(maxX) - px(minX)}
            height={py(minY) - py(maxY)}
          />
        </clipPath>
      </defs>
      <g className="p-grid" aria-hidden="true">
        {ticks(minX, maxX, step).map((x) => (
          <g key={`x${x}`}>
            <line x1={px(x)} x2={px(x)} y1={py(minY)} y2={py(maxY)} />
            <text className="p-tick" x={px(x)} y={py(minY) + 14} textAnchor="middle">
              {x}
            </text>
          </g>
        ))}
        {ticks(minY, maxY, step).map((y) => (
          <g key={`y${y}`}>
            <line x1={px(minX)} x2={px(maxX)} y1={py(y)} y2={py(y)} />
            <text className="p-tick" x={px(minX) - 5} y={py(y) + 4} textAnchor="end">
              {y}
            </text>
          </g>
        ))}
        <rect
          className="p-frame"
          x={px(minX)}
          y={py(maxY)}
          width={px(maxX) - px(minX)}
          height={py(minY) - py(maxY)}
        />
      </g>
      <g clipPath={`url(#${uid}-clip)`}>
        {shapes.map((s) => {
          const focused = focusShapes.has(s.id) ? " p-shape--focus" : "";
          if (s.kind === "rect") {
            const [x0, x1] = [Math.min(s.x1, s.x2), Math.max(s.x1, s.x2)];
            const [y0, y1] = [Math.min(s.y1, s.y2), Math.max(s.y1, s.y2)];
            return (
              <rect
                key={s.id}
                className={`p-rect p-rect--${s.status}${focused}`}
                x={px(x0)}
                y={py(y1)}
                width={(x1 - x0) * scale}
                height={(y1 - y0) * scale}
              />
            );
          }
          if (s.kind === "circle") {
            return (
              <circle
                key={s.id}
                className={`p-circle p-circle--${s.status}${focused}`}
                cx={px(s.x)}
                cy={py(s.y)}
                r={s.r * scale}
              />
            );
          }
          return (
            <line
              key={s.id}
              className={`g-edge g-edge--${s.status}${focused ? " g-edge--focus" : ""}`}
              x1={px(s.x1)}
              y1={py(s.y1)}
              x2={px(s.x2)}
              y2={py(s.y2)}
            />
          );
        })}
      </g>
      {shapes.map((s) => {
        if (s.label === undefined) return null;
        const [x, y] =
          s.kind === "circle"
            ? [px(s.x), py(s.y) - s.r * scale - 6]
            : s.kind === "rect"
              ? [px(Math.min(s.x1, s.x2)) + 4, py(Math.max(s.y1, s.y2)) + 14]
              : [(px(s.x1) + px(s.x2)) / 2 + 6, (py(s.y1) + py(s.y2)) / 2 - 6];
        return (
          <text
            key={`l-${s.id}`}
            className="p-label"
            x={Math.max(4, Math.min(W - 4, x))}
            y={Math.max(12, Math.min(H - 4, y))}
            textAnchor={s.kind === "circle" ? "middle" : "start"}
          >
            {s.label}
          </text>
        );
      })}
      {structure.points.map((p) => {
        const status = structure.pointStatus[p.id] ?? "unvisited";
        const ann = structure.annotations[p.id];
        const [x, y] = [px(p.x), py(p.y)];
        return (
          <g
            key={p.id}
            className={`g-node p-point g-node--${status}${focusPoints.has(p.id) ? " g-node--focus" : ""}`}
          >
            {status === "highlight" && <circle className="g-node__ring" cx={x} cy={y} r={R + 4} />}
            <circle cx={x} cy={y} r={R} />
            <text className="p-point__label" x={x + R + 3} y={y - R - 1}>
              {p.label ?? p.id}
            </text>
            {ann && (
              <text className="g-node__ann" x={x} y={y + R + 15} textAnchor="middle">
                {ann}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
