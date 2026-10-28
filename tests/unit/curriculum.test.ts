import { describe, expect, it } from "vitest";
import {
  CURRICULUM_ITEMS,
  CURRICULUM_PARTS,
  DP_PATTERNS,
  DUPLICATES,
  LEARNING_ORDER,
  TIERS,
  curriculumItem,
} from "@/content/curriculum";
import { DOMAINS } from "@/content/domains";

describe("curriculum", () => {
  it("has exactly 600 consecutively numbered items", () => {
    expect(CURRICULUM_ITEMS).toHaveLength(600);
    CURRICULUM_ITEMS.forEach((item, i) => expect(item.number).toBe(i + 1));
  });

  it.each([
    [1, "Linear Search"],
    [11, "Bubble Sort"],
    [50, "Bogo Sort"],
    [51, "Prefix Sum"],
    [100, "Monotonic Stack"],
    [101, "Reverse Linked List"],
    [150, "LFU Cache"],
    [151, "Binary Tree Traversal"],
    [200, "Tree DP"],
    [201, "Breadth-First Search (BFS)"],
    [207, "Dijkstra's Algorithm"],
    [250, "SPFA (Shortest Path Faster Algorithm)"],
    [251, "Memoization (Top-Down DP)"],
    [276, "Edit Distance (Levenshtein Distance)"],
    [300, "Convex Hull Trick DP Optimization"],
    [302, "Knuth–Morris–Pratt (KMP)"],
    [350, "FM-Index (Full-Text Search)"],
    [351, "Euclidean Algorithm (GCD)"],
    [400, "Gram–Schmidt Orthogonalization"],
    [401, "Orientation Test (CCW Test)"],
    [426, "Randomized QuickSort"],
    [455, "Monte Carlo Tree Search (MCTS)"],
    [470, "Bully Leader Election Algorithm"],
    [485, "Merkle Tree Construction"],
    [495, "Grace Hash Join"],
    [500, "Decision Tree Learning (ID3/C4.5/CART)"],
    [501, "Min-Cost Max-Flow (Successive Shortest Paths)"],
    [520, "Louvain Community Detection"],
    [535, "Persistent DSU / Rollback DSU"],
    [545, "Viterbi Decoding"],
    [565, "Cost-Based Query Optimization (Selinger)"],
    [585, "Diffusion Model Sampling (DDPM)"],
    [600, "Shor's Algorithm"],
  ])("item %i is %s", (n, name) => {
    expect(curriculumItem(n)?.name).toBe(name);
  });

  it("matches the published part ranges", () => {
    const ranges = Object.fromEntries(CURRICULUM_PARTS.map((p) => [p.id, p.range]));
    expect(ranges).toMatchObject({
      I: [1, 50],
      II: [51, 100],
      III: [101, 150],
      IV: [151, 200],
      V: [201, 250],
      VI: [251, 300],
      VII: [301, 350],
      VIII: [351, 400],
      IX: [401, 425],
      X: [426, 440],
      XI: [441, 455],
      XII: [456, 470],
      XIII: [471, 485],
      XIV: [486, 495],
      XV: [496, 500],
      XVI: [501, 520],
      XVII: [521, 535],
      XVIII: [536, 545],
      XIX: [546, 565],
      XX: [566, 585],
      XXI: [586, 600],
    });
  });

  it("maps duplicates to earlier canonical items with a related name", () => {
    for (const [dup, canonical] of Object.entries(DUPLICATES)) {
      expect(canonical).toBeLessThan(Number(dup));
      expect(DUPLICATES[canonical]).toBeUndefined();
    }
  });

  it("uses only known domains and sections", () => {
    const domains = new Set<string>(DOMAINS.map((d) => d.id));
    for (const item of CURRICULUM_ITEMS) expect(domains.has(item.domain)).toBe(true);
    const sections = new Set(CURRICULUM_PARTS.flatMap((p) => p.sections.map((s) => s.title)));
    for (const step of LEARNING_ORDER)
      for (const s of step.sections) expect(sections.has(s)).toBe(true);
    for (const n of Object.keys(TIERS)) expect(curriculumItem(Number(n))).toBeDefined();
    for (const p of DP_PATTERNS)
      for (const n of p.examples) expect(curriculumItem(n)).toBeDefined();
  });

  it("has 25 domains", () => {
    expect(DOMAINS).toHaveLength(25);
  });
});
