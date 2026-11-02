import type { AlgorithmEntry } from "../types";

export const robinHoodHashingEntry: AlgorithmEntry = {
  slug: "robin-hood-hashing",
  name: "Robin Hood Hashing",
  aliases: ["Robin Hood linear probing"],
  curriculum: [70],
  domain: "arrays-hashing",
  subcategory: "Hash tables",
  difficulty: "advanced",
  summary:
    "Linear probing in which a key that has travelled further from its home slot takes the place of one that has travelled less. Distances even out, unsuccessful searches stop early, and deletion needs no tombstones.",
  tags: ["hashing", "hash table", "linear probing", "open addressing", "variance"],
  prerequisites: ["Open Addressing (Linear Probing and Double Hashing)"],
  related: ["open-addressing", "hash-chaining", "cuckoo-hashing"],
  problem: {
    input: "Insert, find and delete operations on integer keys; a table of $m$ slots.",
    output:
      "Each operation's answer and the final slots with each key's distance from its home slot.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In linear probing, a key that arrives late may have to walk far past its home slot while the keys it passes sit right at home. Robin Hood hashing takes from the rich and gives to the poor: when an arriving key has travelled further than the key occupying a slot, it takes that slot, and the displaced key continues the walk instead.",
      },
      {
        kind: "p",
        text: "The total distance travelled stays the same, but it is shared more fairly, so no key ends up very far from home. And because keys are ordered by distance, a search can give up as soon as it meets a key closer to home than the search has come.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Each slot stores a key and its distance $D$ from its home slot $k \\bmod m$.",
          "**Find $k$:** walk from home, probe $i = 0, 1, \\dots$ Stop with *absent* at an empty slot, or at a slot whose $D < i$: had $k$ been inserted, it would have taken that slot.",
          "**Insert $k$:** walk as in find with distance $d$. At each occupied slot, if its $D < d$, swap: $k$ (with $d$) takes the slot and the evicted key continues with its own distance. Place whatever key is carried into the first empty slot.",
          "**Delete $k$:** empty its slot, then move each following key with $D > 0$ back one slot (decreasing $D$), stopping at an empty slot or a key at home.",
        ],
      },
      { kind: "heading", text: "Worked example: m = 11, insert 13, 1, 12, 23, 34" },
      {
        kind: "p",
        text: "13 sits at home in slot 2 and 1 at home in slot 1. Then 12, 23 and 34 all have home 1. Each time, the newcomer reaches 13, finds it closer to home than itself, and takes its slot; 13 is pushed one place further each time.",
      },
      {
        kind: "table",
        head: ["Slot", "1", "2", "3", "4", "5", "6"],
        rows: [
          ["Robin Hood: key (distance)", "1 (0)", "12 (1)", "23 (2)", "34 (3)", "13 (3)", ""],
          ["Linear probing: key (distance)", "1 (0)", "13 (0)", "12 (2)", "23 (3)", "34 (4)", ""],
        ],
      },
      {
        kind: "p",
        text: "Both layouts have total distance 9, but Robin Hood's largest distance is 3 against linear probing's 4. A search for the absent key 45 (home 1) stops at slot 5 after 5 probes, because 13 there is only 3 from home while the search has come 4; plain linear probing walks on to the empty slot 6: 6 probes. The run makes 3 Robin Hood swaps.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Store the distance (or the hash) with each key**, so comparisons do not recompute hashes.",
          "**Backward-shift deletion** keeps the table free of tombstones: every key after the deleted one moves one slot closer to home until a key already at home or an empty slot.",
          "**Search for $k$ before inserting** if duplicates are not allowed; the search's stopping point is exactly where the insertion's walk can resume.",
          "Like all linear probing, Robin Hood hashing is cache-friendly; it keeps working at fairly high load factors because long probe sequences become rare.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Invariants" },
      {
        kind: "p",
        text: "For a key in slot $s$ with home $h$: (1) every slot from $h$ to $s$ is occupied, and (2) along occupied slots, distance rises by at most one from one slot to the next: $D[s+1] \\le D[s] + 1$. The swap rule keeps (2): a key only passes a slot whose occupant is at least as far from home. The checker in this visualizer verifies both on the final table.",
      },
      { kind: "heading", text: "Why searches can stop early" },
      {
        kind: "p",
        text: "If $k$ were in the table at distance $d_k \\ge i$, then when it was inserted it would have passed slot $s$ at probe $i$, and the swap rule would have taken that slot from any occupant with distance less than $i$. So an occupant with $D[s] < i$ proves $k$ is absent.",
      },
      { kind: "heading", text: "What it changes" },
      {
        kind: "p",
        text: "For linear probing the total (hence average) distance of a given set of keys does not depend on which key wins each collision, so Robin Hood hashing has the same expected successful-search cost as ordinary linear probing; the example's totals are both 9. What it reduces is the *variance*: the spread of distances is much narrower, which shortens the longest searches and makes unsuccessful searches cheaper (Celis, Larson and Munro).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Worst case.** Devroye, Morin and Viola analysed the maximum displacement of Robin Hood hashing, showing it is much smaller than for plain linear probing at the same load.",
          "**Robin Hood with other probe sequences.** The rule works with any open-addressing sequence; with linear probing it gives the simplest code and backward-shift deletion.",
          "**Comparison.** Cuckoo hashing bounds lookups to two probes in the worst case; Robin Hood keeps a single array and graceful behaviour at high load.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "O(m)" },
    space: "\\Theta(m)",
    worstClass: "n",
    note: "Average for a fixed load factor below 1 with a good hash function; the advantage over linear probing is lower variance, not a lower mean.",
  },
  properties: [
    { label: "Deletion", value: "Backward shift: no tombstones" },
    {
      label: "Unsuccessful search",
      value: "Stops at the first key closer to home than the probe count",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "insert_all",
      code: `def insert_all(m, keys):
    """Insert distinct keys with Robin Hood linear probing; return (keys, distances)."""
    slot = [None] * m
    dist = [None] * m
    for k in keys:
        s, d = k % m, 0
        while slot[s] is not None:
            if dist[s] < d:
                slot[s], k = k, slot[s]
                dist[s], d = d, dist[s]
            s = (s + 1) % m
            d += 1
        slot[s], dist[s] = k, d
    return [slot, dist]
`,
      tests: [
        {
          args: [11, [13, 1, 12, 23, 34]],
          expected: [
            [null, 1, 12, 23, 34, 13, null, null, null, null, null],
            [null, 0, 1, 2, 3, 3, null, null, null, null, null],
          ],
        },
        {
          args: [3, [3, 6]],
          expected: [
            [3, 6, null],
            [0, 1, null],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "findProbes",
      code: `// Probes a Robin Hood search makes for key k, given slots and distances.
function findProbes(slot, dist, k) {
  const m = slot.length;
  for (let i = 0; i < m; i++) {
    const s = (k % m + i) % m;
    if (slot[s] === null || dist[s] < i) return [false, i + 1];
    if (slot[s] === k) return [true, i + 1];
  }
  return [false, m];
}
`,
      tests: [
        {
          args: [
            [null, 1, 12, 23, 34, 13, null, null, null, null, null],
            [null, 0, 1, 2, 3, 3, null, null, null, null, null],
            45,
          ],
          expected: [false, 5],
        },
        {
          args: [
            [null, 1, 12, 23, 34, 13, null, null, null, null, null],
            [null, 0, 1, 2, 3, 3, null, null, null, null, null],
            13,
          ],
          expected: [true, 4],
        },
      ],
    },
  ],
  visualizer: "robin-hood-hashing",
  practice: [
    {
      id: "rh-swap",
      kind: "mcq",
      prompt:
        "A key with home slot 1 reaches slot 4 (distance 3). Slot 4 holds a key at distance 1. What happens?",
      options: [
        "The arriving key takes slot 4; the other key continues probing with distance 1, then 2, …",
        "The arriving key moves on to slot 5",
        "The table is rehashed",
        "The arriving key is refused",
      ],
      answer: 0,
      explanation:
        "The occupant is richer (closer to home), so the poorer arriving key takes the slot and the occupant continues from slot 5 at distance 2.",
      distractors: {
        1: "That is plain linear probing.",
        2: "Robin Hood hashing never rehashes because of a single collision.",
        3: "Keys are refused only when the table is full.",
      },
      hints: ["Compare the two distances from home."],
      objective: "Apply the swap rule",
    },
    {
      id: "rh-stop",
      kind: "numeric",
      prompt:
        "In the worked example's table, how many probes does an unsuccessful search for 45 (home slot 1) make?",
      answer: 5,
      explanation:
        "Slots 1–4 hold keys with distances 0, 1, 2, 3, each at least the probe count 0, 1, 2, 3. At slot 5, 13 has distance 3 < 4, so the search stops: 5 probes.",
      hints: [
        "Stop when the occupant's distance is less than the number of probes made before it.",
      ],
      objective: "Use early termination",
    },
    {
      id: "rh-mean",
      kind: "mcq",
      prompt:
        "Compared with plain linear probing on the same keys, what does Robin Hood hashing change?",
      options: [
        "The spread of distances (variance), not their total",
        "The average distance, which drops to 1",
        "The number of slots used",
        "Nothing measurable",
      ],
      answer: 0,
      explanation:
        "With linear probing the total displacement of a set of keys is the same whichever key wins each collision; Robin Hood redistributes it so that no key is far from home.",
      distractors: {
        1: "The mean is unchanged; in the example both totals are 9.",
        2: "Each key still occupies exactly one slot.",
        3: "The maximum distance drops (from 4 to 3 in the example), and unsuccessful searches stop earlier.",
      },
      hints: ["Compare the totals and the maxima in the worked example."],
      objective: "Understand the effect",
    },
  ],
  exam: {
    definition:
      "Robin Hood hashing is linear probing in which, at each collision, the key further from its home slot keeps the slot and the other continues probing; searches stop at the first slot whose key is closer to home than the probe count.",
    steps: [
      "Insert: walk from home with distance $d$; if the occupant's distance $< d$, swap and continue with the evicted key.",
      "Find: walk from home; stop at an empty slot or one with distance $<$ probe count.",
      "Delete: empty the slot and shift following keys with distance $> 0$ back by one.",
    ],
    timeComplexity:
      "Expected $O(1)$ at a fixed load factor below 1; the variance of probe lengths is much smaller than in linear probing.",
    spaceComplexity: "$\\Theta(m)$, plus a small distance field per slot.",
    correctness:
      "Invariants: no gap between a key and its home; distances rise by at most one per slot. Together they justify early termination of searches and backward-shift deletion.",
    applications: ["General-purpose hash maps that need fast lookups at high load factors"],
    limitations: [
      "Insertions move keys around, so pointers into the table are not stable",
      "Worst case still linear in the table size",
    ],
    faq: [
      {
        q: "Does it reduce the average number of probes for a successful search?",
        a: "No, the mean is the same as linear probing; it reduces the variance and the maximum.",
      },
      {
        q: "Why are tombstones unnecessary?",
        a: "Backward-shift deletion restores the invariants directly, so no slot needs to be marked.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Linear probing where the key further from home wins each slot.",
          "Lower variance of probe lengths; early-terminating searches.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and the swap rule (1).",
          "Insert and find with early termination (2).",
          "Small example showing a swap (1).",
          "Effect on the distribution of distances (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Motivation from linear probing's long probe sequences — 1.",
          "Insert, find, backward-shift delete — 3.",
          "Worked example compared with linear probing — 3.",
          "Invariants and proof of early termination — 2.",
          "Mean vs variance — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "P. Celis, P.-Å. Larson, J. I. Munro, “Robin Hood hashing”, Proc. 26th Annual Symposium on Foundations of Computer Science (FOCS), 1985.",
      supports: "The method and its reduced variance of probe lengths.",
    },
    {
      citation:
        "L. Devroye, P. Morin, A. Viola, “On worst-case Robin Hood hashing”, SIAM Journal on Computing 33(4), 2004.",
      supports: "The analysis of the maximum displacement.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
