import { describe, expect, it } from "vitest";
import { TracePlayer } from "./player";
import type { Trace, TreeStructure } from "./protocol";
import { Tracer } from "./tracer";
import {
  checkTreeShape,
  emptyTree,
  inorder,
  treeAdd,
  treeMove,
  treeRemove,
  treeRotate,
  treeSplice,
} from "./tree";
import { validateTrace } from "./validate";

function bst(values: number[]): TreeStructure {
  const t = emptyTree(true);
  values.forEach((v, i) => {
    const id = `n${i}`;
    if (t.root === null) return treeAdd(t, id, v, null);
    let cur = t.root;
    for (;;) {
      const slot = v < (t.nodes[cur]!.value as number) ? 0 : 1;
      const next = t.nodes[cur]!.children[slot];
      if (next == null) return treeAdd(t, id, v, cur, slot);
      cur = next;
    }
  });
  return t;
}

describe("tree operations", () => {
  it("adds binary children into fixed left/right slots", () => {
    const t = bst([8, 3, 10, 1, 6, 14]);
    expect(inorder(t)).toEqual([1, 3, 6, 8, 10, 14]);
    expect(t.nodes.n0!.children).toEqual(["n1", "n2"]);
    expect(t.nodes.n2!.children).toEqual([null, "n5"]);
    expect(checkTreeShape(t)).toBeNull();
  });

  it("rejects a second root, an occupied slot, a bad slot and duplicate ids", () => {
    const t = bst([5, 2]);
    expect(() => treeAdd(t, "x", 1, null)).toThrow(/already has a root/);
    expect(() => treeAdd(t, "x", 1, "n0", 0)).toThrow(/already has a left child/);
    expect(() => treeAdd(t, "x", 1, "n0", 2)).toThrow(/slot 0 \(left\) or 1 \(right\)/);
    expect(() => treeAdd(t, "n1", 1, "n0", 1)).toThrow(/already exists/);
  });

  it("removes only leaves and splices nodes with one child into their parent's slot", () => {
    const t = bst([8, 3, 10, 1, 6, 14]);
    expect(() => treeRemove(t, "n1")).toThrow(/still has children/);
    expect(() => treeSplice(t, "n0")).toThrow(/has 2 children/);
    treeSplice(t, "n2"); // 10 has only a right child, 14
    expect(t.nodes.n0!.children).toEqual(["n1", "n5"]);
    treeRemove(t, "n3");
    expect(inorder(t)).toEqual([3, 6, 8, 14]);
    expect(checkTreeShape(t)).toBeNull();
  });

  it("splicing the root promotes its only child", () => {
    const t = bst([5, 7]);
    treeSplice(t, "n0");
    expect(t.root).toBe("n1");
    expect(inorder(t)).toEqual([7]);
  });

  it("general trees insert children in order and keep edge labels", () => {
    const t = emptyTree(false);
    treeAdd(t, "r", "", null);
    treeAdd(t, "b", "", "r", undefined, "b");
    treeAdd(t, "a", "", "r", 0, "a");
    expect(t.nodes.r!.children).toEqual(["a", "b"]);
    treeRemove(t, "a");
    expect(t.nodes.r!.children).toEqual(["b"]);
    expect(t.nodes.b!.edgeLabel).toBe("b");
  });

  it("moves subtrees, but never the root or into the node's own subtree", () => {
    const t = emptyTree(false);
    treeAdd(t, "r", "", null);
    for (const id of ["a", "b", "c"]) treeAdd(t, id, id, "r");
    treeAdd(t, "a1", "a1", "a");
    treeMove(t, "a", "b");
    expect(t.nodes.r!.children).toEqual(["b", "c"]);
    expect(t.nodes.b!.children).toEqual(["a"]);
    expect(t.nodes.a!.children).toEqual(["a1"]);
    treeMove(t, "c", "r", 0);
    expect(t.nodes.r!.children).toEqual(["c", "b"]);
    expect(() => treeMove(t, "r", "a")).toThrow(/cannot move the root/);
    expect(() => treeMove(t, "b", "a1")).toThrow(/inside its own subtree/);
    expect(() => treeMove(t, "b", "b")).toThrow(/inside its own subtree/);
    expect(checkTreeShape(t)).toBeNull();

    const bin = bst([5, 3, 8]);
    expect(() => treeMove(bin, "n1", "n2")).toThrow(/slot 0 \(left\) or 1 \(right\)/);
    treeMove(bin, "n1", "n2", 0);
    expect(inorder(bin)).toEqual([5, 3, 8]);
    expect(bin.nodes.n0!.children).toEqual([null, "n2"]);
    expect(() => treeMove(bin, "n2", "n0", 0)).not.toThrow();
    expect(checkTreeShape(bin)).toBeNull();
  });

  it("rotates at the root and below it, keeping the in-order sequence", () => {
    // 8(3(1, 6(4, 7)), 10(·, 14))
    const t = bst([8, 3, 10, 1, 6, 14, 4, 7]);
    const before = inorder(t);
    expect(treeRotate(t, "n0", "right")).toBe("n1"); // 3 becomes the root
    expect(t.root).toBe("n1");
    expect(t.nodes.n1!.children).toEqual(["n3", "n0"]);
    expect(t.nodes.n0!.children).toEqual(["n4", "n2"]); // 6's subtree crossed over
    expect(inorder(t)).toEqual(before);
    expect(treeRotate(t, "n0", "right")).toBe("n4"); // below the root: 6 replaces 8
    expect(t.nodes.n1!.children).toEqual(["n3", "n4"]);
    expect(t.nodes.n4!.children).toEqual(["n6", "n0"]);
    expect(t.nodes.n0!.children).toEqual(["n7", "n2"]);
    expect(inorder(t)).toEqual(before);
    expect(treeRotate(t, "n4", "left")).toBe("n0"); // and back
    expect(treeRotate(t, "n1", "left")).toBe("n0");
    expect(t.root).toBe("n0");
    expect(inorder(t)).toEqual(before);
    expect(checkTreeShape(t)).toBeNull();
    expect(() => treeRotate(t, "n3", "left")).toThrow(/no right child/);
    expect(() => treeRotate(t, "n2", "right")).toThrow(/no left child/);
    expect(() => treeRotate(t, "zz", "left")).toThrow(/unknown tree node/);
    const g = emptyTree(false);
    treeAdd(g, "r", 1, null);
    expect(() => treeRotate(g, "r", "left")).toThrow(/binary tree/);
  });

  it("detects broken shapes", () => {
    const t = bst([2, 1, 3]);
    expect(
      checkTreeShape({ ...t, nodes: { ...t.nodes, n1: { value: 1, children: ["n0", null] } } }),
    ).toMatch(/reachable twice/);
    expect(
      checkTreeShape({ ...t, nodes: { ...t.nodes, z: { value: 9, children: [null, null] } } }),
    ).toMatch(/not reachable/);
    expect(checkTreeShape({ ...t, root: null })).toMatch(/no root/);
    expect(
      checkTreeShape({ ...t, nodes: { ...t.nodes, n0: { value: 2, children: ["n1"] } } }),
    ).toMatch(/two child slots/);
  });
});

function treeTrace(): Trace {
  const t = new Tracer({ id: "test-tree", version: 1 });
  const T = t.tree("T", { binary: true });
  const r = T.add(5, null);
  const l = T.add(3, r, 0);
  const rr = T.add(9, r, 1);
  T.add(7, rr, 0);
  T.compare(rr, 7, { note: "compare" });
  T.status(l, "visited");
  T.annotate(r, "root");
  T.set(l, 4);
  T.splice(rr);
  T.remove(l);
  const x = T.add(1, "n0", 0);
  T.move(x, "n3", 1);
  T.rotate("n0", "left", { note: "rotate" });
  return t.finish(null, null);
}

describe("tree traces", () => {
  it("replay matches the tracer and steps backward to identical states", () => {
    const trace = treeTrace();
    const ref = new TracePlayer(trace, { keyframeInterval: 1 });
    const player = new TracePlayer(trace, { keyframeInterval: 3 });
    for (let p = player.length; p >= 0; p--) expect(player.stateAt(p)).toEqual(ref.stateAt(p));
    const final = player.finalState().structures.T as TreeStructure;
    expect(inorder(final)).toEqual([5, 7, 1]);
    expect(final.root).toBe("n3"); // the rotation lifted 7 above 5
    expect(final.annotations).toEqual({ n0: "root" });
    expect(player.finalState().counters).toMatchObject({ comparisons: 1, writes: 6 });
  });

  it("validates through JSON and rejects impossible tree edits", () => {
    const raw = JSON.parse(JSON.stringify(treeTrace()));
    expect(validateTrace(raw).ok).toBe(true);
    raw.events.splice(1, 0, { type: "tree.add", s: "T", node: "zz", value: 1, parent: null });
    raw.meta.eventCount += 1;
    const result = validateTrace(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toMatch(/event #1: the tree already has a root/);
    const cyclic = JSON.parse(JSON.stringify(treeTrace()));
    const last = cyclic.events.findIndex((e: { type: string }) => e.type === "tree.move");
    cyclic.events.splice(last + 1, 0, { type: "tree.move", s: "T", node: "n0", parent: "n3" });
    cyclic.meta.eventCount += 1;
    const moved = validateTrace(cyclic);
    expect(moved.ok).toBe(false);
    if (!moved.ok) expect(moved.errors[0]).toMatch(/cannot move the root/);
  });

  it("rejects impossible rotations and malformed rotate events", () => {
    const bad = JSON.parse(JSON.stringify(treeTrace()));
    const at = bad.events.findIndex((e: { type: string }) => e.type === "tree.rotate");
    bad.events.splice(at + 1, 0, { type: "tree.rotate", s: "T", node: "n0", dir: "left" });
    bad.meta.eventCount += 1;
    const r = validateTrace(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]).toMatch(/no right child/);
    const odd = JSON.parse(JSON.stringify(treeTrace()));
    odd.events.find((e: { type: string }) => e.type === "tree.rotate").dir = "up";
    const r2 = validateTrace(odd);
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.errors.join()).toMatch(/dir: missing or invalid/);
  });

  it("rejects malformed initial trees and unknown tree fields", () => {
    const raw = JSON.parse(JSON.stringify(treeTrace()));
    raw.initial.structures.T = {
      kind: "tree",
      binary: true,
      root: "a",
      nodes: { a: { value: 1, children: ["b", null] }, b: { value: 2, children: ["a", null] } },
      nodeStatus: {},
      annotations: {},
    };
    const result = validateTrace(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join()).toMatch(/reachable twice/);
    const raw2 = JSON.parse(JSON.stringify(treeTrace()));
    raw2.events[0].colour = "red";
    expect(validateTrace(raw2).ok).toBe(false);
  });

  it("migrates version-1 traces and rejects versions from the future", () => {
    const t = new Tracer({ id: "old", version: 1 });
    t.array("A", [2, 1]).swap(0, 1);
    const v1 = { ...JSON.parse(JSON.stringify(t.finish(null, null))), version: 1 };
    const migrated = validateTrace(v1);
    expect(migrated.ok).toBe(true);
    if (migrated.ok) expect(migrated.trace.version).toBe(2);
    const v3 = { ...v1, version: 3 };
    const rejected = validateTrace(v3);
    expect(rejected.ok).toBe(false);
    if (!rejected.ok)
      expect(rejected.errors[0]).toMatch(/newer than this application supports \(2\)/);
  });
});
