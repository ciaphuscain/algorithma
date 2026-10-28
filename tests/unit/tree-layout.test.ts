import { describe, expect, it } from "vitest";
import { emptyTree, treeAdd } from "@/engine/tree";
import { layoutTree } from "@/ui/renderers/tree-layout";

describe("tree layout", () => {
  it("places binary-tree nodes by in-order position, so a BST reads in sorted order", () => {
    const t = emptyTree(true);
    treeAdd(t, "8", 8, null);
    treeAdd(t, "3", 3, "8", 0);
    treeAdd(t, "10", 10, "8", 1);
    treeAdd(t, "6", 6, "3", 1);
    const { pos, columns, depth } = layoutTree(t);
    expect(columns).toBe(4);
    expect(depth).toBe(3);
    const byX = [...pos.entries()].sort((a, b) => a[1].x - b[1].x).map(([id]) => Number(id));
    expect(byX).toEqual([3, 6, 8, 10]);
    expect(pos.get("6")).toEqual({ x: 1, y: 2 });
  });

  it("centres general-tree parents over their children", () => {
    const t = emptyTree(false);
    treeAdd(t, "r", "", null);
    for (const c of ["a", "b", "c"]) treeAdd(t, c, c, "r");
    const { pos } = layoutTree(t);
    expect(pos.get("r")!.x).toBe(1);
    expect([pos.get("a")!.x, pos.get("c")!.x]).toEqual([0, 2]);
  });

  it("lays out an empty tree as nothing", () => {
    expect(layoutTree(emptyTree(true))).toEqual({ pos: new Map(), columns: 0, depth: 0 });
  });
});
