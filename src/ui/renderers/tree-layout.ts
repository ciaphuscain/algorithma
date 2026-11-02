import type { TreeStructure } from "@/engine/protocol";

export interface TreeLayout {
  /** Column (x, in node slots) and depth (y) for every node reachable from the root. */
  pos: Map<string, { x: number; y: number }>;
  columns: number;
  depth: number;
}

/**
 * Deterministic tidy layout, recomputed for every state because trees change shape.
 * Binary trees use in-order position for x, so a BST reads left to right in sorted
 * order; general trees centre each parent over its children.
 */
export function layoutTree(t: TreeStructure): TreeLayout {
  const pos = new Map<string, { x: number; y: number }>();
  let column = 0;
  let depth = 0;
  const visit = (id: string, y: number): number => {
    depth = Math.max(depth, y + 1);
    const node = t.nodes[id]!;
    if (t.binary) {
      const [left, right] = node.children;
      if (left) visit(left, y + 1);
      const x = column++;
      pos.set(id, { x, y });
      if (right) visit(right, y + 1);
      return x;
    }
    const kids = node.children.filter((c): c is string => c !== null);
    if (kids.length === 0) {
      const x = column++;
      pos.set(id, { x, y });
      return x;
    }
    const xs = kids.map((c) => visit(c, y + 1));
    const x = (xs[0]! + xs[xs.length - 1]!) / 2;
    pos.set(id, { x, y });
    return x;
  };
  if (t.root !== null) visit(t.root, 0);
  return { pos, columns: column, depth };
}
