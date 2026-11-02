import type { AlgorithmEntry } from "../types";

export const consistentHashingEntry: AlgorithmEntry = {
  slug: "consistent-hashing",
  name: "Consistent Hashing",
  aliases: ["Hash ring", "Karger hashing"],
  curriculum: [84],
  domain: "arrays-hashing",
  subcategory: "Hash functions",
  difficulty: "intermediate",
  summary:
    "Places servers and keys on a circle by hashing; each key belongs to the next server clockwise. When a server joins or leaves, only the keys next to it move, instead of almost all keys as with hash mod n.",
  tags: [
    "hashing",
    "distributed systems",
    "load balancing",
    "caching",
    "sharding",
    "virtual nodes",
  ],
  prerequisites: ["Hash Table (Separate Chaining)"],
  related: ["rendezvous-hashing", "hash-chaining"],
  problem: {
    input: "A set of servers, a set of keys, and one change: a server added or removed.",
    output: "The server of every key before and after the change, and the keys that moved.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A cache spread over $n$ servers could send key $k$ to server $\\text{hash}(k) \\bmod n$. But when a server is added, $n$ changes and almost every key lands somewhere new: the caches go cold all at once.",
      },
      {
        kind: "p",
        text: "Consistent hashing puts servers and keys on the same circle by hashing both. A key walks clockwise and stops at the first server it meets. A new server only takes the keys on the arc just before it; a server that leaves hands its keys to the next server along. All other keys stay put.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Hash each server to a position on the ring; this visualizer uses $0$–$359°$, with 0° at the top and positions increasing clockwise.",
          "Hash each key to a position; its server is the first server position clockwise from it (inclusive).",
          "**Add a server:** keys between its position and the previous server position move to it.",
          "**Remove a server:** its keys move to the next server position clockwise.",
          "**Virtual nodes:** give each server several positions (hashing “A”, “A#1”, “A#2”, …) so each server owns many small arcs.",
        ],
      },
      { kind: "heading", text: "Worked example: servers A, B, C; eight keys" },
      {
        kind: "p",
        text: "A is at 316°, B at 58° and C at 270°. C owns the arc from 58° up to 270°, the largest, and gets 5 of the 8 keys; A gets 2 (plum and lemon) and B 1 (lime). Adding D at 142° moves only **date** (at 133°), which now meets D before C, leaving C with 4. The other seven keys keep their servers. In the second preset, removing C from A, B, C, D hands apple, fig, kiwi and pear to the next server clockwise, A; no other key moves.",
      },
      {
        kind: "p",
        text: "**Uneven shares.** One position per server leaves the arcs to chance: on this 360° ring, A owns 13% of the circle, B 28% and C 59%. Three positions per server (third preset) do not fix it: C's three positions happen to cluster, and C owns only 3% of the ring. Balancing needs many virtual nodes on a large ring. Measured on a full 32-bit ring, three servers own 56%, 26% and 18% with one position each, 37%, 31% and 32% with 100, and 33%, 34% and 33% with 1,000.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Keep the positions sorted** (a sorted array or balanced tree) and find a key's server by binary search for the first position $\\ge$ the key's: $O(\\log(nv))$ for $n$ servers with $v$ virtual nodes each.",
          "**Use a large ring:** a 32- or 64-bit hash space. The 360 positions here are for drawing; with many virtual nodes on so small a ring, positions collide.",
          "**Use a well-mixing hash.** This visualizer uses FNV-1a followed by MurmurHash3's finalizer; FNV-1a alone places one-letter names within a few degrees of each other.",
          "**Replication:** store each key on the next $r$ distinct servers clockwise, so a failed server's keys are already elsewhere.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "How many keys move" },
      {
        kind: "p",
        text: "With random positions and $n$ servers, a new server's arc is expected to cover $1/(n+1)$ of the ring, so it takes about $K/(n+1)$ of $K$ keys, and those are the only keys that move. With $\\text{hash}(k) \\bmod n$, going from $n$ to $n+1$ servers keeps a key in place only if its hash gives the same remainder for both, which happens for about $1/(n+1)$ of keys: about $\\frac{n}{n+1}$ of all keys move.",
      },
      { kind: "heading", text: "Minimal movement, as a checked property" },
      {
        kind: "p",
        text: "Adding a server can only make it the first position clockwise for some keys; for every other key the first position is unchanged. Removing a server changes only the keys whose first position was one of its own. The checker in this visualizer verifies both facts on every run, alongside an independent recomputation of every key's server.",
      },
      { kind: "heading", text: "Balance" },
      {
        kind: "p",
        text: "With one position per server, the largest arc among $n$ random positions is about $\\frac{\\ln n}{n}$ of the ring, not $\\frac{1}{n}$. With $v = \\Theta(\\log n)$ virtual nodes per server each server's share is within a constant factor of $1/n$ with high probability, and more virtual nodes bring the shares closer still, as the measurements above show.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Distributed caches and databases** use consistent hashing with virtual nodes to spread data and to rebalance smoothly; Amazon's Dynamo is a well-known example.",
          "**Bounded loads:** a variant caps each server at $(1 + \\varepsilon)$ times the average load, passing overflow keys to the next server.",
          "**Rendezvous hashing** achieves the same minimal movement without a ring, at $O(n)$ cost per lookup.",
          "**Jump consistent hash** maps keys to numbered buckets $0..n-1$ with no memory at all, when servers are only ever added or removed at the end.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(\\log(nv))", average: "O(\\log(nv))", worst: "O(\\log(nv))" },
    space: "\\Theta(nv)",
    worstClass: "log n",
    note: "Per lookup with sorted positions ($n$ servers, $v$ virtual nodes each). This visualizer scans all positions instead, for clarity.",
  },
  properties: [
    { label: "Keys moved when a server joins", value: "Only those it takes over: about $K/(n+1)$" },
    { label: "Balance", value: "Needs many virtual nodes" },
  ],
  implementations: [
    {
      language: "python",
      entry: "owners",
      code: `from bisect import bisect_left

def owners(server_pos, key_pos, ring=360):
    """server_pos: {server: position}; key_pos: {key: position}.
    Each key goes to the first server at or after it, clockwise."""
    ring_list = sorted((p, s) for s, p in server_pos.items())
    positions = [p for p, _ in ring_list]
    result = {}
    for k, p in key_pos.items():
        i = bisect_left(positions, p) % len(ring_list)
        result[k] = ring_list[i][1]
    return result
`,
      tests: [
        {
          args: [
            { A: 316, B: 58, C: 270 },
            { apple: 248, lime: 335, date: 133, plum: 316 },
          ],
          expected: { apple: "C", lime: "B", date: "C", plum: "A" },
        },
        {
          args: [
            { A: 316, B: 58, C: 270, D: 142 },
            { apple: 248, lime: 335, date: 133, plum: 316 },
          ],
          expected: { apple: "C", lime: "B", date: "D", plum: "A" },
        },
      ],
    },
    {
      language: "javascript",
      entry: "movedFraction",
      code: `// Fraction of keys that change server when going from n to n + 1 servers
// with "hash mod n" placement, for hashes 0..K-1.
function movedFraction(n, K) {
  let moved = 0;
  for (let h = 0; h < K; h++) if (h % n !== h % (n + 1)) moved++;
  return moved / K;
}
`,
      tests: [
        { args: [4, 20], expected: 0.8 },
        { args: [9, 90], expected: 0.9 },
      ],
    },
  ],
  visualizer: "consistent-hashing",
  practice: [
    {
      id: "ch-owner",
      kind: "mcq",
      prompt: "Servers sit at 58°, 270° and 316°. Which one owns a key at 335°?",
      options: [
        "The server at 58° (after wrapping past 0°)",
        "The server at 316°",
        "The server at 270°",
        "None",
      ],
      answer: 0,
      explanation:
        "Walking clockwise from 335°, no server lies before 360°, so the walk wraps to 0° and meets the server at 58°.",
      distractors: {
        1: "316° is behind the key; ownership goes clockwise, to the next position after the key.",
        2: "270° is also behind the key.",
        3: "Every key has an owner as long as one server exists.",
      },
      hints: ["The ring wraps around from 359° to 0°."],
      objective: "Find a key's server",
    },
    {
      id: "ch-mod",
      kind: "mcq",
      prompt:
        "A cache uses server = hash(key) mod n and grows from 4 to 5 servers. About what fraction of keys change server?",
      options: ["About 80%", "About 20%", "About 25%", "None"],
      answer: 0,
      explanation:
        "A key stays only if hash mod 4 = hash mod 5, which holds for 4 of every 20 consecutive hash values: 80% move. Consistent hashing would move about $1/5 = 20\\%$.",
      distractors: {
        1: "That is what consistent hashing moves, not mod-n hashing.",
        2: "Mod-n hashing moves far more than one server's worth of keys.",
        3: "Changing $n$ changes most remainders.",
      },
      hints: ["For which values of $h$ is $h \\bmod 4 = h \\bmod 5$? Try $h = 0..19$."],
      objective: "Compare with mod-n hashing",
    },
    {
      id: "ch-vnodes",
      kind: "mcq",
      prompt: "Why do real systems give each server many positions (virtual nodes) on the ring?",
      options: [
        "To even out the share of the ring, and so the load, each server gets",
        "To make lookups faster",
        "So that no key ever moves",
        "To reduce memory use",
      ],
      answer: 0,
      explanation:
        "With one position each, arc lengths vary widely (56%, 26% and 18% in the measurement above); with hundreds of positions per server the shares approach $1/n$.",
      distractors: {
        1: "More positions make the sorted list longer, so lookups get slightly slower.",
        2: "Keys still move when servers join or leave.",
        3: "Each virtual node costs memory.",
      },
      hints: ["Compare the measured shares for 1, 100 and 1,000 positions."],
      objective: "Explain virtual nodes",
    },
  ],
  exam: {
    definition:
      "Consistent hashing maps servers and keys onto a circular hash space; each key is assigned to the first server clockwise from its position, so adding or removing a server reassigns only the keys adjacent to it.",
    steps: [
      "Hash servers (with several virtual nodes each) onto the ring and keep the positions sorted.",
      "For a key, find the first server position at or after its hash (wrapping around).",
      "On adding/removing a server, only keys on the affected arcs change owner.",
    ],
    timeComplexity: "$O(\\log(nv))$ per lookup with binary search.",
    spaceComplexity: "$\\Theta(nv)$ for the positions.",
    correctness:
      "Adding a server changes the first clockwise position only for keys in the arc it takes over; removing one only for keys it owned.",
    applications: [
      "Distributed caches and key-value stores (partitioning, replication)",
      "Load balancers with sticky assignment",
    ],
    limitations: [
      "Uneven load without many virtual nodes",
      "Extra metadata (the ring) must be shared by all clients",
    ],
    faq: [
      {
        q: "How many keys move when a server joins?",
        a: "About $K/(n+1)$: the keys in the new server's arcs. With hash mod $n$, about $\\frac{n}{n+1}$ of all keys move.",
      },
      {
        q: "Why not just use hash mod n?",
        a: "Because changing $n$ remaps almost every key.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Servers and keys hashed onto a ring; each key goes to the next server clockwise.",
          "Only neighbouring keys move when servers change.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Problem with mod-$n$ hashing (1).",
          "The ring and the clockwise rule (2).",
          "Example of adding a server (1).",
          "Virtual nodes for balance (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Motivation: remapping cost of mod-$n$ — 2.",
          "Ring construction, lookup by binary search — 2.",
          "Worked example of a join and a leave — 3.",
          "Expected movement and balance analysis, virtual nodes — 2.",
          "Applications — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. Karger, E. Lehman, T. Leighton, R. Panigrahy, M. Levine, D. Lewin, “Consistent hashing and random trees: distributed caching protocols for relieving hot spots on the World Wide Web”, Proc. 29th ACM Symposium on Theory of Computing (STOC), 1997.",
      supports: "The method, its minimal movement and balance with multiple positions per server.",
    },
    {
      citation:
        "G. DeCandia et al., “Dynamo: Amazon's highly available key-value store”, Proc. 21st ACM Symposium on Operating Systems Principles (SOSP), 2007.",
      supports:
        "Consistent hashing with virtual nodes and replication in a production key-value store.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
