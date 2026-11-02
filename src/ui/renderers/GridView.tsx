import type { GridStructure } from "@/engine/protocol";
import type { Focus } from "@/engine/state";

export function GridView({
  name,
  structure,
  focus,
}: {
  name: string;
  structure: GridStructure;
  focus: Focus[];
}) {
  const tone = new Map<string, string>();
  for (const f of focus) {
    if (f.s !== name) continue;
    for (const [r, c] of f.cells ?? []) tone.set(`${r},${c}`, f.tone);
  }
  return (
    <div className="table-wrap">
      <table className="grid-view" aria-label={`Table ${structure.label ?? name}`}>
        {structure.colHeaders && (
          <thead>
            <tr>
              {structure.rowHeaders && <td aria-hidden="true" />}
              {structure.colHeaders.map((h, c) => (
                <th key={c} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {structure.cells.map((row, r) => (
            <tr key={r}>
              {structure.rowHeaders && <th scope="row">{structure.rowHeaders[r]}</th>}
              {row.map((cell, c) => {
                const mark = structure.marks[r]?.[c];
                const t = tone.get(`${r},${c}`);
                const cls = [mark ? `cell--${mark}` : "", t ? `cell--focus-${t}` : ""]
                  .join(" ")
                  .trim();
                return (
                  <td key={c} className={cls || undefined}>
                    {cell === null ? "" : String(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
