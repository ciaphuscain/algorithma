"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

export interface ChartSeries {
  id: string;
  label: string;
  /** Categorical slot 1–4; colours come from the validated --series-N tokens. */
  slot: 1 | 2 | 3 | 4;
  points: { x: number; y: number }[];
}

interface Props {
  series: ChartSeries[];
  xLabel: string;
  yLabel: string;
  yScale: "linear" | "log";
  formatY: (v: number) => string;
  /** Accessible summary of what the chart shows. */
  summary: string;
}

const W = 760;
const H = 360;
const M = { top: 16, right: 132, bottom: 48, left: 64 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

/** Secondary encoding: every series also has its own marker shape. */
export function Marker({
  slot,
  x,
  y,
  size = 5,
}: {
  slot: number;
  x: number;
  y: number;
  size?: number;
}) {
  const fill = `var(--series-${slot})`;
  switch (slot) {
    case 1:
      return <circle className="chart__marker" cx={x} cy={y} r={size} fill={fill} />;
    case 2:
      return (
        <rect
          className="chart__marker"
          x={x - size}
          y={y - size}
          width={size * 2}
          height={size * 2}
          rx={1.5}
          fill={fill}
        />
      );
    case 3:
      return (
        <path
          className="chart__marker"
          d={`M${x},${y - size * 1.2} L${x + size * 1.1},${y + size * 0.9} L${x - size * 1.1},${y + size * 0.9} Z`}
          fill={fill}
        />
      );
    default:
      return (
        <path
          className="chart__marker"
          d={`M${x},${y - size * 1.25} L${x + size * 1.25},${y} L${x},${y + size * 1.25} L${x - size * 1.25},${y} Z`}
          fill={fill}
        />
      );
  }
}

function niceLinearTicks(max: number): number[] {
  if (max <= 0) return [0, 1];
  const rough = max / 5;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough)!;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 1e-9; v += step) ticks.push(v);
  if (ticks.at(-1)! < max) ticks.push(ticks.at(-1)! + step);
  return ticks;
}

export function compact(v: number): string {
  if (v >= 1e6) return `${+(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)}M`;
  if (v >= 1e3) return `${+(v / 1e3).toFixed(v >= 1e4 ? 0 : 1)}K`;
  return String(+v.toFixed(v < 10 && v % 1 ? 2 : 0));
}

export function LineChart({ series, xLabel, yLabel, yScale, formatY, summary }: Props) {
  const uid = useId();
  const [hover, setHover] = useState<number | null>(null);
  const xs = [...new Set(series.flatMap((s) => s.points.map((p) => p.x)))].sort((a, b) => a - b);
  const ys = series.flatMap((s) => s.points.map((p) => p.y));
  if (xs.length === 0) return null;

  // x: sizes double each step, so a log₂ axis spaces them evenly.
  const lx = (x: number) => Math.log2(x);
  const [x0, x1] = [lx(xs[0]!), lx(xs.at(-1)!)];
  const sx = (x: number) => M.left + (x1 === x0 ? PW / 2 : ((lx(x) - x0) / (x1 - x0)) * PW);

  let yTicks: number[];
  let sy: (y: number) => number;
  if (yScale === "log") {
    const positive = ys.filter((y) => y > 0);
    const lo = Math.floor(Math.log10(Math.min(...positive, 1)));
    const hi = Math.ceil(Math.log10(Math.max(...positive, 10)));
    yTicks = Array.from({ length: hi - lo + 1 }, (_, i) => 10 ** (lo + i));
    // Zero cannot be shown on a log axis; it is pinned to the baseline.
    sy = (y) => M.top + PH - ((Math.log10(Math.max(y, 10 ** lo)) - lo) / (hi - lo || 1)) * PH;
  } else {
    yTicks = niceLinearTicks(Math.max(...ys, 0));
    const top = yTicks.at(-1)!;
    sy = (y) => M.top + PH - (y / top) * PH;
  }

  // End labels: sorted by position; separated with leader lines when they would collide.
  const ends = series
    .filter((s) => s.points.length > 0)
    .map((s) => {
      const last = s.points.at(-1)!;
      return { s, px: sx(last.x), py: sy(last.y), ly: sy(last.y) };
    })
    .sort((a, b) => a.py - b.py);
  for (let i = 1; i < ends.length; i++) {
    if (ends[i]!.ly - ends[i - 1]!.ly < 15) ends[i]!.ly = ends[i - 1]!.ly + 15;
  }

  const pickIndex = (clientX: number, rect: DOMRect) => {
    const x = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    xs.forEach((v, i) => {
      if (Math.abs(sx(v) - x) < Math.abs(sx(xs[best]!) - x)) best = i;
    });
    return best;
  };
  const onPointer = (e: PointerEvent<SVGRectElement>) =>
    setHover(pickIndex(e.clientX, e.currentTarget.ownerSVGElement!.getBoundingClientRect()));
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") setHover((h) => Math.min((h ?? -1) + 1, xs.length - 1));
    else if (e.key === "ArrowLeft") setHover((h) => Math.max((h ?? xs.length) - 1, 0));
    else if (e.key === "Escape") setHover(null);
    else return;
    e.preventDefault();
  };

  const hx = hover === null ? null : xs[hover]!;
  const rows =
    hx === null
      ? []
      : series
          .map((s) => ({ s, p: s.points.find((p) => p.x === hx) }))
          .filter((r): r is { s: ChartSeries; p: { x: number; y: number } } => r.p !== undefined)
          .sort((a, b) => b.p.y - a.p.y);

  return (
    <div
      className="chart"
      tabIndex={0}
      role="group"
      aria-label={summary}
      aria-describedby={`${uid}-hint`}
      onKeyDown={onKey}
      onBlur={() => setHover(null)}
    >
      <ul className="chart-legend" aria-label="Legend">
        {series.map((s) => (
          <li key={s.id}>
            <svg viewBox="0 0 24 12" aria-hidden="true">
              <line
                x1="0"
                y1="6"
                x2="24"
                y2="6"
                stroke={`var(--series-${s.slot})`}
                strokeWidth="2"
              />
              <Marker slot={s.slot} x={12} y={6} size={3.5} />
            </svg>
            {s.label}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {yTicks.map((t) => (
          <g key={t}>
            <line className="chart__grid" x1={M.left} x2={M.left + PW} y1={sy(t)} y2={sy(t)} />
            <text className="chart__tick" x={M.left - 8} y={sy(t) + 4} textAnchor="end">
              {compact(t)}
            </text>
          </g>
        ))}
        <line
          className="chart__axis"
          x1={M.left}
          x2={M.left + PW}
          y1={M.top + PH}
          y2={M.top + PH}
        />
        {xs.map((x) => (
          <text key={x} className="chart__tick" x={sx(x)} y={M.top + PH + 18} textAnchor="middle">
            {x}
          </text>
        ))}
        <text className="chart__axis-label" x={M.left + PW / 2} y={H - 6} textAnchor="middle">
          {xLabel}
        </text>
        <text
          className="chart__axis-label"
          x={14}
          y={M.top + PH / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${M.top + PH / 2})`}
        >
          {yLabel}
        </text>
        {hx !== null && (
          <line className="chart__crosshair" x1={sx(hx)} x2={sx(hx)} y1={M.top} y2={M.top + PH} />
        )}
        {series.map((s) => (
          <g key={s.id}>
            <path
              className="chart__line"
              stroke={`var(--series-${s.slot})`}
              d={s.points
                .map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`)
                .join(" ")}
            />
            {s.points.map((p) => (
              <Marker key={p.x} slot={s.slot} x={sx(p.x)} y={sy(p.y)} size={p.x === hx ? 6 : 4.5} />
            ))}
          </g>
        ))}
        {ends.map(({ s, px, py, ly }) => (
          <g key={s.id}>
            {Math.abs(ly - py) > 1 && (
              <line className="chart__leader" x1={px + 6} y1={py} x2={px + 14} y2={ly} />
            )}
            <text className="chart__end-label" x={px + 16} y={ly + 4}>
              {s.label}
            </text>
          </g>
        ))}
        <rect
          x={M.left}
          y={M.top}
          width={PW}
          height={PH}
          fill="transparent"
          onPointerMove={onPointer}
          onPointerLeave={() => setHover(null)}
        />
      </svg>
      <p id={`${uid}-hint`} className="sr-only">
        Use the left and right arrow keys to read values at each input size.
      </p>
      <div aria-live="polite" className="sr-only">
        {hx !== null &&
          `${xLabel} ${hx}: ${rows.map((r) => `${r.s.label} ${formatY(r.p.y)}`).join(", ")}`}
      </div>
      {hx !== null && rows.length > 0 && (
        <div
          className="chart__tooltip"
          style={{
            left: `${(sx(hx) / W) * 100}%`,
            top: 40,
            transform: sx(hx) > W * 0.6 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
          }}
          aria-hidden="true"
        >
          <div className="chart__tooltip-title">
            {xLabel} = {hx}
          </div>
          {rows.map(({ s, p }) => (
            <div key={s.id} className="chart__tooltip-row">
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <Marker slot={s.slot} x={6} y={6} size={4} />
              </svg>
              <span>{s.label}</span>
              <span>{formatY(p.y)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
