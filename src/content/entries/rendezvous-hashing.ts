import type { AlgorithmEntry } from "../types";

export const rendezvousHashingEntry: AlgorithmEntry = {
  slug: "rendezvous-hashing",
  name: "Rendezvous Hashing",
  aliases: ["Highest random weight (HRW) hashing"],
  curriculum: [85],
  domain: "arrays-hashing",
  subcategory: "Hash functions",
  difficulty: "intermediate",
  summary:
    "Every key scores every server with a hash of the pair and goes to the highest scorer. Removing a server moves only its own keys, each to its runner-up; adding one moves only the keys it now wins.",
  tags: ["hashing", "distributed systems", "load balancing", "caching", "sharding"],
  prerequisites: ["Hash Table (Separate Chaining)"],
  related: ["consistent-hashing", "hash-chaining"],
  problem: {
    input: "A set of servers, a set of keys, and one change: a server added or removed.",
    output: "The server of every key before and after the change, and the keys that moved.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each key holds an election among the servers. The ballots are pseudo-random scores, $\\text{hash}(\\text{key}, \\text{server})$, so every client computing them gets the same result without talking to anyone, and the server with the highest score wins the key.",
      },
      {
        kind: "p",
        text: "If the winner leaves, the key goes to its runner-up, and no other key is affected, because their winners are still there. If a new server joins, it wins exactly the keys for which it scores higher than their current winner.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For key $k$, compute $\\text{score}(k, s) = \\text{hash}(k, s)$ for every server $s$; here scores are reduced to 0–999 for display.",
          "Assign $k$ to the server with the highest score (ties go to the alphabetically first server).",
          "After a change, recompute; a key moves only if its winner left, or a new server beat it.",
        ],
      },
      { kind: "heading", text: "Worked example: servers A, B, C, D; six keys" },
      {
        kind: "table",
        head: ["Key", "A", "B", "C", "D", "Winner"],
        rows: [
          ["apple", "967", "555", "668", "189", "A"],
          ["fig", "186", "710", "520", "592", "B"],
          ["kiwi", "636", "266", "803", "302", "C"],
          ["lime", "14", "359", "545", "616", "D"],
          ["pear", "264", "800", "341", "95", "B"],
          ["plum", "33", "707", "506", "142", "B"],
        ],
      },
      {
        kind: "p",
        text: "Removing C affects only kiwi, the one key C had won: its runner-up is A with 636. In the second preset (servers A, B, C, then adding D), D outscores the current winner only for lime (616 against C's 545), so only lime moves.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**A lookup costs one hash per server:** $O(n)$. That is fine for tens of servers; for thousands, use a hierarchy (group servers, pick a group, then a server) or a hash ring.",
          "**Replication is natural:** take the top $r$ scorers as the key's replicas. When one fails, the next in the list takes over.",
          "**Weighted servers:** scale scores so that a server's chance of winning is proportional to its weight, for example with $-w/\\ln(u)$ where $u$ is the hash mapped to $(0, 1)$.",
          "**Hash the pair, not the parts:** combine key and server into one input (here `key|server`) and use a well-mixing hash; poor mixing makes some servers win too often.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Minimal movement" },
      {
        kind: "p",
        text: "The winner of key $k$ is $\\arg\\max_s \\text{score}(k, s)$ over the current servers. Removing a server $x$ changes this maximum only if $x$ was the winner; adding $y$ changes it only if $\\text{score}(k, y)$ exceeds the old maximum, and then the new winner is $y$. The checker verifies both on every run, together with an independent recomputation of every winner.",
      },
      { kind: "heading", text: "Balance" },
      {
        kind: "p",
        text: "If the scores behave like independent random numbers, each of the $n$ servers is the maximum with probability $1/n$, so each gets about $K/n$ of $K$ keys, and after a server joins it takes about $K/(n+1)$, all of them from the others, evenly. No virtual nodes are needed.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Comparison with consistent hashing:** rendezvous hashing needs no shared ring and balances without virtual nodes, but each lookup costs $O(n)$ hashes instead of $O(\\log n)$.",
          "**Uses:** choosing cache servers for web objects, the original motivation, and placing data replicas in distributed storage.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(1)",
    worstClass: "n",
    note: "Per lookup, for $n$ servers; no shared data structure is needed beyond the server list.",
  },
  properties: [
    { label: "Keys moved when a server leaves", value: "Only the keys it had won" },
    { label: "Balance", value: "About $K/n$ keys per server without virtual nodes" },
  ],
  implementations: [
    {
      language: "python",
      entry: "winners",
      code: `def winners(scores):
    """scores: {key: {server: score}}. Highest score wins; ties go to the smaller name."""
    return {k: min(s, key=lambda x: (-s[x], x)) for k, s in scores.items()}
`,
      tests: [
        {
          args: [
            { kiwi: { A: 636, B: 266, C: 803, D: 302 }, lime: { A: 14, B: 359, C: 545, D: 616 } },
          ],
          expected: { kiwi: "C", lime: "D" },
        },
        {
          args: [{ kiwi: { A: 636, B: 266, D: 302 } }],
          expected: { kiwi: "A" },
        },
      ],
    },
    {
      language: "javascript",
      entry: "moved",
      code: `// Keys whose winner changes when a server is removed. scores: {key: {server: score}}.
function moved(scores, removed) {
  const best = (s, skip) =>
    Object.keys(s)
      .filter((x) => x !== skip)
      .sort((a, b) => s[b] - s[a] || (a < b ? -1 : 1))[0];
  return Object.keys(scores).filter((k) => best(scores[k]) !== best(scores[k], removed));
}
`,
      tests: [
        {
          args: [
            {
              apple: { A: 967, B: 555, C: 668, D: 189 },
              kiwi: { A: 636, B: 266, C: 803, D: 302 },
              pear: { A: 264, B: 800, C: 341, D: 95 },
            },
            "C",
          ],
          expected: ["kiwi"],
        },
      ],
    },
  ],
  visualizer: "rendezvous-hashing",
  practice: [
    {
      id: "hrw-winner",
      kind: "mcq",
      prompt: "fig scores A 186, B 710, C 520, D 592. B is removed. Where does fig go?",
      options: ["D", "C", "A", "It stays on B"],
      answer: 0,
      explanation: "Among the remaining servers, D has the highest score, 592.",
      distractors: {
        1: "520 is lower than D's 592.",
        2: "A has the lowest score.",
        3: "A removed server can hold no keys.",
      },
      hints: ["Take the highest score among the servers that remain."],
      objective: "Find the runner-up",
    },
    {
      id: "hrw-add",
      kind: "numeric",
      prompt:
        "Six keys are spread over A, B and C. A server D joins, and in the worked example it outscores the current winner for exactly one key. How many keys move?",
      answer: 1,
      explanation:
        "Only keys for which D is the new maximum move, and all of them move to D: lime.",
      hints: ["A key moves only if the newcomer beats its current winner."],
      objective: "Apply minimal movement",
    },
    {
      id: "hrw-cost",
      kind: "mcq",
      prompt:
        "What is the main cost of rendezvous hashing compared with a consistent-hashing ring?",
      options: [
        "Each lookup computes a score for every server: $O(n)$",
        "It moves more keys when servers change",
        "It needs virtual nodes to balance load",
        "It needs a shared, sorted ring",
      ],
      answer: 0,
      explanation:
        "A ring lookup is a binary search, $O(\\log n)$; rendezvous hashing evaluates all $n$ servers.",
      distractors: {
        1: "Both move only the keys they must.",
        2: "Rendezvous hashing balances without virtual nodes.",
        3: "That is consistent hashing's requirement, not rendezvous hashing's.",
      },
      hints: ["How many hashes does one lookup compute?"],
      objective: "Compare with consistent hashing",
    },
  ],
  exam: {
    definition:
      "Rendezvous (highest-random-weight) hashing assigns each key to the server with the highest value of $\\text{hash}(\\text{key}, \\text{server})$.",
    steps: [
      "For a key, compute the score of every server.",
      "Choose the highest (ties broken consistently).",
      "When servers change, recompute: only keys whose winner left, or that a new server wins, move.",
    ],
    timeComplexity: "$O(n)$ hash evaluations per lookup.",
    spaceComplexity: "$O(1)$ beyond the list of servers.",
    correctness:
      "The arg-max over a set changes on removal only if the removed element was the maximum, and on insertion only if the new element exceeds it.",
    applications: [
      "Cache server selection",
      "Replica placement (top $r$ scorers)",
      "Sharding with a small number of servers",
    ],
    limitations: ["$O(n)$ per lookup for $n$ servers", "Needs a well-mixing hash of the pair"],
    faq: [
      {
        q: "How are replicas chosen?",
        a: "Take the $r$ highest-scoring servers for the key.",
      },
      {
        q: "Does it need virtual nodes?",
        a: "No: with independent-looking scores each server wins about $1/n$ of the keys.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Each key goes to the server with the highest hash(key, server).",
          "Minimal movement on server changes; $O(n)$ lookups.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Lookup procedure (1).",
          "Example with a removal (2).",
          "Comparison with consistent hashing (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Motivation and definition — 2.",
          "Algorithm and tie-breaking — 2.",
          "Worked score table with a removal and an addition — 3.",
          "Proof of minimal movement and balance — 2.",
          "Comparison with consistent hashing — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. G. Thaler, C. V. Ravishankar, “Using name-based mappings to increase hit rates”, IEEE/ACM Transactions on Networking 6(1), 1998.",
      supports: "Highest-random-weight hashing, its minimal disruption and balance.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
