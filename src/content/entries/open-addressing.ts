import type { AlgorithmEntry } from "../types";

export const openAddressingEntry: AlgorithmEntry = {
  slug: "open-addressing",
  name: "Open Addressing (Linear Probing and Double Hashing)",
  aliases: ["Linear probing", "Double hashing", "Closed hashing"],
  curriculum: [68, 69],
  domain: "arrays-hashing",
  subcategory: "Hash tables",
  difficulty: "intermediate",
  summary:
    "Keeps every key in the table array itself: a key that finds its slot taken tries a fixed sequence of other slots. Linear probing steps by 1; double hashing steps by a second hash of the key, which avoids long clusters.",
  tags: ["hashing", "hash table", "linear probing", "double hashing", "tombstones", "clustering"],
  prerequisites: ["Hash Table (Separate Chaining)"],
  related: ["hash-chaining", "robin-hood-hashing", "cuckoo-hashing"],
  problem: {
    input:
      "Insert, find and delete operations on integer keys; a table of prime size $m$; a probing method.",
    output: "Each operation's answer and the final contents of the slots.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Instead of hanging lists off the table, put every key into the table itself. If a key's slot is taken, it tries another slot, then another, following a sequence that depends only on the key. A search follows the same sequence, so it meets the key where it was placed, or reaches an empty slot, which proves the key is absent.",
      },
      {
        kind: "p",
        text: "**Linear probing** tries the next slot each time. It is simple and cache-friendly, but runs of occupied slots (clusters) grow and merge. **Double hashing** steps by an amount that also depends on the key, so keys that collide once usually go separate ways.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Probe $i$ of key $k$ is slot $(h_1(k) + i \\cdot h_2(k)) \\bmod m$, for $i = 0, 1, 2, \\dots$ Here $h_1(k) = k \\bmod m$; linear probing uses $h_2 = 1$; double hashing uses $h_2(k) = 1 + (k \\bmod (m - 1))$, never 0, and with $m$ prime the sequence visits every slot.",
          "**Find:** follow the sequence until the key is found or an empty slot is reached.",
          "**Insert:** search first; if absent, use the first free slot seen on the way. If every slot holds a key, the table is full.",
          "**Delete:** replace the key with a **tombstone**. Searches pass over tombstones (a key further along may have probed past this slot when it was occupied); inserts may reuse them.",
        ],
      },
      { kind: "heading", text: "Worked example: m = 11, keys 22, 33, 44, 12, 23, 5, 16" },
      {
        kind: "table",
        head: ["Slot", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        rows: [
          ["Linear", "22", "33", "44", "12", "23", "5", "16", "", "", "", ""],
          ["Double", "22", "12", "", "", "33", "44", "5", "", "16", "23", ""],
        ],
      },
      {
        kind: "p",
        text: "With linear probing, 22, 33 and 44 all hash to 0 and fill slots 0–2; 12 and 23 hash to 1 but must walk to the end of that run, and 5 and 16 extend it until slots 0–6 form one cluster of seven. Searching for the absent key 27 ($h_1 = 5$) probes slots 5, 6 and 7: three probes. With double hashing, 27 steps by $h_2(27) = 1 + 27 \\bmod 10 = 8$: slot 5, then slot 2, which is empty, two probes. Over the whole run linear probing makes 21 probes, double hashing 20.",
      },
      {
        kind: "p",
        text: "**Tombstones** (third preset, $m = 7$): 10, 17 and 24 all hash to 3 and take slots 3, 4 and 5. Deleting 17 leaves a tombstone in slot 4. A search for 24 must pass it to reach slot 5; had slot 4 been emptied, the search would stop there and wrongly report 24 missing. Inserting 31 then reuses slot 4.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Keep the load factor well below 1.** Libraries using linear probing typically resize at $\\alpha$ around 0.5–0.9; costs grow sharply as $\\alpha \\to 1$.",
          "**Tombstones accumulate.** They lengthen searches though the table holds fewer keys; count them and rebuild the table when they become numerous. (Robin Hood hashing with backward-shift deletion avoids tombstones for linear probing.)",
          "**Double hashing needs $h_2(k) \\ne 0$ and coprime to $m$.** A prime $m$ with $h_2 \\in [1, m-1]$ guarantees both, so the sequence is a permutation of all slots; the test suite checks this for every key up to 999.",
          "**Insert must finish the search** before reusing a tombstone, or a key already present further along would be inserted a second time.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Expected probes" },
      {
        kind: "p",
        text: "Under the idealised *uniform hashing* assumption (each key's probe sequence is a uniformly random permutation of the slots), with load factor $\\alpha < 1$:",
      },
      {
        kind: "math",
        tex: "E[\\text{unsuccessful}] \\le \\frac{1}{1 - \\alpha}, \\qquad E[\\text{successful}] \\le \\frac{1}{\\alpha} \\ln \\frac{1}{1 - \\alpha}.",
      },
      {
        kind: "p",
        text: "Double hashing behaves close to this ideal in practice. Linear probing is worse because of **primary clustering**: a cluster of length $L$ is hit by any key hashing into it, so it grows faster the longer it is. Knuth's analysis gives about $\\frac{1}{2}\\left(1 + \\frac{1}{(1-\\alpha)^2}\\right)$ probes for an unsuccessful search and $\\frac{1}{2}\\left(1 + \\frac{1}{1-\\alpha}\\right)$ for a successful one. At $\\alpha = 0.9$ that is 50.5 against the ideal 10 for unsuccessful searches.",
      },
      { kind: "heading", text: "Why searches stop at an empty slot" },
      {
        kind: "p",
        text: "**Invariant:** for every key $k$ in slot $s = $ probe$(k, j)$, the slots probe$(k, 0..j-1)$ are all non-empty (holding keys or tombstones). Insertion establishes it ($k$ goes to the first free slot of its sequence, and only after the earlier ones were seen occupied), and deletion preserves it by leaving a tombstone rather than an empty slot. So meeting an empty slot proves the key is absent. The checker in this visualizer verifies the invariant on the final table.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Quadratic probing** ($h(k) + c_1 i + c_2 i^2$) avoids primary clustering but keeps *secondary* clustering: keys with the same home slot follow the same sequence.",
          "**Linear probing is fast in practice** despite clustering, because consecutive slots share cache lines; with a hash function from a 5-independent family it has expected $O(1)$ cost for $\\alpha < 1$ (Pagh, Pagh and Ružić).",
          "**Robin Hood** and **cuckoo** hashing are refinements of open addressing that bound the variance or the worst case of lookups.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1/(1 - \\alpha))", worst: "O(m)" },
    space: "\\Theta(m)",
    worstClass: "n",
    note: "Average under uniform hashing with load factor $\\alpha < 1$; linear probing's constants are worse (primary clustering).",
  },
  properties: [
    { label: "Load factor", value: "At most 1" },
    { label: "Deletion", value: "Tombstones (or backward shift for linear probing)" },
    { label: "Memory", value: "No pointers: one array of slots" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run_ops",
      code: `DEL = "DEL"

def run_ops(m, double, ops):
    """Open addressing with linear probing or double hashing (m prime)."""
    slots = [None] * m
    step = lambda k: 1 + k % (m - 1) if double else 1

    def search(k):
        free = None
        for i in range(m):
            s = (k % m + i * step(k)) % m
            if slots[s] is None:
                return None, (s if free is None else free)
            if slots[s] == DEL:
                free = s if free is None else free
            elif slots[s] == k:
                return s, None
        return None, free

    results = []
    for op, k in ops:
        at, free = search(k)
        if op == "?":
            results.append("found" if at is not None else "missing")
        elif op == "+":
            if at is not None:
                results.append("present")
            elif free is None:
                results.append("full")
            else:
                slots[free] = k
                results.append("inserted")
        elif at is None:
            results.append("missing")
        else:
            slots[at] = DEL
            results.append("deleted")
    return [results, slots]
`,
      tests: [
        {
          args: [
            7,
            false,
            [
              ["+", 10],
              ["+", 17],
              ["+", 24],
              ["-", 17],
              ["?", 24],
              ["+", 31],
            ],
          ],
          expected: [
            ["inserted", "inserted", "inserted", "deleted", "found", "inserted"],
            [null, null, null, 10, 31, 24, null],
          ],
        },
        {
          args: [
            5,
            true,
            [
              ["+", 1],
              ["+", 2],
              ["+", 3],
              ["+", 4],
              ["+", 5],
              ["+", 6],
            ],
          ],
          expected: [
            ["inserted", "inserted", "inserted", "inserted", "inserted", "full"],
            [5, 1, 2, 3, 4],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "runOps",
      code: `function runOps(m, double, ops) {
  const DEL = "DEL";
  const slots = new Array(m).fill(null);
  const step = (k) => (double ? 1 + (k % (m - 1)) : 1);
  const search = (k) => {
    let free = null;
    for (let i = 0; i < m; i++) {
      const s = (k % m + i * step(k)) % m;
      if (slots[s] === null) return [null, free ?? s];
      if (slots[s] === DEL) free ??= s;
      else if (slots[s] === k) return [s, null];
    }
    return [null, free];
  };
  const results = [];
  for (const [op, k] of ops) {
    const [at, free] = search(k);
    if (op === "?") results.push(at !== null ? "found" : "missing");
    else if (op === "+") {
      if (at !== null) results.push("present");
      else if (free === null) results.push("full");
      else {
        slots[free] = k;
        results.push("inserted");
      }
    } else if (at === null) results.push("missing");
    else {
      slots[at] = DEL;
      results.push("deleted");
    }
  }
  return [results, slots];
}
`,
      tests: [
        {
          args: [
            11,
            true,
            [
              ["+", 22],
              ["+", 33],
              ["+", 44],
              ["+", 12],
              ["+", 23],
              ["?", 27],
            ],
          ],
          expected: [
            ["inserted", "inserted", "inserted", "inserted", "inserted", "missing"],
            [22, 12, null, null, 33, 44, null, null, null, 23, null],
          ],
        },
        {
          args: [
            11,
            false,
            [
              ["+", 22],
              ["+", 33],
              ["?", 33],
              ["-", 22],
              ["?", 33],
            ],
          ],
          expected: [
            ["inserted", "inserted", "found", "deleted", "found"],
            ["DEL", 33, null, null, null, null, null, null, null, null, null],
          ],
        },
      ],
    },
  ],
  visualizer: "open-addressing",
  practice: [
    {
      id: "oa-double-step",
      kind: "numeric",
      prompt:
        "With $m = 11$ and double hashing ($h_2(k) = 1 + k \\bmod 10$), what is the second slot probed for key 27?",
      answer: 2,
      explanation:
        "$h_1(27) = 5$ and $h_2(27) = 8$, so the second probe is $(5 + 8) \\bmod 11 = 2$.",
      hints: ["Probe $i$ is $(h_1 + i \\cdot h_2) \\bmod m$; the second probe has $i = 1$."],
      objective: "Compute a probe sequence",
    },
    {
      id: "oa-tombstone",
      kind: "mcq",
      prompt:
        "Why does deletion in open addressing leave a tombstone instead of emptying the slot?",
      options: [
        "An empty slot would end later searches early, hiding keys placed beyond it",
        "To save memory",
        "Because the key may be inserted again",
        "To keep the load factor below 1",
      ],
      answer: 0,
      explanation:
        "A key placed further along its probe sequence passed this slot while it was occupied. If the slot became empty, a search for that key would stop there and report it missing.",
      distractors: {
        1: "Tombstones take the same space as keys.",
        2: "Re-insertion works either way; correctness of searches is the issue.",
        3: "Tombstones actually make the table behave as if it were fuller.",
      },
      hints: ["What does a search conclude when it reaches an empty slot?"],
      objective: "Explain tombstones",
    },
    {
      id: "oa-cluster",
      kind: "mcq",
      prompt: "What is primary clustering?",
      options: [
        "Long runs of occupied slots under linear probing, which grow faster the longer they are",
        "Keys with the same home slot following the same probe sequence",
        "Several keys in one chain under separate chaining",
        "The table needing a resize",
      ],
      answer: 0,
      explanation:
        "Under linear probing any key hashing anywhere into a run extends it at its end, so long runs attract more keys.",
      distractors: {
        1: "That is secondary clustering (quadratic probing).",
        2: "Chaining has long chains, not clusters of slots.",
        3: "Resizing is a response to a high load factor, not a definition of clustering.",
      },
      hints: ["Think of what linear probing does when a key lands in the middle of a run."],
      objective: "Name the weakness of linear probing",
    },
  ],
  exam: {
    definition:
      "Open addressing stores all keys in the table array; a key $k$ probes slots $(h_1(k) + i\\,h_2(k)) \\bmod m$ for $i = 0, 1, \\dots$ ($h_2 = 1$ for linear probing, a second hash for double hashing) until it finds its slot.",
    steps: [
      "Find: probe until the key or an empty slot (skipping tombstones).",
      "Insert: if absent, put the key in the first tombstone or empty slot met; report full if there is none.",
      "Delete: replace the key with a tombstone.",
    ],
    timeComplexity:
      "Expected $\\le 1/(1-\\alpha)$ probes for an unsuccessful search under uniform hashing; worst case $O(m)$.",
    spaceComplexity: "$\\Theta(m)$ slots, no pointers.",
    correctness:
      "Invariant: every slot before a key on its probe sequence is non-empty. Insertion and tombstone deletion preserve it, so reaching an empty slot proves absence.",
    applications: [
      "High-performance dictionaries: many language runtimes and libraries use open addressing",
      "Caches and symbol tables with small keys",
    ],
    limitations: [
      "Load factor must stay below 1, and performance degrades sharply near 1",
      "Tombstones accumulate under deletions",
      "Linear probing suffers primary clustering",
    ],
    faq: [
      {
        q: "Why must $m$ be prime for double hashing here?",
        a: "So that every step $h_2(k) \\in [1, m-1]$ is coprime to $m$ and the probe sequence visits every slot.",
      },
      {
        q: "Linear probing or double hashing?",
        a: "Double hashing needs fewer probes at high load; linear probing has better cache behaviour and is often faster at moderate load.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "All keys in the array; collisions resolved by a probe sequence.",
          "Linear: step 1; double hashing: step $h_2(k)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Probe sequence formula for both methods (1).",
          "Insert, find, delete with tombstones (2).",
          "Example insertion into a small table (1).",
          "Clustering and expected cost (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Open addressing vs chaining — 1.",
          "Linear probing and double hashing with formulas — 2.",
          "Full worked example: same keys under both methods, a search, a deletion — 3.",
          "Invariant and why tombstones are needed — 2.",
          "Expected probe counts and clustering — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §11.4.",
      supports:
        "Open addressing, linear and quadratic probing, double hashing, and the uniform-hashing bounds on expected probes.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §6.4.",
      supports: "The analysis of linear probing and of double hashing.",
    },
    {
      citation:
        "A. Pagh, R. Pagh, M. Ružić, “Linear probing with constant independence”, SIAM Journal on Computing 39(3), 2009.",
      supports: "Expected constant cost of linear probing with 5-independent hash functions.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
