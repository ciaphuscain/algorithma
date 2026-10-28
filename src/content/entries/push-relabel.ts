import type { AlgorithmEntry } from "../types";

export const pushRelabelEntry: AlgorithmEntry = {
  slug: "push-relabel",
  name: "Push–Relabel (Maximum Flow)",
  aliases: ["Preflow–push", "Goldberg–Tarjan", "FIFO push–relabel", "Relabel-to-front"],
  curriculum: [236],
  domain: "graphs",
  subcategory: "Network flow",
  difficulty: "advanced",
  summary:
    "Computes a maximum flow by local moves instead of whole paths. Vertices may temporarily hold excess flow (a preflow); an overflowing vertex pushes excess to a neighbour exactly one unit lower, or is lifted (relabelled) when no edge goes downhill. FIFO selection runs in O(V³).",
  tags: ["max flow", "preflow", "push", "relabel", "heights", "network flow", "min cut"],
  prerequisites: ["Dinic's Algorithm (Maximum Flow)"],
  related: ["dinic", "hopcroft-karp"],
  problem: {
    input: "A directed graph with edge capacities, a source s and a sink t.",
    output: "A maximum flow, its value, and a minimum cut.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Picture each vertex at a height, with water flowing only downhill. Start by flooding every pipe out of s, which stands at height |V|. Vertices that receive more than they pass on hold the extra as **excess**. An overflowing vertex sends its excess down any pipe with spare capacity to a vertex exactly one level lower. If no pipe goes downhill, lift the vertex just above its lowest reachable neighbour.",
      },
      {
        kind: "p",
        text: "Excess that cannot reach t eventually rises above the source and flows back to s. When no vertex overflows, what remains is a valid flow, and it is maximum.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "h(s) = |V|, all other heights 0; saturate every edge out of s.",
          "Put every vertex except s and t that has excess into a FIFO queue.",
          "Take the front vertex u and discharge it: while it has excess, push min(excess, residual) along a residual edge u → v with h(u) = h(v) + 1; if there is none, relabel h(u) = 1 + min h(v) over residual edges u → v.",
          "A vertex that receives excess joins the queue. Stop when the queue is empty: excess(t) is the maximum flow.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the second preset): S → A, S → B, A → B, A → T, B → T, every capacity 1.",
      },
      {
        kind: "table",
        head: ["Step", "Action", "Heights", "Excess"],
        rows: [
          ["1", "Saturate S → A and S → B", "S 4, others 0", "A 1, B 1"],
          ["2", "Relabel A to 1; push A → B (B is first among A's neighbours)", "A 1", "A 0, B 2"],
          ["3", "Relabel B to 1; push B → T", "B 1", "B 1, T 1"],
          ["4", "Relabel B to 2; push 1 back along A → B (cancelling it)", "B 2", "B 0, A 1"],
          ["5", "Push A → T", "", "A 0, T 2"],
        ],
      },
      {
        kind: "p",
        text: "Flow 2. Step 4 shows push–relabel undoing an earlier choice: B could not pass its second unit on, rose above A, and returned it.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Keep a current-edge pointer per vertex: an edge that is not admissible stays inadmissible until the vertex is relabelled.",
          "**Gap heuristic**: if no vertex has height k, every vertex above k can never reach t; lift them all above |V|.",
          "**Global relabelling**: periodically recompute exact heights by a BFS backwards from t. With these two heuristics push–relabel is one of the fastest practical methods.",
          "Selection rule matters: FIFO gives $O(V^3)$, highest-label $O(V^2 \\sqrt{E})$.",
          "The algorithm first finds a maximum preflow (and so the minimum cut); returning the leftover excess to s is a second stage that can be skipped if only the cut is needed.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant.** Heights are valid: for every residual edge u → v, $h(u) \\le h(v) + 1$. Since h(s) = |V| and h(t) = 0, a residual path from s to t would have to drop |V| levels in at most |V| − 1 steps, which is impossible. So when no excess is left, there is no augmenting path, and the flow is maximum.",
      },
      {
        kind: "p",
        text: "**Bounds.** A vertex with excess always has a residual path back to s, so no height ever exceeds 2|V| − 1. Each of the |V| − 2 other vertices is relabelled at most 2|V| − 1 times: at most $(2V - 1)(V - 2)$ relabels in total (the property tests check this), $O(VE)$ saturating pushes, and $O(V^2 E)$ non-saturating pushes for the generic method:",
      },
      { kind: "math", tex: "T_{\\text{generic}} = O(V^2 E), \\qquad T_{\\text{FIFO}} = O(V^3)" },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Relabel-to-front (in CLRS) is another $O(V^3)$ selection rule.",
          "Push–relabel parallelises well because pushes and relabels are local, and it underlies fast min-cut codes for image segmentation.",
          "With dynamic trees the bound improves to $O(VE \\log(V^2 / E))$.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(V^3)", average: "O(V^3)", worst: "O(V^3)" },
    space: "O(V + E)",
    worstClass: "n^3",
    note: "FIFO vertex selection; the generic method is O(V²E).",
  },
  properties: [
    { label: "Relabels", value: "At most (2V − 1)(V − 2)" },
    { label: "Works on", value: "Preflows: inflow may exceed outflow until the end" },
  ],
  implementations: [
    {
      language: "python",
      entry: "push_relabel",
      code: `from collections import deque


def push_relabel(n, edges, s, t):
    cap = [[0] * n for _ in range(n)]
    for u, v, c in edges:
        cap[u][v] += c
    flow = [[0] * n for _ in range(n)]
    height, excess = [0] * n, [0] * n
    height[s] = n
    for v in range(n):                    # preflow: saturate every edge out of s
        if cap[s][v]:
            flow[s][v] = cap[s][v]
            flow[v][s] = -cap[s][v]
            excess[v] += cap[s][v]
            excess[s] -= cap[s][v]
    active = deque(v for v in range(n) if v not in (s, t) and excess[v] > 0)
    while active:
        u = active[0]
        while excess[u] > 0:
            pushed = False
            for v in range(n):
                residual = cap[u][v] - flow[u][v]
                if residual > 0 and height[u] == height[v] + 1:
                    d = min(excess[u], residual)
                    flow[u][v] += d
                    flow[v][u] -= d
                    excess[u] -= d
                    excess[v] += d
                    if v not in (s, t) and v not in active:
                        active.append(v)
                    pushed = True
                    if excess[u] == 0:
                        break
            if not pushed:                # relabel
                height[u] = 1 + min(height[v] for v in range(n) if cap[u][v] - flow[u][v] > 0)
        active.popleft()
    return excess[t]
`,
      tests: [
        {
          args: [
            6,
            [
              [0, 1, 16],
              [0, 2, 13],
              [1, 3, 12],
              [2, 1, 4],
              [2, 4, 14],
              [3, 2, 9],
              [3, 5, 20],
              [4, 3, 7],
              [4, 5, 4],
            ],
            0,
            5,
          ],
          expected: 23,
        },
        {
          args: [
            4,
            [
              [0, 1, 1],
              [0, 2, 1],
              [1, 2, 1],
              [1, 3, 1],
              [2, 3, 1],
            ],
            0,
            3,
          ],
          expected: 2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "minCutSide",
      code: `// Source side of the minimum cut certified by a maximum flow:
// the vertices reachable from s through edges with spare capacity
// (forwards) or with flow to cancel (backwards).
function minCutSide(n, edges, flows, s) {
  const seen = new Array(n).fill(false);
  seen[s] = true;
  const queue = [s];
  while (queue.length) {
    const u = queue.shift();
    edges.forEach(([a, b, c], i) => {
      if (a === u && !seen[b] && flows[i] < c) { seen[b] = true; queue.push(b); }
      if (b === u && !seen[a] && flows[i] > 0) { seen[a] = true; queue.push(a); }
    });
  }
  return seen.flatMap((x, v) => (x ? [v] : []));
}
`,
      tests: [
        {
          args: [
            6,
            [
              [0, 1, 16],
              [0, 2, 13],
              [1, 3, 12],
              [2, 1, 4],
              [2, 4, 14],
              [3, 2, 9],
              [3, 5, 20],
              [4, 3, 7],
              [4, 5, 4],
            ],
            [12, 11, 12, 0, 11, 0, 19, 7, 4],
            0,
          ],
          expected: [0, 1, 2, 4],
        },
      ],
    },
  ],
  visualizer: "push-relabel",
  practice: [
    {
      id: "pr-source-height",
      kind: "numeric",
      prompt: "In a network with 6 vertices, at what height does push–relabel place the source?",
      answer: 6,
      explanation:
        "h(s) = |V|, so no residual s–t path can exist without breaking the height invariant.",
      hints: ["The source starts at height |V|."],
      objective: "Recall the initial labelling",
    },
    {
      id: "pr-relabel",
      kind: "mcq",
      prompt: "When is an overflowing vertex u relabelled?",
      options: [
        "When no residual edge leads to a vertex exactly one unit lower",
        "After every push",
        "When u reaches the sink",
        "When its excess is zero",
      ],
      answer: 0,
      explanation:
        "Pushes only go downhill by one; if none is possible, u is lifted to 1 + the lowest height among its residual neighbours, creating at least one admissible edge.",
      distractors: {
        1: "Pushes do not change heights.",
        2: "The sink never overflows in the algorithm's sense; it just collects flow.",
        3: "Vertices without excess are not processed.",
      },
      hints: ["What must be true of an edge before flow can be pushed along it?"],
      objective: "Understand the relabel operation",
    },
  ],
  exam: {
    definition:
      "Push–relabel computes a maximum flow by maintaining a preflow and valid heights, pushing excess along admissible edges (one unit downhill) and relabelling vertices that cannot push.",
    steps: [
      "h(s) = |V|; saturate edges out of s.",
      "While some vertex u ≠ s, t overflows: push along an admissible edge, else relabel u.",
      "Return excess(t).",
    ],
    timeComplexity: "$O(V^2 E)$ generic; $O(V^3)$ FIFO; $O(V^2\\sqrt{E})$ highest-label.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "Valid heights rule out residual s–t paths throughout; at termination the preflow is a flow, hence maximum.",
    applications: [
      "Large max-flow and min-cut instances",
      "Image segmentation",
      "Parallel flow computation",
    ],
    limitations: [
      "Needs heuristics (gap, global relabel) to be fast in practice",
      "Harder to follow than augmenting-path methods",
    ],
    faq: [
      {
        q: "Why can excess go back to the source?",
        a: "Heights may rise above |V|; flow that cannot reach t then flows back to s, turning the preflow into a flow.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Preflow, heights, push and relabel.", "$O(V^2 E)$ generic."] },
      {
        marks: 5,
        outline: [
          "Preflow and height function (1).",
          "Push and relabel rules (2).",
          "Example (1).",
          "Bound (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definitions: preflow, excess, valid labelling (2).",
          "Operations and algorithm (2).",
          "Worked example (2).",
          "Correctness via valid heights (2).",
          "Complexity analysis (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. V. Goldberg, R. E. Tarjan, “A new approach to the maximum-flow problem,” Journal of the ACM, 35(4), 1988.",
      supports: "The push–relabel method, its bounds and the FIFO variant.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §26.4–26.5.",
      supports: "Push–relabel, its analysis, and relabel-to-front.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
