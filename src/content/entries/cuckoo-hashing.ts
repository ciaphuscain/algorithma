import type { AlgorithmEntry } from "../types";

export const cuckooHashingEntry: AlgorithmEntry = {
  slug: "cuckoo-hashing",
  name: "Cuckoo Hashing",
  aliases: ["Two-choice hashing with eviction"],
  curriculum: [71],
  domain: "arrays-hashing",
  subcategory: "Hash tables",
  difficulty: "advanced",
  summary:
    "Gives every key exactly two possible slots, one in each of two tables, so a lookup checks at most two places. An insertion that finds both taken evicts the occupant, which moves to its other slot, possibly evicting another key.",
  tags: ["hashing", "hash table", "worst-case lookup", "eviction", "random graphs"],
  prerequisites: ["Open Addressing (Linear Probing and Double Hashing)"],
  related: ["open-addressing", "robin-hood-hashing", "hash-chaining", "union-find"],
  problem: {
    input: "Insert, find and delete operations on integer keys; two tables of $m$ slots each.",
    output: "Each operation's answer (an insert may fail if no placement exists) and both tables.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A cuckoo lays its egg in another bird's nest and the chick pushes the other eggs out. In cuckoo hashing a new key goes into its slot in the first table, pushing out whatever was there. The evicted key moves to its slot in the second table, perhaps pushing out another key, which moves back to the first table, and so on, until someone lands in an empty slot.",
      },
      {
        kind: "p",
        text: "The reward is at lookup time: a key can only ever be in one of two places, so a search checks exactly two slots, however full the table is. The risk is at insertion time: the evictions can go round in a circle, and then no arrangement of the keys exists for these hash functions.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Key $k$ may be in $T_1[h_1(k)]$ or $T_2[h_2(k)]$. Here $h_1(k) = k \\bmod m$ and $h_2(k) = \\lfloor k/m \\rfloor \\bmod m$.",
          "**Find and delete** look in those two slots only.",
          "**Insert:** put $k$ in $T_1[h_1(k)]$. If that evicts a key $x$, put $x$ in its slot of the other table, and repeat with whatever $x$ evicts.",
          "If the evictions continue for more than $2(n+1)$ steps (with $n$ keys stored), they are going round a cycle: undo them and refuse the key. A real implementation would choose new hash functions and rebuild (rehash).",
        ],
      },
      { kind: "heading", text: "Worked example: m = 7" },
      {
        kind: "p",
        text: "The keys 3, 10, 17, 24 and 52 all have $h_1 = 3$. Each newcomer takes $T_1[3]$ and evicts the previous one, which finds an empty slot in $T_2$: 3 goes to $T_2[0]$, 10 to $T_2[1]$, 17 to $T_2[2]$ and 24 to $T_2[3]$, while 52 ends in $T_1[3]$. That is four evictions. Searching for 17 then looks at $T_1[3]$ (holding 52) and $T_2[2]$ (holding 17); searching for 31 looks at $T_1[3]$ and $T_2[4]$ and stops: absent after two probes.",
      },
      {
        kind: "p",
        text: "**A cycle** (second preset, $m = 5$): 7, 32 and 57 all have $h_1 = 2$ and $h_2 = 1$, so three keys compete for two slots. The third insertion keeps evicting round the same two slots; after 6 evictions it is undone and refused.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Use good, independent hash functions** for the two tables. The simple functions here make collisions easy to construct, which is useful for teaching but dangerous in practice.",
          "**Keep the load below one half.** With two tables of $m$ slots and random hash functions, insertions succeed with high probability while $n < (1 - \\varepsilon) m$, that is, below 50% of the total space.",
          "**On failure, rehash**: pick new hash functions and re-insert everything. With the load below the threshold this is rare, and the expected insertion cost stays $O(1)$ amortised.",
          "**Variants** store several keys per slot (buckets of 4) or use three or more hash functions; both raise the usable load factor well above 50%.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "The cuckoo graph" },
      {
        kind: "p",
        text: "Draw a vertex for every slot of both tables and an edge for every key, joining $T_1[h_1(k)]$ to $T_2[h_2(k)]$. Placing the keys means directing each edge towards the slot its key occupies, with no slot receiving two keys. That is possible exactly when **every connected component has at most as many edges as vertices** (each component is a tree or contains a single cycle).",
      },
      {
        kind: "p",
        text: "This gives an exact test that does not depend on the insertion procedure. The visualizer's checker builds the graph with union–find and verifies that every refused insertion would have made some component have more edges than vertices, and every accepted one would not. A stress run of 10,000 random workloads, and the property tests, found no case where the eviction limit of $2(n + 1)$ refused an insertion that a placement allowed.",
      },
      { kind: "heading", text: "Costs" },
      {
        kind: "list",
        items: [
          "Find and delete: at most **2 probes in the worst case**.",
          "Insert: $O(1)$ expected (amortised over rehashes) with random hash functions and load below $\\frac{1}{2}$ (Pagh and Rodler).",
          "Space: $2m$ slots for fewer than $m$ keys.",
        ],
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Random graphs.** The 50% threshold comes from the random bipartite graph: below it, components are small and have at most one cycle with high probability; above it, a giant component with many cycles appears.",
          "**Cuckoo filters** store short fingerprints instead of keys to build approximate set-membership structures that, unlike Bloom filters, support deletion.",
          "**A stash**, a few extra slots for keys that failed to place, makes failures far rarer.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    space: "\\Theta(m)",
    worstClass: "1",
    note: "Worst case for find and delete; inserts are $O(1)$ expected amortised with random hash functions and load below one half.",
  },
  properties: [
    { label: "Lookup", value: "At most two probes, always" },
    { label: "Insert", value: "May fail; then rehash" },
    { label: "Load factor", value: "Below 1/2 with two tables of one slot each" },
  ],
  implementations: [
    {
      language: "python",
      entry: "insert_all",
      code: `def insert_all(m, keys):
    """Cuckoo-insert keys; return (T1, T2, results). Failed inserts are undone."""
    T = [[None] * m, [None] * m]
    h = [lambda k: k % m, lambda k: (k // m) % m]
    results = []
    n = 0
    for k in keys:
        if T[0][h[0](k)] == k or T[1][h[1](k)] == k:
            results.append("present")
            continue
        moves, x, t = [], k, 0
        for _ in range(2 * (n + 1)):
            s = h[t](x)
            moves.append((t, s, T[t][s]))
            T[t][s], x = x, T[t][s]
            if x is None:
                break
            t = 1 - t
        if x is None:
            n += 1
            results.append("inserted")
        else:
            for t, s, old in reversed(moves):
                T[t][s] = old
            results.append("failed")
    return [T[0], T[1], results]
`,
      tests: [
        {
          args: [7, [3, 10, 17, 24, 52]],
          expected: [
            [null, null, null, 52, null, null, null],
            [3, 10, 17, 24, null, null, null],
            ["inserted", "inserted", "inserted", "inserted", "inserted"],
          ],
        },
        {
          args: [5, [7, 32, 57, 1]],
          expected: [
            [null, 1, 32, null, null],
            [null, 7, null, null, null],
            ["inserted", "inserted", "failed", "inserted"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "feasible",
      code: `// Can every key sit in T1[k % m] or T2[floor(k / m) % m]? Union-find on the cuckoo
// graph: each component must have no more edges (keys) than vertices (slots).
function feasible(m, keys) {
  const parent = Array.from({ length: 2 * m }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const k of keys) parent[find(k % m)] = find(m + (Math.floor(k / m) % m));
  const edges = new Map(), verts = new Map();
  for (let v = 0; v < 2 * m; v++) verts.set(find(v), (verts.get(find(v)) ?? 0) + 1);
  for (const k of keys) edges.set(find(k % m), (edges.get(find(k % m)) ?? 0) + 1);
  return [...edges].every(([r, e]) => e <= verts.get(r));
}
`,
      tests: [
        { args: [5, [7, 32]], expected: true },
        { args: [5, [7, 32, 57]], expected: false },
        { args: [7, [3, 10, 17, 24, 52]], expected: true },
      ],
    },
  ],
  visualizer: "cuckoo-hashing",
  practice: [
    {
      id: "cuckoo-lookup",
      kind: "numeric",
      prompt: "At most how many slots does a cuckoo-hashing lookup examine, with two tables?",
      answer: 2,
      explanation: "A key can only be in $T_1[h_1(k)]$ or $T_2[h_2(k)]$.",
      hints: ["How many places is a key allowed to be?"],
      objective: "State the worst-case lookup",
    },
    {
      id: "cuckoo-slots",
      kind: "mcq",
      prompt:
        "With $m = 7$, $h_1(k) = k \\bmod 7$ and $h_2(k) = \\lfloor k/7 \\rfloor \\bmod 7$, where may key 24 live?",
      options: [
        "$T_1[3]$ or $T_2[3]$",
        "$T_1[3]$ or $T_2[0]$",
        "$T_1[0]$ or $T_2[3]$",
        "Anywhere in $T_1$",
      ],
      answer: 0,
      explanation: "$24 \\bmod 7 = 3$ and $\\lfloor 24/7 \\rfloor = 3$, so $h_2 = 3$.",
      distractors: {
        1: "$h_2(24) = 3 \\bmod 7 = 3$, not 0.",
        2: "$h_1(24) = 24 \\bmod 7 = 3$.",
        3: "Each key has exactly one slot per table.",
      },
      hints: ["Compute both hash values."],
      objective: "Compute the two choices",
    },
    {
      id: "cuckoo-fail",
      kind: "mcq",
      prompt: "When must a cuckoo insertion fail, whatever eviction order is used?",
      options: [
        "When some component of the cuckoo graph would have more keys (edges) than slots (vertices)",
        "When both of the key's slots are occupied",
        "When the load factor exceeds one half",
        "When the key was inserted before",
      ],
      answer: 0,
      explanation:
        "Each key needs a distinct slot among those it can use; a component with more edges than vertices has more keys than available slots.",
      distractors: {
        1: "That just starts the evictions; they usually succeed.",
        2: "Above one half, failure becomes likely with random hash functions, but individual insertions can still succeed.",
        3: "A duplicate is reported as present, not as a failure.",
      },
      hints: ["Think of keys as edges between their two slots."],
      objective: "Characterise failure",
    },
  ],
  exam: {
    definition:
      "Cuckoo hashing stores each key $k$ in one of two places, $T_1[h_1(k)]$ or $T_2[h_2(k)]$; insertion evicts occupants to their alternative slots, and a cycle of evictions triggers a rehash.",
    steps: [
      "Lookup/delete: check the two candidate slots.",
      "Insert: place in $T_1[h_1(k)]$; move each evicted key to its slot in the other table; repeat.",
      "If evictions exceed a limit, undo or rehash with new hash functions.",
    ],
    timeComplexity:
      "$O(1)$ worst case for lookup and delete; $O(1)$ expected amortised insert at load below 1/2 with random hash functions.",
    spaceComplexity: "$\\Theta(m)$ for two tables of $m$ slots, holding fewer than $m$ keys.",
    correctness:
      "Every key is always in one of its two slots, so a lookup that checks both is correct; an insertion succeeds exactly when the cuckoo graph's component has at most as many edges as vertices.",
    applications: [
      "Lookup tables needing guaranteed constant-time reads, e.g. network packet processing",
      "Cuckoo filters for approximate membership",
    ],
    limitations: [
      "Load factor limited to about 50% with one key per slot",
      "Insertions can fail and need a rehash",
      "Needs good, independent hash functions",
    ],
    faq: [
      {
        q: "Why is lookup worst-case constant but insertion only expected constant?",
        a: "Lookups touch two fixed slots; insertions may trigger long eviction chains or a rehash.",
      },
      {
        q: "What happens to the evicted keys when an insertion fails?",
        a: "Here the evictions are undone; in practice the table is rebuilt with new hash functions.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Two tables, two hash functions; each key in one of two slots.",
          "Worst-case $O(1)$ lookup; insertion by eviction.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Lookup and the eviction loop for insertion (2).",
          "Example with at least one eviction (1).",
          "Failure, rehashing and the load limit (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and motivation (worst-case lookups) — 1.",
          "Lookup, delete, insertion with eviction and limit — 3.",
          "Worked example with an eviction chain and a cycle — 3.",
          "Cuckoo graph and the condition for failure — 2.",
          "Costs and the 50% load threshold — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation: "R. Pagh, F. F. Rodler, “Cuckoo hashing”, Journal of Algorithms 51(2), 2004.",
      supports:
        "The algorithm, worst-case constant lookups, expected constant insertion below load 1/2, and rehashing.",
    },
    {
      citation:
        "L. Devroye, P. Morin, “Cuckoo hashing: further analysis”, Information Processing Letters 86(4), 2003.",
      supports: "The cuckoo graph and the probability that insertions fail.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
