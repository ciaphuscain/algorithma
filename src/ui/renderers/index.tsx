import type { Structure } from "@/engine/protocol";
import type { Focus } from "@/engine/state";
import { ArrayView } from "./ArrayView";
import { GraphLegend, GraphView } from "./GraphView";
import { GridView } from "./GridView";
import { SequenceView } from "./SequenceView";

/**
 * Renderer selection by structure kind. This is the whole contract between traces and
 * visuals: any trace whose structures validate is drawable, with no knowledge of
 * which algorithm produced it. Adding a structure kind means adding a protocol type,
 * reducer cases and one renderer here — never editing per-algorithm code.
 */
export function StructureView({
  name,
  structure,
  focus,
}: {
  name: string;
  structure: Structure;
  focus: Focus[];
}) {
  switch (structure.kind) {
    case "array":
      return <ArrayView name={name} structure={structure} focus={focus} />;
    case "graph":
      return (
        <>
          <GraphView name={name} structure={structure} focus={focus} />
          <GraphLegend />
        </>
      );
    case "sequence":
      return <SequenceView structure={structure} />;
    case "grid":
      return <GridView name={name} structure={structure} focus={focus} />;
  }
}

const KIND_LABEL: Record<Structure["kind"], string> = {
  array: "array",
  graph: "graph",
  sequence: "",
  grid: "table",
};

export function StructurePanel({
  name,
  structure,
  focus,
}: {
  name: string;
  structure: Structure;
  focus: Focus[];
}) {
  const kind = structure.kind === "sequence" ? structure.discipline : KIND_LABEL[structure.kind];
  return (
    <section className="structure" data-structure={name} data-kind={structure.kind}>
      <div className="structure__label">
        {structure.label ?? name} <span>{kind}</span>
      </div>
      <StructureView name={name} structure={structure} focus={focus} />
    </section>
  );
}
