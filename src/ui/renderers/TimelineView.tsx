import { useId, useState } from "react";
import { EDGE_STATUSES, type TimelineStructure } from "@/engine/protocol";
import type { Focus } from "@/engine/state";
import { niceStep } from "./PlaneView";

const W = 800;
const LABEL_W = 176;
const TOP = 28;
const LANE_H = 50;
const R = 7;
/** Messages that ended more than this many time units ago are faded (or hidden). */
const RECENT = 12;
/** Offer to hide old messages once a timeline holds this many. */
const BUSY = 40;

/**
 * Processes as horizontal lanes and time running left to right. Messages are arrows
 * from (sent, sender) to (delivered, receiver); in-flight ones end at the current time
 * halfway to their receiver, lost ones end in a cross.
 */
export function TimelineView({
  name,
  structure,
  focus,
}: {
  name: string;
  structure: TimelineStructure;
  focus: Focus[];
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const s = structure;
  const lastEvent = Math.max(
    0,
    ...s.messages.map((m) => m.received ?? m.sent),
    ...s.marks.map((m) => m.time),
  );
  const horizon = Math.max(s.horizon ?? 0, s.now, lastEvent) + 1;
  const left = LABEL_W + 12;
  const span = W - left - 16;
  const x = (t: number) => left + (t / horizon) * span;
  const row = new Map(s.lanes.map((l, i) => [l.id, TOP + 16 + i * LANE_H]));
  const y = (lane: string) => row.get(lane)!;
  const H = TOP + 16 + (s.lanes.length - 1) * LANE_H + 28;
  const focusLanes = new Set<string>();
  const focusMessages = new Set<string>();
  for (const f of focus) {
    if (f.s !== name) continue;
    f.nodes?.forEach((n) => focusLanes.add(n));
    f.edges?.forEach((e) => focusMessages.add(e));
  }
  const step = niceStep(horizon);
  const ticks: number[] = [];
  for (let t = 0; t <= horizon; t += step) ticks.push(Number(t.toPrecision(12)));
  const labelled = (m: (typeof s.messages)[number]) =>
    m.label !== undefined && (m.received === null || m.sent === s.now || m.received === s.now);
  const [recentOnly, setRecentOnly] = useState(false);
  const old = (m: (typeof s.messages)[number]) => (m.received ?? s.now) < s.now - RECENT;
  // The filter applies only while its checkbox is on screen, so stepping back to a
  // quieter moment never hides messages without a visible control.
  const busy = s.messages.length >= BUSY;
  const shown = busy && recentOnly ? s.messages.filter((m) => !old(m)) : s.messages;

  return (
    <>
      {busy && (
        <label className="check tl-toggle">
          <input
            type="checkbox"
            checked={recentOnly}
            onChange={(e) => setRecentOnly(e.target.checked)}
          />
          Show only messages from the last {RECENT} time units
        </label>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Timeline ${s.label ?? name}`}>
        <defs>
          {EDGE_STATUSES.map((st) => (
            <marker
              key={st}
              id={`${uid}-arrow-${st}`}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerUnits="userSpaceOnUse"
              markerWidth="9"
              markerHeight="9"
              orient="auto-start-reverse"
            >
              <path
                d="M0,0 L10,5 L0,10 z"
                className={`g-arrow g-edge--${st}`}
                style={{ strokeWidth: 0 }}
              />
            </marker>
          ))}
        </defs>
        <g className="p-grid" aria-hidden="true">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={TOP} y2={H - 12} />
              <text className="p-tick" x={x(t)} y={TOP - 8} textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
        </g>
        <line className="tl-now" x1={x(s.now)} x2={x(s.now)} y1={TOP - 4} y2={H - 8} />
        {s.lanes.map((l) => {
          const status = s.laneStatus[l.id] ?? "unvisited";
          const ann = s.annotations[l.id];
          return (
            <g key={l.id}>
              <line
                className={`tl-lane tl-lane--${status}`}
                x1={x(0)}
                x2={x(horizon)}
                y1={y(l.id)}
                y2={y(l.id)}
              />
              <g
                className={`g-node g-node--${status}${focusLanes.has(l.id) ? " g-node--focus" : ""}`}
              >
                {status === "highlight" && (
                  <circle className="g-node__ring" cx={LABEL_W - 4} cy={y(l.id)} r={R + 4} />
                )}
                <circle cx={LABEL_W - 4} cy={y(l.id)} r={R} />
              </g>
              <text className="tl-label" x={6} y={y(l.id) - 2}>
                {l.label ?? l.id}
              </text>
              {ann && (
                <text className="tl-ann" x={6} y={y(l.id) + 14}>
                  {ann}
                </text>
              )}
            </g>
          );
        })}
        {shown.map((m) => {
          const [x1, y1] = [x(m.sent), y(m.from)];
          const flying = m.received === null;
          const end = flying ? s.now : m.received!;
          const half = m.lost || flying;
          const x2 = x(end);
          const y2 = half ? (y(m.from) + y(m.to)) / 2 : y(m.to) + (y(m.to) > y1 ? -R : R);
          const focused = focusMessages.has(m.id);
          const faded = old(m) && !focused;
          return (
            <g key={m.id} className={faded ? "tl-old" : undefined}>
              <line
                className={`g-edge tl-msg g-edge--${m.status}${flying ? " tl-flight" : ""}${focused ? " tl-focus" : ""}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                markerEnd={m.lost ? undefined : `url(#${uid}-arrow-${m.status})`}
              />
              {m.lost && (
                <path
                  className="tl-lost"
                  d={`M${x2 - 5},${y2 - 5} L${x2 + 5},${y2 + 5} M${x2 - 5},${y2 + 5} L${x2 + 5},${y2 - 5}`}
                />
              )}
              {labelled(m) && (
                <text
                  className="p-label"
                  x={x1 + (x2 - x1) * 0.55 + 4}
                  y={y1 + (y2 - y1) * 0.55 - 4}
                >
                  {m.label}
                </text>
              )}
            </g>
          );
        })}
        {s.marks.map((m, k) => {
          const [cx, cy] = [x(m.time), y(m.lane)];
          // Alternate label heights so marks close together on one lane stay readable.
          const nth = s.marks.slice(0, k).filter((o) => o.lane === m.lane).length;
          return (
            <g key={m.id} className="tl-mark">
              <path d={`M${cx},${cy - 6} L${cx + 6},${cy} L${cx},${cy + 6} L${cx - 6},${cy} z`} />
              <text className="p-label" x={cx} y={cy - 10 - (nth % 2) * 12} textAnchor="middle">
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
}
