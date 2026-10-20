import type { SequenceStructure } from "@/engine/protocol";

const ENDS: Record<SequenceStructure["discipline"], [string, string]> = {
  queue: ["front", "back"],
  stack: ["bottom", "top"],
  priority: ["", ""],
};

export function SequenceView({ structure }: { structure: SequenceStructure }) {
  const [left, right] = ENDS[structure.discipline];
  if (structure.items.length === 0) {
    return (
      <div className="seq">
        <span className="seq__empty">empty</span>
      </div>
    );
  }
  return (
    <div className="seq">
      {left && (
        <span className="seq__end" aria-hidden="true">
          {left} →
        </span>
      )}
      <span
        role="list"
        aria-label={`${structure.label ?? structure.discipline}${left ? `, ${left} to ${right}` : ""}`}
        style={{ display: "contents" }}
      >
        {structure.items.map((item, i) => (
          <span className="seq__item" role="listitem" key={i}>
            {String(item)}
          </span>
        ))}
      </span>
      {right && (
        <span className="seq__end" aria-hidden="true">
          ← {right}
        </span>
      )}
    </div>
  );
}
