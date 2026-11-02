import type { AlgorithmEntry } from "../types";

export const lfuCacheEntry: AlgorithmEntry = {
  slug: "lfu-cache",
  name: "LFU Cache",
  aliases: ["Least frequently used cache", "LFU eviction"],
  curriculum: [150],
  domain: "linear-structures",
  subcategory: "Lists, buffers and caches",
  difficulty: "advanced",
  summary:
    "A fixed-size cache that, when full, evicts the entry used the fewest times, breaking ties by least recent use. Grouping entries into buckets by use count — each bucket a recency list — makes every operation O(1).",
  tags: ["cache", "hash map", "doubly linked list", "eviction", "frequency", "design"],
  prerequisites: ["LRU cache", "Hash tables", "Linked lists"],
  related: ["lru-cache", "hash-chaining"],
  problem: {
    input: "A capacity and a sequence of put k v and get k operations.",
    output:
      "What each get returns (or a miss), which key each put evicts, and the final buckets of entries by use count.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "LRU forgets quickly: a key used a hundred times is evicted as soon as a few others have been used after it. LFU counts uses instead and evicts the entry with the smallest count — the one that has proved least popular. When several entries share the smallest count, the least recently used of them goes. To find that entry instantly, keep one bucket per use count, buckets in increasing order, and inside each bucket the entries in order of last use.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "A hash map finds each key's entry; the entry knows its bucket.",
          "**get k (hit), or put k v for a present k:** the entry has been used f times; move it to the end of the bucket for f + 1 uses (creating that bucket right after bucket f if needed), and remove bucket f if it is now empty. A put also updates the value.",
          "**get k (miss):** report a miss; nothing changes.",
          "**put k v, k new:** if the cache is full, evict the first entry of the lowest bucket (fewest uses; least recent among them), removing that bucket if it empties. Then add k at the end of the bucket for 1 use.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset), capacity 2. Buckets are written count × : entries, least recent first.",
      },
      {
        kind: "table",
        head: ["operation", "result", "buckets afterwards"],
        rows: [
          ["put 1 10, put 2 20", "stored, stored", "1×: 1:10 2:20"],
          ["get 1", "10", "1×: 2:20; 2×: 1:10"],
          ["put 3 30", "full: evict 2 (used once)", "1×: 3:30; 2×: 1:10"],
          ["get 2", "miss", "unchanged"],
          ["get 3", "30", "2×: 1:10 3:30"],
          ["put 4 40", "full: tie at 2×, evict 1 (less recent)", "1×: 4:40; 2×: 3:30"],
          ["get 1, get 3, get 4", "miss, 30, 40", "2×: 4:40; 3×: 3:30"],
        ],
      },
      {
        kind: "p",
        text: "The third preset shows where LFU and LRU disagree: with capacity 2, key 1 is used four times and key 2 twice, then 3 arrives. LFU evicts 2 (fewer uses) even though 1 was used longer ago, which is the key LRU would evict.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Keep a `minFreq` variable instead of a sorted list of buckets: it becomes 1 after every insertion, and it only increases by one when its bucket empties during a use. With a map from counts to recency lists this gives O(1) per operation; this lesson draws the buckets as an ordered list instead.",
          "Each bucket can be a doubly linked list, or an insertion-ordered map such as Python's `OrderedDict`.",
          "Pure LFU never forgets: an entry popular long ago can stay forever. Practical variants age the counts (halve them periodically) or count only within a window, as in TinyLFU.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** A use moves one entry between adjacent buckets and may create or remove one bucket; an eviction takes the first entry of the first bucket. All of these are pointer changes, so each operation is O(1) plus the expected O(1) hash-map lookup (Shah, Mitra and Matani, 2010). Space is O(capacity): at most one bucket per entry.",
      },
      {
        kind: "p",
        text: "**Correctness.** Buckets are kept in increasing order of count, and a use always moves an entry to the end of its new bucket, so within a bucket entries are in order of last use. The first entry of the first bucket is therefore the least recently used among those with the fewest uses. The tests compare every run with a simple model that stores counts and last-use times and scans for the victim.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Under the independent reference model (requests drawn independently from a fixed distribution), the best policy keeps the items with the highest request probabilities; LFU estimates those probabilities from its counts, which is the theoretical case for it.",
          "W-TinyLFU, used in the Caffeine Java cache, admits new entries by comparing approximate frequencies kept in a count-min sketch.",
          "Real workloads mix recency and frequency, which is why adaptive policies such as ARC exist.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    space: "O(capacity)",
    worstClass: "1",
    note: "Expected time, through the hash map; bucket and list operations are O(1).",
  },
  properties: [
    { label: "Evicts", value: "Fewest uses; least recent among ties" },
    { label: "Structures", value: "Hash map + buckets of recency lists" },
    { label: "New entries", value: "Start with a count of 1" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run",
      code: `from collections import OrderedDict, defaultdict

def run(capacity, ops):
    """ops: ["put", k, v] or ["get", k]. Returns each get's value (None for a miss)."""
    value, count = {}, {}
    buckets = defaultdict(OrderedDict)     # count -> keys, least recent first
    min_count, out = 0, []

    def use(k):
        nonlocal min_count
        c = count[k]
        del buckets[c][k]
        if not buckets[c]:
            del buckets[c]
            if min_count == c:
                min_count = c + 1
        count[k] = c + 1
        buckets[c + 1][k] = True

    for op in ops:
        if op[0] == "get":
            k = op[1]
            if k in value:
                use(k)
                out.append(value[k])
            else:
                out.append(None)
            continue
        _, k, v = op
        if k in value:
            value[k] = v
            use(k)
            continue
        if len(value) == capacity:
            victim, _ = buckets[min_count].popitem(last=False)
            if not buckets[min_count]:
                del buckets[min_count]
            del value[victim], count[victim]
        value[k], count[k] = v, 1
        buckets[1][k] = True
        min_count = 1
    return out
`,
      tests: [
        {
          args: [
            2,
            [
              ["put", 1, 10],
              ["put", 2, 20],
              ["get", 1],
              ["put", 3, 30],
              ["get", 2],
              ["get", 3],
              ["put", 4, 40],
              ["get", 1],
              ["get", 3],
              ["get", 4],
            ],
          ],
          expected: [10, null, 30, null, 30, 40],
        },
      ],
    },
    {
      language: "javascript",
      entry: "victim",
      code: `// The key an LFU cache evicts: fewest uses, then least recent last use.
// entries: [key, uses, lastUseTime].
function victim(entries) {
  let best = entries[0];
  for (const e of entries)
    if (e[1] < best[1] || (e[1] === best[1] && e[2] < best[2])) best = e;
  return best[0];
}
`,
      tests: [
        {
          args: [
            [
              [1, 2, 5],
              [3, 2, 6],
            ],
          ],
          expected: 1,
        },
        {
          args: [
            [
              [1, 4, 3],
              [2, 2, 5],
            ],
          ],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: "lfu-cache",
  practice: [
    {
      id: "lfu-evict",
      kind: "mcq",
      prompt:
        "An LFU cache of capacity 2 holds a (used 3 times, last used at time 1) and b (used once, at time 5). Which key does putting c evict?",
      options: ["b", "a", "c", "Neither: the cache grows"],
      answer: 0,
      explanation: "b has fewer uses; recency only breaks ties between equal counts.",
      distractors: {
        1: "a was used longer ago, which is what LRU would evict, but it has more uses.",
        2: "The new key is never the one evicted.",
        3: "The capacity is fixed.",
      },
      hints: ["Compare use counts first."],
      objective: "Eviction rule",
    },
    {
      id: "lfu-buckets",
      kind: "numeric",
      prompt:
        "An empty LFU cache of capacity 3 receives put x, put y, get x, get x, get y. How many non-empty buckets are there afterwards?",
      answer: 2,
      explanation: "x has been used 3 times and y twice: buckets 2× (y) and 3× (x).",
      hints: ["A put counts as the first use."],
      objective: "Buckets",
    },
  ],
  exam: {
    definition:
      "An LFU cache is a bounded key–value store that, when full, evicts the entry with the fewest uses, breaking ties by least recent use.",
    steps: [
      "Hash map from keys to entries; buckets by use count, each a recency list.",
      "Use: move the entry from bucket f to the end of bucket f + 1; drop an empty bucket.",
      "Insert when full: evict the first entry of the lowest bucket; add the new key with count 1.",
    ],
    timeComplexity: "$O(1)$ expected per operation.",
    spaceComplexity: "$O(\\text{capacity})$.",
    correctness:
      "Buckets are ordered by count and each is ordered by last use, so the first entry of the first bucket is the correct victim.",
    applications: [
      "Caches with stable popularity (content delivery)",
      "Admission policies (TinyLFU)",
      "Database buffer pools (frequency-aware variants)",
    ],
    limitations: [
      "Old popular entries linger without ageing",
      "New entries are vulnerable: they always start with a count of 1",
    ],
    faq: [
      {
        q: "How does it break ties?",
        a: "Among entries with the smallest count, the least recently used is evicted; the recency list inside each bucket gives it in O(1).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Policy and tie-break (2).", "Bucket structure (2).", "O(1) operations (1)."],
      },
      {
        marks: 10,
        outline: [
          "Policy compared with LRU (2).",
          "O(1) structure: map, buckets, minimum count (4).",
          "Worked example with a tie (4).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "K. Shah, A. Mitra, D. Matani, “An O(1) algorithm for implementing the LFU cache eviction scheme,” technical report, 2010.",
      supports: "Constant-time LFU with frequency buckets.",
    },
    {
      citation:
        "G. Einziger, R. Friedman, B. Manes, “TinyLFU: a highly efficient cache admission policy,” ACM Transactions on Storage, 13(4), 2017.",
      supports: "Approximate frequency counting for cache admission.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
