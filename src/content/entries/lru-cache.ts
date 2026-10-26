import type { AlgorithmEntry } from "../types";

export const lruCacheEntry: AlgorithmEntry = {
  slug: "lru-cache",
  name: "LRU Cache",
  aliases: ["Least recently used cache", "Cache replacement (LRU)", "LRU eviction"],
  curriculum: [149],
  domain: "linear-structures",
  subcategory: "Lists, buffers and caches",
  difficulty: "intermediate",
  summary:
    "A fixed-size cache that, when full, evicts the entry used longest ago. A hash map finds entries and a doubly linked list keeps them in order of use, so get, put and eviction are all O(1).",
  tags: ["cache", "hash map", "doubly linked list", "eviction", "design"],
  prerequisites: ["Hash tables", "Linked lists"],
  related: ["lfu-cache", "hash-chaining", "deque", "circular-queue"],
  problem: {
    input: "A capacity and a sequence of put k v and get k operations.",
    output:
      "What each get returns (or a miss), which key each put evicts, and the final order of use.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A cache keeps a few recent answers close at hand. When it is full and something new arrives, something must go. LRU bets that the past predicts the future: the entry nobody has touched for the longest time is the one least likely to be needed soon. Keep the entries in a line ordered by last use — every get or put moves an entry to the recent end — and evict from the other end.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**get k:** look k up in the hash map. If it is there, unlink its node and relink it at the most-recent end, and return its value; otherwise report a miss.",
          "**put k v, k present:** update the value and move the node to the most-recent end.",
          "**put k v, k new:** if the cache is full, remove the node at the least-recent end and its key from the map. Then add a node at the most-recent end and map k to it.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset), capacity 2. The list is written least recent first.",
      },
      {
        kind: "table",
        head: ["operation", "result", "list afterwards"],
        rows: [
          ["put 1 10", "stored", "1:10"],
          ["put 2 20", "stored", "1:10 2:20"],
          ["get 1", "10", "2:20 1:10"],
          ["put 3 30", "full: evict 2", "1:10 3:30"],
          ["get 2", "miss", "1:10 3:30"],
          ["put 4 40", "full: evict 1", "3:30 4:40"],
          ["get 1", "miss", "3:30 4:40"],
          ["get 3", "30", "4:40 3:30"],
          ["get 4", "40", "3:30 4:40"],
        ],
      },
      {
        kind: "p",
        text: "The get 1 in the third step saves key 1 from the first eviction: without it, 1 would have gone instead of 2. The third preset shows LRU's weak spot: cycling through 4 keys with room for 3 evicts each key just before it is needed again, so a repeated scan misses every time.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use sentinel head and tail nodes so that unlinking and relinking never need special cases; each node stores its key so eviction can remove it from the map.",
          "In Python, `collections.OrderedDict` with `move_to_end` and `popitem(last=False)` is exactly this structure; Java's `LinkedHashMap` with access order and `removeEldestEntry` is too.",
          "Hardware and operating-system caches rarely track exact recency; they approximate it with a few bits per entry (for example the CLOCK algorithm).",
          "Variants such as LRU-K and 2Q also consider earlier uses, to resist scans that would flush a plain LRU cache.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** The hash map finds a key's node in O(1) expected time; unlinking and relinking a node in a doubly linked list, and removing the tail, are O(1). Every operation is therefore O(1) expected, with O(capacity) space.",
      },
      {
        kind: "p",
        text: "**Competitiveness.** Sleator and Tarjan (1985) showed that LRU with a cache of size k misses at most k times as often as the optimal offline policy (which evicts the entry used furthest in the future) with the same cache, and that no deterministic online policy does better in the worst case. The tests compare every run with a model built on an insertion-ordered map, and check the drawn list against the result.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Bélády's optimal policy (MIN) evicts the entry whose next use is furthest away; it needs the future and serves as the benchmark.",
          "ARC (adaptive replacement cache) balances recency and frequency by keeping two LRU lists and adapting their sizes.",
          "LFU caches evict by frequency instead; see the LFU lesson for the case where the two policies disagree.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    space: "O(capacity)",
    worstClass: "1",
    note: "Expected time, through the hash map; the list operations are O(1) in the worst case.",
  },
  properties: [
    { label: "Evicts", value: "The entry used longest ago" },
    { label: "Structures", value: "Hash map + doubly linked list" },
    { label: "Competitive ratio", value: "k against the optimal offline policy" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run",
      code: `from collections import OrderedDict

def run(capacity, ops):
    """ops: ["put", k, v] or ["get", k]. Returns each get's value (None for a miss)."""
    cache, out = OrderedDict(), []
    for op in ops:
        if op[0] == "get":
            k = op[1]
            if k in cache:
                cache.move_to_end(k)            # now the most recently used
                out.append(cache[k])
            else:
                out.append(None)
        else:
            _, k, v = op
            if k in cache:
                cache.move_to_end(k)
            elif len(cache) == capacity:
                cache.popitem(last=False)       # evict the least recently used
            cache[k] = v
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
              ["put", 4, 40],
              ["get", 1],
              ["get", 3],
              ["get", 4],
            ],
          ],
          expected: [10, null, null, 30, 40],
        },
      ],
    },
    {
      language: "javascript",
      entry: "missesOnLoop",
      code: `// Misses when cycling through keys 0 … m − 1 'rounds' times with an LRU cache of the given capacity.
function missesOnLoop(capacity, m, rounds) {
  const cache = new Map();
  let misses = 0;
  for (let r = 0; r < rounds; r++)
    for (let k = 0; k < m; k++) {
      if (cache.has(k)) cache.delete(k);
      else {
        misses++;
        if (cache.size === capacity) cache.delete(cache.keys().next().value);
      }
      cache.set(k, true);
    }
  return misses;
}
`,
      tests: [
        { args: [3, 4, 5], expected: 20 },
        { args: [4, 4, 5], expected: 4 },
      ],
    },
  ],
  visualizer: "lru-cache",
  practice: [
    {
      id: "lru-evict",
      kind: "mcq",
      prompt:
        "An LRU cache of capacity 3 receives put a, put b, put c, get a, put d. Which key is evicted?",
      options: ["b", "a", "c", "d"],
      answer: 0,
      explanation:
        "After get a the order of use is b, c, a (least recent first), so b is evicted to make room for d.",
      distractors: {
        1: "a was used just before d arrived, so it is the most recently used.",
        2: "c was used more recently than b.",
        3: "The new key is never the one evicted.",
      },
      hints: ["Write the keys in order of last use after each step."],
      objective: "Eviction order",
    },
    {
      id: "lru-scan",
      kind: "numeric",
      prompt:
        "An LRU cache of capacity 3 is empty. Keys 1, 2, 3, 4, 1, 2, 3, 4 are requested (each a get, then a put on a miss). How many misses?",
      answer: 8,
      explanation:
        "Each key is evicted just before it is requested again, so every request misses — the scan problem.",
      hints: ["Which key is least recently used when 1 is requested the second time?"],
      objective: "Weakness under scans",
    },
  ],
  exam: {
    definition:
      "An LRU cache is a bounded key–value store that evicts the least recently used entry when full, implemented with a hash map and a doubly linked list ordered by recency.",
    steps: [
      "get: map lookup; on a hit move the node to the front (most recent).",
      "put: update and move if present; otherwise evict the tail if full, then insert at the front.",
    ],
    timeComplexity: "$O(1)$ expected per operation.",
    spaceComplexity: "$O(\\text{capacity})$.",
    correctness:
      "The list order is exactly the order of last use, because every use moves its node to the recent end; so its other end is always the least recently used entry.",
    applications: [
      "Web and database caches",
      "Operating-system page replacement (approximations)",
      "Memoization with bounded memory",
    ],
    limitations: [
      "Fails on repeated scans larger than the cache",
      "Ignores how often an entry is used",
    ],
    faq: [
      {
        q: "Why a doubly linked list rather than a singly linked one?",
        a: "Moving or removing a node found through the hash map needs its predecessor; a back pointer gives it in O(1).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Policy (1).", "Hash map + doubly linked list (2).", "get and put in O(1) (2)."],
      },
      {
        marks: 10,
        outline: [
          "Policy and data structure (3).",
          "Operations with a worked example (4).",
          "Complexity and weaknesses, comparison with LFU (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. D. Sleator, R. E. Tarjan, “Amortized efficiency of list update and paging rules,” Communications of the ACM, 28(2), 1985.",
      supports: "The competitive analysis of LRU paging.",
    },
    {
      citation:
        "L. A. Belady, “A study of replacement algorithms for a virtual-storage computer,” IBM Systems Journal, 5(2), 1966.",
      supports: "The optimal offline replacement policy.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
