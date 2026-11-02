import type { AlgorithmEntry } from "../types";

export const unionFindEntry: AlgorithmEntry = {
  slug: "union-find",
  name: "Union-Find (Disjoint Set Union)",
  aliases: ["Disjoint set union", "DSU", "Disjoint-set forest", "Union by rank", "Merge-find"],
  curriculum: [221, 222],
  domain: "graphs",
  subcategory: "Connectivity",
  difficulty: "intermediate",
  summary:
    "Keeps a collection of disjoint sets as a forest of parent pointers, so merging two sets and asking which set an element is in both cost almost constant amortised time.",
  tags: ["disjoint sets", "connectivity", "forest", "path compression", "union by rank"],
  prerequisites: ["Trees", "Arrays"],
  related: ["kruskal", "bfs", "dfs"],
  problem: {
    input: "A number of elements $n$ and a sequence of union, find and connected operations.",
    output:
      "For each find, a representative of the element's set; for each connected query, whether two elements share a set.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine every person in a room points at someone in their group, and following the pointing eventually reaches one leader who points at themselves. Two people are in the same group exactly when they reach the same leader. To merge two groups, one leader simply starts pointing at the other.",
      },
      {
        kind: "p",
        text: "Two habits keep the chains of pointing short. **Union by rank** always makes the leader of the shallower group point at the leader of the deeper one. **Path compression** makes everyone you pass on the way to a leader point straight at the leader afterwards.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**make-set:** every element starts as its own root: `parent[i] = i`, `rank[i] = 0`.",
          "**find(x):** follow `parent` until reaching a root $r$ (an element that is its own parent). Then walk the path again and point every node on it directly at $r$.",
          "**union(a, b):** find both roots. If they are equal, stop. Otherwise hang the root with the smaller rank under the other; if the ranks were equal, the new root's rank grows by one.",
          "**connected(a, b):** `find(a) == find(b)`.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset). With 8 elements, the unions (0,1), (2,3), (0,2), (4,5), (6,7), (4,6), (0,4) build one tree of rank 3 rooted at 0: 1, 2 and 4 hang from 0; 3 from 2; 5 and 6 from 4; 7 from 6. Then find(7) walks 7 → 6 → 4 → 0 and compresses the path, so 7 and 6 now point at 0 directly.",
      },
      {
        kind: "table",
        head: ["i", "0", "1", "2", "3", "4", "5", "6", "7"],
        rows: [
          ["parent before find(7)", "0", "0", "0", "2", "0", "4", "4", "6"],
          ["parent after find(7)", "0", "0", "0", "2", "0", "4", "0", "0"],
          ["rank", "3", "0", "1", "0", "2", "0", "1", "0"],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store `parent` and `rank` (or `size`) as arrays indexed by element; map other keys to indices first.",
          "Write `find` iteratively, or the recursion depth can reach $n$ before the first compression.",
          "Ranks are upper bounds on height, not heights: path compression lowers trees without updating rank, and that is fine.",
          "Union by size (hang the smaller set) gives the same guarantees as union by rank and also tells you each set's size.",
          "Deleting an element or splitting a set is not supported; that needs other structures.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "A common bug",
        text: "Linking `parent[a] = b` instead of `parent[find(a)] = find(b)` attaches a non-root, which can silently lose the rest of $a$'s set.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Rank lemma.** With union by rank, a root of rank $k$ has at least $2^k$ elements in its tree: a rank grows only when two trees of equal rank $k-1$, each with at least $2^{k-1}$ elements, merge. So every rank is at most $\\lfloor \\log_2 n \\rfloor$, and union by rank alone makes find $O(\\log n)$.",
      },
      {
        kind: "p",
        text: "**Both heuristics together.** Tarjan proved that a sequence of $m$ operations on $n$ elements costs $O(m\\,\\alpha(n))$ time, where $\\alpha$ is the inverse Ackermann function. In the variant used by Cormen et al., $\\alpha(n) \\le 4$ for every $n$ up to $A_4(1)$, a number far larger than $10^{80}$, so each operation is constant time for all practical purposes, though not in theory.",
      },
      {
        kind: "math",
        tex: "T(m, n) = O\\big(m\\,\\alpha(n)\\big)",
      },
      {
        kind: "p",
        text: "Fredman and Saks showed this is optimal: any such structure in the cell-probe model needs $\\Omega(\\alpha(n))$ amortised time per operation.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Path halving and path splitting** point each visited node at its grandparent in one pass; they have the same $O(\\alpha(n))$ amortised bound and avoid a second walk.",
          "**Offline connectivity:** Kruskal's minimum spanning tree, connected components of a stream of edges, and Tarjan's offline lowest-common-ancestor algorithm all use union-find.",
          "**Weighted union-find** stores, on each pointer, a relation to the parent (a parity or an offset) so it can answer “is x's value 3 more than y's?”.",
          "**Persistent and rollback versions** skip path compression so unions can be undone, at $O(\\log n)$ per operation.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(\\alpha(n))", worst: "O(\\log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Per operation. Amortised $O(\\alpha(n))$ with union by rank and path compression; a single find can still take $O(\\log n)$.",
  },
  properties: [
    { label: "Operations", value: "Union, find; no deletion or splitting" },
    { label: "Amortised cost", value: "$O(\\alpha(n))$, effectively constant" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run_union_find",
      code: `def run_union_find(n, ops):
    """ops: ["union", a, b] | ["find", a] | ["connected", a, b]. Returns answers, parent, rank."""
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        root = x
        while parent[root] != root:
            root = parent[root]
        while parent[x] != root:          # path compression
            parent[x], x = root, parent[x]
        return root

    answers = []
    for op in ops:
        if op[0] == "find":
            answers.append(find(op[1]))
        elif op[0] == "connected":
            answers.append(find(op[1]) == find(op[2]))
        else:
            ra, rb = find(op[1]), find(op[2])
            if ra == rb:
                continue
            if rank[ra] < rank[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            if rank[ra] == rank[rb]:
                rank[ra] += 1
    return [answers, parent, rank]
`,
      tests: [
        {
          args: [
            8,
            [
              ["union", 0, 1],
              ["union", 2, 3],
              ["union", 0, 2],
              ["union", 4, 5],
              ["union", 6, 7],
              ["union", 4, 6],
              ["union", 0, 4],
              ["find", 7],
            ],
          ],
          expected: [[0], [0, 0, 0, 2, 0, 4, 0, 0], [3, 0, 1, 0, 2, 0, 1, 0]],
        },
        {
          args: [
            6,
            [
              ["union", 1, 2],
              ["union", 3, 4],
              ["connected", 1, 4],
              ["union", 2, 3],
              ["connected", 1, 4],
              ["connected", 0, 5],
            ],
          ],
          expected: [
            [false, true, false],
            [0, 1, 1, 1, 1, 5],
            [0, 2, 0, 1, 0, 0],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "countComponents",
      code: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = new Array(n).fill(1);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // path halving
      x = parent[x];
    }
    return x;
  };
  let components = n;
  for (const [a, b] of edges) {
    let ra = find(a), rb = find(b);
    if (ra === rb) continue;
    if (size[ra] < size[rb]) [ra, rb] = [rb, ra]; // union by size
    parent[rb] = ra;
    size[ra] += size[rb];
    components--;
  }
  return components;
}
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1],
              [1, 2],
              [3, 4],
            ],
          ],
          expected: 2,
        },
        { args: [4, []], expected: 4 },
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [2, 3],
            ],
          ],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: "union-find",
  practice: [
    {
      id: "uf-rank-bound",
      kind: "numeric",
      prompt: "With union by rank on 100 elements, what is the largest rank any root can reach?",
      answer: 6,
      explanation:
        "A root of rank $k$ has at least $2^k$ elements. $2^6 = 64 \\le 100 < 128 = 2^7$, so the largest rank is 6.",
      hints: ["How many elements must a tree of rank $k$ contain?"],
      objective: "Apply the rank lemma",
    },
    {
      id: "uf-link-roots",
      kind: "mcq",
      prompt: "Why must union link the two roots rather than the two elements themselves?",
      options: [
        "Linking a non-root would detach it from the rest of its set",
        "Roots are stored in a separate array",
        "It makes find recursive",
        "It is only needed for path compression",
      ],
      answer: 0,
      explanation:
        "Changing a non-root's parent moves only its subtree; the rest of its old set is not merged, so later connected queries are wrong.",
      distractors: {
        1: "Roots are ordinary entries of the same parent array.",
        2: "It has nothing to do with recursion.",
        3: "Even without compression, linking non-roots is incorrect.",
      },
      hints: ["What happens to the elements above a non-root when its pointer changes?"],
      objective: "Understand why union links roots",
    },
    {
      id: "uf-find-after",
      kind: "numeric",
      prompt:
        "In the worked example, how many elements point directly at 0 after find(7) has compressed its path?",
      answer: 5,
      explanation:
        "Before: 1, 2 and 4 point at 0. Compression points 6 and 7 at 0 too, so five elements (1, 2, 4, 6, 7).",
      hints: ["Path compression changes the parent of every node on the walk from 7."],
      objective: "Trace path compression",
    },
  ],
  exam: {
    definition:
      "A disjoint-set (union-find) structure maintains a partition of $n$ elements under union of two sets and find of an element's set representative, using a forest of parent pointers.",
    steps: [
      "make-set: parent[i] = i, rank[i] = 0.",
      "find(x): follow parents to the root; compress the path so each visited node points at the root.",
      "union(a, b): find both roots; if different, hang the lower-rank root under the higher; on a tie, increment the new root's rank.",
    ],
    timeComplexity:
      "$O(\\log n)$ per operation with union by rank alone; $O(\\alpha(n))$ amortised with path compression as well.",
    spaceComplexity: "$O(n)$ for the parent and rank arrays.",
    correctness:
      "Each set is exactly one tree, because union joins two whole trees by their roots; find returns that tree's root, so two elements share a set iff they have the same root. Compression changes pointers only within one tree, keeping the root.",
    applications: [
      "Kruskal's minimum spanning tree",
      "Connected components of a growing graph",
      "Cycle detection in undirected graphs",
      "Image segmentation and percolation",
      "Type unification in compilers",
    ],
    limitations: ["No efficient deletion or splitting of sets", "Answers are amortised"],
    faq: [
      {
        q: "Rank or size?",
        a: "Either gives $O(\\log n)$ height and, with compression, $O(\\alpha(n))$ amortised; size is often more useful because it reports set sizes.",
      },
      {
        q: "Is it really constant time?",
        a: "Not in theory: $\\alpha(n)$ grows without bound, but so slowly that it is at most 4 for any realistic input.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Forest of parent pointers; root is the representative.",
          "Union by rank + path compression.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Operations and representation (1).",
          "find with path compression (1).",
          "union by rank (1).",
          "Worked example on 6–8 elements (1).",
          "Complexity, $O(\\alpha(n))$ amortised (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and operations (2).",
          "Pseudocode for find and union (3).",
          "Worked example with parent arrays before and after (2).",
          "Rank lemma and the $O(\\log n)$ proof (2).",
          "Statement of Tarjan's $O(m\\,\\alpha(n))$ bound and an application such as Kruskal (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "B. A. Galler, M. J. Fischer, “An improved equivalence algorithm,” Communications of the ACM, 7(5), 1964.",
      supports: "The parent-pointer forest representation of disjoint sets.",
    },
    {
      citation:
        "R. E. Tarjan, “Efficiency of a good but not linear set union algorithm,” Journal of the ACM, 22(2), 1975.",
      supports: "The $O(m\\,\\alpha(n))$ bound for union by rank with path compression.",
    },
    {
      citation:
        "M. L. Fredman, M. E. Saks, “The cell probe complexity of dynamic data structures,” Proc. STOC 1989.",
      supports: "The matching $\\Omega(\\alpha(n))$ lower bound.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Ch. 21.",
      supports: "Union by rank, path compression, the rank lemma and the amortised analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
