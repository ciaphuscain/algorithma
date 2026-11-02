import type { AlgorithmEntry } from "../types";

export const aStarEntry: AlgorithmEntry = {
  slug: "a-star",
  name: "A* Search",
  aliases: ["A-star", "A star", "Heuristic search", "Best-first search with path cost"],
  curriculum: [211],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "intermediate",
  summary:
    "Dijkstra's algorithm guided by a heuristic: it always expands the open node with the smallest g + h, the cost so far plus an estimate of the cost to go. With an estimate that never overestimates, the first path to the goal is a shortest one.",
  tags: ["heuristic", "pathfinding", "grid", "best-first", "admissible", "manhattan distance"],
  prerequisites: ["Dijkstra's Algorithm", "Priority Queues"],
  related: ["dijkstra", "bfs", "bellman-ford"],
  problem: {
    input:
      "A grid map with walls, a start S and a goal G; moves go up, down, left or right at cost 1.",
    output: "A shortest path from S to G, or “no path”.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Dijkstra's algorithm spreads out evenly in every direction, like a ripple. A* knows roughly where the goal is and leans towards it: among the places it could explore next, it picks the one whose distance travelled **plus** straight-line-ish distance remaining is smallest. If that estimate is never too optimistic about being far, A* still finds the shortest path, usually after exploring far less.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "$g(v)$: cost of the best path to $v$ found so far. $h(v)$: estimated cost from $v$ to the goal; here the Manhattan distance $|r - r_G| + |c - c_G|$.",
          "Start with $g(S) = 0$ and $S$ in OPEN with $f = h(S)$.",
          "Repeatedly take the OPEN entry with the smallest $f = g + h$. If it is the goal, stop. Otherwise close it and, for each free neighbour $v$, if $g(u) + 1 < g(v)$ update $g(v)$ and add $v$ with its new $f$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): a 4 × 9 map with S at (0, 0), G at (2, 7) and a wall in column 4 on rows 0–2. Initially $f(S) = 0 + h(S) = 2 + 7 = 9$. A* finds the shortest path, 11 moves around the bottom of the wall, after expanding 17 of the 33 free cells.",
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Try it",
        text: "Draw a map in the visualizer with a long wall between S and G and compare how many cells A* expands with how many a breadth-first search would visit.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use a binary heap for OPEN with lazy deletion (skip entries for already closed cells), exactly like Dijkstra's algorithm.",
          "Break ties on $f$ by preferring the smaller $h$ (the node closer to the goal); this cuts expansions sharply on open grids.",
          "Choose a heuristic that matches the moves: Manhattan for 4-directional moves, Chebyshev or octile for 8-directional, straight-line distance for free movement.",
          "With $h = 0$ A* is Dijkstra's algorithm; with only $h$ (ignoring $g$) it is greedy best-first search, which is fast but not optimal.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Overestimating breaks optimality",
        text: "Multiply the heuristic by 3 and A* becomes greedier. On the “Trap for overestimates” preset it then returns a 7-move path although 5 moves suffice (the JavaScript code below reproduces this).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "A heuristic is **admissible** if $h(v) \\le d(v, G)$ for every $v$, and **consistent** if $h(u) \\le c(u, v) + h(v)$ for every edge. Manhattan distance is consistent on a 4-connected grid with unit costs: one move changes it by at most 1.",
      },
      {
        kind: "p",
        text: "With a consistent heuristic, $f$ never decreases along a path, and the reduced costs $c'(u, v) = c(u, v) + h(v) - h(u) \\ge 0$ turn A* into Dijkstra's algorithm on a reweighted graph. So when a node is taken from OPEN its $g$ is optimal, in particular for the goal.",
      },
      {
        kind: "math",
        tex: "f(v) = g(v) + h(v), \\qquad h \\text{ consistent} \\Rightarrow \\text{each node is expanded at most once, with optimal } g",
      },
      {
        kind: "p",
        text: "In the worst case (a useless heuristic) A* is as slow as Dijkstra: $O(E \\log V)$. A perfect heuristic expands only nodes on a shortest path.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Weighted A*** uses $g + w \\cdot h$ with $w > 1$: faster, and the path costs at most $w$ times the optimum.",
          "**IDA*** (iterative deepening A*) needs only linear memory, useful for puzzles like the 15-puzzle.",
          "**Jump point search** speeds up A* on uniform grids by skipping symmetric paths.",
          "Games and robotics combine A* with hierarchical maps, since the open set can be large on big maps.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(d)", average: "O(E \\log V)", worst: "O(E \\log V)" },
    space: "O(V)",
    worstClass: "n log n",
    note: "With a binary heap. $d$ is the length of the shortest path, reached with a perfect heuristic.",
  },
  properties: [
    { label: "Optimal", value: "Yes, if the heuristic never overestimates" },
    { label: "Heuristic here", value: "Manhattan distance (consistent)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "astar_length",
      code: `import heapq

def astar_length(rows):
    """Shortest path length on a grid of 'S', 'G', '#', '.' (4-neighbour moves), or None."""
    R, C = len(rows), len(rows[0])
    start = next((r, c) for r in range(R) for c in range(C) if rows[r][c] == "S")
    goal = next((r, c) for r in range(R) for c in range(C) if rows[r][c] == "G")
    h = lambda r, c: abs(r - goal[0]) + abs(c - goal[1])
    g = {start: 0}
    heap = [(h(*start), h(*start), start)]
    closed = set()
    while heap:
        _, _, u = heapq.heappop(heap)
        if u in closed:
            continue
        if u == goal:
            return g[u]
        closed.add(u)
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            v = (u[0] + dr, u[1] + dc)
            if 0 <= v[0] < R and 0 <= v[1] < C and rows[v[0]][v[1]] != "#" and v not in closed:
                if g[u] + 1 < g.get(v, float("inf")):
                    g[v] = g[u] + 1
                    heapq.heappush(heap, (g[v] + h(*v), h(*v), v))
    return None
`,
      tests: [
        { args: [["S...#....", "....#....", "....#..G.", "........."]], expected: 11 },
        { args: [["S..#.", "...#G", "...##"]], expected: null },
      ],
    },
    {
      language: "javascript",
      entry: "aStarLength",
      code: `// A* with the heuristic multiplied by w. w = 1 is optimal; w > 1 can return longer paths.
function aStarLength(rows, w) {
  const R = rows.length, C = rows[0].length;
  const find = (ch) => { for (let r = 0; r < R; r++) { const c = rows[r].indexOf(ch); if (c >= 0) return [r, c]; } };
  const [sr, sc] = find("S"), [gr, gc] = find("G");
  const key = (r, c) => r * C + c;
  const h = (r, c) => w * (Math.abs(r - gr) + Math.abs(c - gc));
  const g = new Map([[key(sr, sc), 0]]);
  const closed = new Set();
  const open = [{ r: sr, c: sc, f: h(sr, sc), hv: h(sr, sc) }];
  while (open.length) {
    let b = 0;
    for (let i = 1; i < open.length; i++) {
      const x = open[i], y = open[b];
      if (x.f < y.f || (x.f === y.f && (x.hv < y.hv || (x.hv === y.hv && key(x.r, x.c) < key(y.r, y.c))))) b = i;
    }
    const u = open.splice(b, 1)[0];
    const ku = key(u.r, u.c);
    if (closed.has(ku)) continue;
    if (u.r === gr && u.c === gc) return g.get(ku);
    closed.add(ku);
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const vr = u.r + dr, vc = u.c + dc;
      if (vr < 0 || vc < 0 || vr >= R || vc >= C || rows[vr][vc] === "#") continue;
      const kv = key(vr, vc);
      if (closed.has(kv)) continue;
      const ng = g.get(ku) + 1;
      if (ng < (g.get(kv) ?? Infinity)) {
        g.set(kv, ng);
        open.push({ r: vr, c: vc, f: ng + h(vr, vc), hv: h(vr, vc) });
      }
    }
  }
  return null;
}
`,
      tests: [
        { args: [["..S.....", "...#..#.", "....#...", "....G..#"], 1], expected: 5 },
        { args: [["..S.....", "...#..#.", "....#...", "....G..#"], 3], expected: 7 },
      ],
    },
  ],
  visualizer: "a-star",
  practice: [
    {
      id: "astar-h",
      kind: "numeric",
      prompt:
        "On a 4-connected grid, what is the Manhattan heuristic h for the cell (1, 2) when the goal is at (4, 7)?",
      answer: 8,
      explanation: "$|1 - 4| + |2 - 7| = 3 + 5 = 8$.",
      hints: ["Add the row and column differences."],
      objective: "Compute the heuristic",
    },
    {
      id: "astar-h0",
      kind: "mcq",
      prompt: "What does A* become if h(v) = 0 for every v?",
      options: [
        "Dijkstra's algorithm",
        "Greedy best-first search",
        "Depth-first search",
        "It stops working",
      ],
      answer: 0,
      explanation: "With h = 0, f = g, so A* expands nodes in order of distance from the start.",
      distractors: {
        1: "Greedy best-first uses only h, ignoring g.",
        2: "The order is by cost, not depth.",
        3: "h = 0 is admissible, so A* still returns a shortest path.",
      },
      hints: ["What is f when h is always 0?"],
      objective: "Relate A* to Dijkstra",
    },
  ],
  exam: {
    definition:
      "A* is a best-first search that expands the frontier node minimising f(n) = g(n) + h(n), where g is the path cost so far and h a heuristic estimate of the remaining cost.",
    steps: [
      "Insert start with f = h(start).",
      "Pop min-f node; stop at the goal.",
      "Relax neighbours: if g[u] + c < g[v], update g[v] and push with f = g[v] + h(v).",
    ],
    timeComplexity:
      "$O(E \\log V)$ worst case with a binary heap; much less with a good heuristic.",
    spaceComplexity: "$O(V)$ for OPEN, CLOSED and g.",
    correctness:
      "With a consistent heuristic, A* is Dijkstra's algorithm on non-negative reduced costs, so each node is closed with its optimal g; admissibility suffices for optimality of the goal.",
    applications: [
      "Game and robot path planning",
      "Route planning",
      "Puzzle solving (8-puzzle, 15-puzzle)",
      "Planning in AI",
    ],
    limitations: ["Memory grows with the frontier", "Quality depends on the heuristic"],
    faq: [
      {
        q: "Admissible or consistent?",
        a: "Admissible (never overestimates) guarantees an optimal result; consistent additionally guarantees no node needs to be reopened. Consistent implies admissible.",
      },
    ],
    answers: [
      { marks: 2, outline: ["f = g + h; expand min f.", "Optimal with an admissible heuristic."] },
      {
        marks: 5,
        outline: ["Algorithm (2).", "Heuristic properties (1).", "Example (1).", "Complexity (1)."],
      },
      {
        marks: 10,
        outline: [
          "Problem and relation to Dijkstra (1).",
          "Pseudocode (2).",
          "Admissibility and consistency with definitions (2).",
          "Optimality proof via reduced costs (3).",
          "Worked example on a grid and variants (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "P. E. Hart, N. J. Nilsson, B. Raphael, “A formal basis for the heuristic determination of minimum cost paths,” IEEE Transactions on Systems Science and Cybernetics, 4(2), 1968.",
      supports: "The A* algorithm and its optimality with admissible heuristics.",
    },
    {
      citation:
        "S. Russell, P. Norvig, Artificial Intelligence: A Modern Approach, 3rd ed., Prentice Hall, 2010, §3.5–3.6.",
      supports: "Informed search, admissibility, consistency and heuristic design.",
    },
    {
      citation:
        "I. Pohl, “Heuristic search viewed as path finding in a graph,” Artificial Intelligence, 1(3–4), 1970.",
      supports: "Weighted heuristic search.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
