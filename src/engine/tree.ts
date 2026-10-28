import type { Scalar, TreeStructure } from "./protocol";

/**
 * Tree operations shared by the reducer (replay), the tracer (recording) and the
 * validator (untrusted input), so a tree edit has exactly one meaning everywhere.
 * Every function throws an Error with a learner-readable message on misuse.
 */

export function emptyTree(binary: boolean, label?: string): TreeStructure {
  return {
    kind: "tree",
    ...(label ? { label } : {}),
    binary,
    root: null,
    nodes: {},
    nodeStatus: {},
    annotations: {},
  };
}

/** The parent of `node` and the slot it occupies, or null for the root / a detached node. */
export function findParent(
  t: TreeStructure,
  node: string,
): { parent: string; slot: number } | null {
  for (const [id, data] of Object.entries(t.nodes)) {
    const slot = data.children.indexOf(node);
    if (slot !== -1) return { parent: id, slot };
  }
  return null;
}

function requireNode(t: TreeStructure, node: string) {
  const data = t.nodes[node];
  if (!data) throw new Error(`unknown tree node "${node}"`);
  return data;
}

export function treeAdd(
  t: TreeStructure,
  node: string,
  value: Scalar,
  parent: string | null,
  slot?: number,
  edgeLabel?: string,
): void {
  if (t.nodes[node]) throw new Error(`tree node "${node}" already exists`);
  if (parent === null) {
    if (t.root !== null) throw new Error(`the tree already has a root ("${t.root}")`);
    t.root = node;
  } else {
    const p = requireNode(t, parent);
    if (t.binary) {
      if (slot !== 0 && slot !== 1)
        throw new Error("binary tree children need slot 0 (left) or 1 (right)");
      if (p.children[slot] !== null) {
        throw new Error(`node "${parent}" already has a ${slot === 0 ? "left" : "right"} child`);
      }
      p.children[slot] = node;
    } else {
      const at = slot ?? p.children.length;
      if (!Number.isInteger(at) || at < 0 || at > p.children.length) {
        throw new Error(`child position ${at} out of range for node "${parent}"`);
      }
      p.children.splice(at, 0, node);
    }
  }
  t.nodes[node] = {
    value,
    children: t.binary ? [null, null] : [],
    ...(edgeLabel !== undefined ? { edgeLabel } : {}),
  };
  t.nodeStatus[node] = "unvisited";
}

function detach(t: TreeStructure, node: string, replacement: string | null): void {
  const at = findParent(t, node);
  if (at === null) {
    if (t.root !== node) throw new Error(`tree node "${node}" is not attached`);
    t.root = replacement;
    return;
  }
  const kids = t.nodes[at.parent]!.children;
  if (t.binary || replacement !== null) kids[at.slot] = replacement;
  else kids.splice(at.slot, 1);
}

function forget(t: TreeStructure, node: string): void {
  delete t.nodes[node];
  delete t.nodeStatus[node];
  delete t.annotations[node];
}

export function treeRemove(t: TreeStructure, node: string): void {
  const data = requireNode(t, node);
  if (data.children.some((c) => c !== null))
    throw new Error(`cannot remove "${node}": it still has children`);
  detach(t, node, null);
  forget(t, node);
}

export function treeSplice(t: TreeStructure, node: string): void {
  const data = requireNode(t, node);
  const kids = data.children.filter((c): c is string => c !== null);
  if (kids.length > 1)
    throw new Error(`cannot splice out "${node}": it has ${kids.length} children`);
  const child = kids[0] ?? null;
  detach(t, node, child);
  forget(t, node);
}

/** True when `node` is `ancestor` or lies in its subtree. */
function inSubtree(t: TreeStructure, ancestor: string, node: string): boolean {
  if (ancestor === node) return true;
  return t.nodes[ancestor]!.children.some((c) => c !== null && inSubtree(t, c, node));
}

/**
 * Re-attach `node`, with its whole subtree, under `parent` (binary: into an empty
 * slot; general: at position `slot`, default last). The root cannot move, and a node
 * cannot move into its own subtree.
 */
export function treeMove(t: TreeStructure, node: string, parent: string, slot?: number): void {
  requireNode(t, node);
  const p = requireNode(t, parent);
  if (t.root === node) throw new Error(`cannot move the root "${node}"`);
  if (inSubtree(t, node, parent))
    throw new Error(`cannot move "${node}" under "${parent}": that is inside its own subtree`);
  if (t.binary) {
    if (slot !== 0 && slot !== 1)
      throw new Error("binary tree children need slot 0 (left) or 1 (right)");
    if (p.children[slot] !== null && p.children[slot] !== node) {
      throw new Error(`node "${parent}" already has a ${slot === 0 ? "left" : "right"} child`);
    }
  }
  detach(t, node, null);
  if (t.binary) p.children[slot!] = node;
  else {
    const at = slot ?? p.children.length;
    if (!Number.isInteger(at) || at < 0 || at > p.children.length) {
      throw new Error(`child position ${at} out of range for node "${parent}"`);
    }
    p.children.splice(at, 0, node);
  }
}

/**
 * Exchange two nodes, each with its whole subtree: each takes the other's place (slot or
 * root). Neither may lie inside the other's subtree.
 */
export function treeSwap(t: TreeStructure, a: string, b: string): void {
  requireNode(t, a);
  requireNode(t, b);
  if (a === b) return;
  if (inSubtree(t, a, b) || inSubtree(t, b, a))
    throw new Error(`cannot swap "${a}" and "${b}": one is inside the other's subtree`);
  const pa = findParent(t, a);
  const pb = findParent(t, b);
  if (pa === null && t.root !== a) throw new Error(`tree node "${a}" is not attached`);
  if (pb === null && t.root !== b) throw new Error(`tree node "${b}" is not attached`);
  if (pa) t.nodes[pa.parent]!.children[pa.slot] = b;
  else t.root = b;
  if (pb) t.nodes[pb.parent]!.children[pb.slot] = a;
  else t.root = a;
}

/**
 * Rotate a binary tree at `node`. Left: its right child y takes its place, `node`
 * becomes y's left child, and y's old left subtree becomes `node`'s right subtree.
 * Right is the mirror image. In-order is unchanged; this works at the root too.
 * Returns the child that moved up.
 */
export function treeRotate(t: TreeStructure, node: string, dir: "left" | "right"): string {
  if (!t.binary) throw new Error("rotations need a binary tree");
  const x = requireNode(t, node);
  const up = dir === "left" ? 1 : 0;
  const yId = x.children[up];
  if (yId == null)
    throw new Error(
      `cannot rotate "${node}" ${dir}: it has no ${up === 1 ? "right" : "left"} child`,
    );
  const y = t.nodes[yId]!;
  const at = findParent(t, node);
  x.children[up] = y.children[1 - up] ?? null;
  y.children[1 - up] = node;
  if (at === null) t.root = yId;
  else t.nodes[at.parent]!.children[at.slot] = yId;
  return yId;
}

/**
 * Check the shape invariants: one root, every node reachable from it exactly once,
 * no cycles, children reference existing nodes, binary nodes have two slots.
 */
export function checkTreeShape(t: TreeStructure): string | null {
  const ids = Object.keys(t.nodes);
  if (t.root === null) return ids.length === 0 ? null : "nodes exist but the tree has no root";
  if (!t.nodes[t.root]) return `root "${t.root}" is not a node`;
  const seen = new Set<string>();
  const stack = [t.root];
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (seen.has(id)) return `node "${id}" is reachable twice (a cycle or two parents)`;
    seen.add(id);
    const data = t.nodes[id];
    if (!data) return `child "${id}" is not a node`;
    if (t.binary && data.children.length !== 2)
      return `binary node "${id}" must have exactly two child slots`;
    for (const c of data.children) {
      if (c === null) {
        if (!t.binary) return `general tree node "${id}" has an empty child slot`;
      } else stack.push(c);
    }
  }
  if (seen.size !== ids.length)
    return `${ids.length - seen.size} node(s) are not reachable from the root`;
  return null;
}

export function inorder(t: TreeStructure): Scalar[] {
  const out: Scalar[] = [];
  const walk = (id: string | null) => {
    if (id === null) return;
    const d = t.nodes[id]!;
    if (t.binary) {
      walk(d.children[0] ?? null);
      out.push(d.value);
      walk(d.children[1] ?? null);
    } else {
      out.push(d.value);
      d.children.forEach((c) => walk(c));
    }
  };
  walk(t.root);
  return out;
}

export function depthOf(t: TreeStructure): number {
  const walk = (id: string | null): number =>
    id === null ? 0 : 1 + Math.max(0, ...t.nodes[id]!.children.map((c) => walk(c)));
  return walk(t.root);
}
