import type { ArrayStructure, NodeStatus, TreeStructure } from "@/engine/protocol";
import type { Focus } from "@/engine/state";

/**
 * How many leading elements form the heap: the longest prefix with no "sorted" mark
 * and no empty (null) slot, so a heap can grow and shrink inside a fixed array.
 */
export const heapSize = (a: ArrayStructure) => {
  const k = a.values.findIndex((v, i) => v === null || a.marks[i] === "sorted");
  return k === -1 ? a.values.length : k;
};

/**
 * The array's heap prefix as a binary tree (children of i at 2i + 1 and 2i + 2), with
 * the array's pointers as node annotations and its focus mapped onto the nodes. It is
 * derived from the array on every render, so the two views can never disagree.
 */
export function heapTree(
  a: ArrayStructure,
  focus: Focus[],
  name: string,
  treeName: string,
): { tree: TreeStructure; focus: Focus[] } {
  const k = heapSize(a);
  const id = (i: number) => `h${i}`;
  const nodes: TreeStructure["nodes"] = {};
  const nodeStatus: Record<string, NodeStatus> = {};
  for (let i = 0; i < k; i++) {
    nodes[id(i)] = {
      value: a.values[i]!,
      children: [2 * i + 1 < k ? id(2 * i + 1) : null, 2 * i + 2 < k ? id(2 * i + 2) : null],
    };
    nodeStatus[id(i)] = "unvisited";
  }
  const annotations: Record<string, string> = {};
  for (const [p, i] of Object.entries(a.pointers))
    if (i >= 0 && i < k)
      annotations[id(i)] = annotations[id(i)] ? `${annotations[id(i)]}, ${p}` : p;
  const mapped = focus
    .filter((f) => f.s === name && f.indices)
    .map((f) => ({
      s: treeName,
      tone: f.tone,
      nodes: f.indices!.filter((i) => i < k).map(id),
    }));
  return {
    tree: {
      kind: "tree",
      label: "The same array as a heap",
      binary: true,
      root: k > 0 ? id(0) : null,
      nodes,
      nodeStatus,
      annotations,
    },
    focus: mapped,
  };
}
