import type { ArrayMark, ArrayStructure, FocusTone } from "@/engine/protocol";
import type { Focus } from "@/engine/state";

/** Non-colour cue for each persistent mark (WCAG 1.4.1). */
export const MARK_GLYPH: Record<ArrayMark, string> = {
  sorted: "✓",
  pivot: "P",
  found: "★",
  discarded: "×",
  active: "•",
  min: "m",
};

const FOCUS_WORD: Partial<Record<FocusTone, string>> = {
  compare: "cmp",
  swap: "swap",
  read: "read",
  write: "write",
};

export function ArrayView({
  name,
  structure,
  focus,
}: {
  name: string;
  structure: ArrayStructure;
  focus: Focus[];
}) {
  const values = structure.values;
  const n = values.length;
  const tone = new Map<number, FocusTone>();
  let compareValue: Focus["value"] | undefined;
  for (const f of focus) {
    if (f.s !== name) continue;
    for (const i of f.indices ?? []) tone.set(i, f.tone);
    if (f.value !== undefined) compareValue = f.value;
  }

  const numeric = values.every((v) => typeof v === "number");
  const asBars = numeric && structure.display !== "cells";
  // A fixed 760-unit coordinate space keeps text and bars the same size for every n;
  // small arrays are centred rather than stretched.
  const slot = Math.max(8, Math.min(56, 760 / Math.max(n, 1)));
  const width = Math.max(760, slot * n);
  const x0 = (width - slot * n) / 2;
  const showValues = slot >= 18;
  const showIndices = slot >= 14;
  const chartH = asBars ? 180 : 44;
  const top = 26; // room for focus labels
  const pointerRows = Object.keys(structure.pointers).length > 0 ? 2 : 0;
  const nums = values.map((v) => (typeof v === "number" ? v : 0));
  const maxV = Math.max(1, ...nums.map((v) => Math.max(v, 0)));
  const minV = Math.min(0, ...nums);
  // Labels of negative bars sit below the bar; keep them clear of the index row.
  const negativeLabels = asBars && showValues && minV < 0 ? 14 : 0;
  const height = top + chartH + negativeLabels + (showIndices ? 18 : 0) + 16 + pointerRows * 14 + 4;

  const span = maxV - minV || 1;
  const baseline = top + chartH * (maxV / span);

  // Group pointers by index so several names on one cell stack instead of overlapping.
  const pointersAt = new Map<number, string[]>();
  for (const [p, i] of Object.entries(structure.pointers))
    pointersAt.set(i, [...(pointersAt.get(i) ?? []), p]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Array ${structure.label ?? name}`}
      preserveAspectRatio="xMidYMin meet"
    >
      {values.map((v, i) => {
        const x = x0 + i * slot + slot * 0.1;
        const w = slot * 0.8;
        const t = tone.get(i);
        const mark = structure.marks[i];
        const cls = ["bar", mark ? `bar--${mark}` : "", t ? `bar--focus-${t}` : ""].join(" ");
        let y = top;
        let h = chartH;
        if (asBars) {
          const val = nums[i]!;
          const barH = Math.max(2, (Math.abs(val) / span) * chartH);
          y = val >= 0 ? baseline - barH : baseline;
          h = barH;
        }
        const below = top + chartH + negativeLabels;
        return (
          <g key={i}>
            <rect className={cls} x={x} y={y} width={w} height={h} rx={Math.min(4, w / 4)} />
            {showValues && (
              <text
                className="svg-text"
                x={x + w / 2}
                y={asBars ? (nums[i]! >= 0 ? y - 4 : y + h + 12) : top + chartH / 2 + 5}
                textAnchor="middle"
                fontSize={Math.min(14, slot * 0.38)}
              >
                {v === null ? "" : String(v)}
              </text>
            )}
            {t && FOCUS_WORD[t] && slot >= 24 && (
              <text
                className={`focus-label focus-label--${t}`}
                x={x + w / 2}
                y={11}
                textAnchor="middle"
              >
                {FOCUS_WORD[t]}
              </text>
            )}
            {showIndices && (
              <text
                className="svg-dim"
                x={x + w / 2}
                y={below + 14}
                textAnchor="middle"
                fontSize={10}
              >
                {i}
              </text>
            )}
            {mark && (
              <text
                className="svg-dim"
                x={x + w / 2}
                y={below + (showIndices ? 28 : 14)}
                textAnchor="middle"
                fontSize={11}
              >
                {MARK_GLYPH[mark]}
              </text>
            )}
            {pointersAt.has(i) && (
              <text
                className="svg-text"
                x={x + w / 2}
                y={below + (showIndices ? 42 : 28)}
                textAnchor="middle"
                fontSize={11}
              >
                ▲{pointersAt.get(i)!.join(",")}
              </text>
            )}
          </g>
        );
      })}
      {compareValue !== undefined && compareValue !== null && (
        <text className="focus-label focus-label--compare" x={width} y={11} textAnchor="end">
          vs {String(compareValue)}
        </text>
      )}
    </svg>
  );
}
