import type { AlgorithmEntry } from "../types";

const DOCS = ["the cat sat on the mat", "the dog sat", "a cat and a dog"];

export const mapReduceEntry: AlgorithmEntry = {
  slug: "mapreduce",
  name: "MapReduce",
  aliases: ["Map-Reduce", "Map and reduce", "Hadoop MapReduce"],
  curriculum: [461],
  domain: "parallel",
  subcategory: "Parallel data processing",
  difficulty: "intermediate",
  summary:
    "Processes large data sets on many machines with two user functions: map turns each input record into key–value pairs, the framework groups the pairs by key (the shuffle), and reduce combines each group. Failed tasks are simply run again.",
  tags: [
    "mapreduce",
    "parallel",
    "distributed",
    "shuffle",
    "combiner",
    "word count",
    "fault tolerance",
  ],
  prerequisites: ["Hash tables", "Merge Sort"],
  related: ["merge-sort", "paxos", "raft"],
  problem: {
    input:
      "A set of documents (input splits), a number of mappers and reducers, an optional combiner, and optionally a mapper that crashes.",
    output:
      "The number of times each word occurs, computed by workers that only see their own part of the data.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Counting words in a few pages is easy; counting them across billions of pages needs thousands of machines, and then the hard parts are splitting the work, moving the data and surviving crashes. MapReduce makes the programmer write only two small functions and handles the rest.",
      },
      {
        kind: "p",
        text: "**Map** looks at one document and says “I saw *cat* once, *sat* once…”. **Reduce** receives every “I saw *cat*” from every mapper and adds them up. In between, the framework routes each word to the reducer responsible for it, so no machine ever needs the whole data set.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "The master gives each input split to an idle mapper.",
          "Each mapper emits (word, 1) for every word, sorted into R partitions by hash(word) mod R; here the hash is the sum of the letter codes. With a combiner, it first sums its own pairs per word.",
          "If a mapper does not report within a timeout, the master assumes it failed and gives its split to another mapper.",
          "When every split is mapped, each reducer fetches its partition from every mapper (the shuffle).",
          "Each reducer groups its pairs by word and sums them; the master collects the results.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): three documents, two mappers, two reducers. The partition sends cat, dog, mat and sat to R1 and a, and, on and the to R2.",
      },
      {
        kind: "table",
        head: ["Split", "Words", "Pairs to R1", "Pairs to R2", "With a combiner"],
        rows: [
          [
            "1",
            "the cat sat on the mat",
            "3 (cat, sat, mat)",
            "3 (the, on, the)",
            "3 + 2 (the counted twice)",
          ],
          ["2", "the dog sat", "2 (dog, sat)", "1 (the)", "2 + 1"],
          ["3", "a cat and a dog", "2 (cat, dog)", "3 (a, and, a)", "2 + 2 (a counted twice)"],
        ],
      },
      {
        kind: "p",
        text: "Without a combiner 14 pairs cross the network; with one, 12. Either way the result is a 2, and 1, cat 2, dog 2, mat 1, on 1, sat 2, the 3. In the third preset mapper 2 crashes while working; after the timeout the master re-runs its split on another mapper and the counts are unchanged.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Map and reduce must be deterministic functions of their input: then re-running a failed task is safe, and so is running a slow task twice (backup tasks for stragglers) and keeping whichever finishes first.",
          "A combiner is a reduce run locally on one mapper's output. It is only correct when the reduce operation is associative and commutative, like a sum or a maximum, and not, say, an average of averages.",
          "Choose the partition function to spread keys evenly; one very frequent key (a hot key) makes one reducer the bottleneck.",
          "Intermediate data is written to the mappers' local disks; if a mapper's machine dies after its task finished, the task must be re-run because its output is lost.",
          "The Python sample is the whole pipeline in one process; the JavaScript sample builds an inverted index, the other classic MapReduce job.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness.** The partition function sends every pair with the same key to the same reducer, so each reducer sees all the counts for its words and no others. Summation is associative and commutative, so the order in which pairs arrive, and whether a combiner pre-summed some of them, cannot change the totals. The tests compare every run with a direct count, and check that the combiner never sends more pairs.",
      },
      {
        kind: "p",
        text: "**Cost.** The work is linear in the input: each word is mapped once and each pair reduced once. Without a combiner the shuffle moves one pair per word occurrence; with one, at most one pair per distinct word per split. With M mappers and R reducers working in parallel, the elapsed time is roughly the slowest map task plus the shuffle plus the slowest reduce task.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Many algorithms become chains of MapReduce jobs: PageRank iterations, joins, matrix multiplication, building search indexes.",
          "Writing intermediate results to disk between jobs is slow for iterative algorithms; Apache Spark keeps them in memory instead.",
          "The model fits batch processing; streaming systems process records continuously with similar map and reduce operators.",
          "The master is a single point of failure in the original design; production systems replicate it, typically with a consensus protocol such as Paxos or Raft.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Total work for n words; with M mappers and R reducers the elapsed time is roughly n/M for mapping plus the shuffle plus the largest reducer's share.",
  },
  properties: [
    { label: "User code", value: "Two functions: map and reduce" },
    { label: "Fault tolerance", value: "Re-execution of deterministic tasks" },
    { label: "Combiner", value: "Correct only for associative, commutative reductions" },
  ],
  implementations: [
    {
      language: "python",
      entry: "word_count",
      code: `from collections import defaultdict


def word_count(documents, reducers=2):
    # Map: emit (word, 1); shuffle: route each pair to reducer hash(word) mod R;
    # reduce: sum per word. Returns [[word, count], ...] in alphabetical order.
    def map_fn(doc):
        return [(w, 1) for w in doc.lower().split()]

    def partition(word):
        return sum(map(ord, word)) % reducers

    shuffled = [defaultdict(list) for _ in range(reducers)]
    for doc in documents:                      # each document is one map task
        for word, one in map_fn(doc):
            shuffled[partition(word)][word].append(one)
    result = []
    for part in shuffled:                      # each partition is one reduce task
        for word, ones in part.items():
            result.append([word, sum(ones)])
    return sorted(result)
`,
      tests: [
        {
          args: [DOCS],
          expected: [
            ["a", 2],
            ["and", 1],
            ["cat", 2],
            ["dog", 2],
            ["mat", 1],
            ["on", 1],
            ["sat", 2],
            ["the", 3],
          ],
        },
        {
          args: [["to be or not to be"], 3],
          expected: [
            ["be", 2],
            ["not", 1],
            ["or", 1],
            ["to", 2],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "invertedIndex",
      code: `// MapReduce for an inverted index: map emits (word, document id); the shuffle
// groups by word; reduce keeps the distinct ids in order.
function invertedIndex(documents) {
  const pairs = documents.flatMap((doc, id) =>
    doc.toLowerCase().split(/\\s+/).filter(Boolean).map((w) => [w, id]),
  );
  const groups = new Map();
  for (const [w, id] of pairs) groups.set(w, [...(groups.get(w) ?? []), id]);
  return [...groups]
    .map(([w, ids]) => [w, [...new Set(ids)].sort((a, b) => a - b)])
    .sort((a, b) => (a[0] < b[0] ? -1 : 1));
}
`,
      tests: [
        {
          args: [["the cat sat", "the dog", "a cat"]],
          expected: [
            ["a", [2]],
            ["cat", [0, 2]],
            ["dog", [1]],
            ["sat", [0]],
            ["the", [0, 1]],
          ],
        },
      ],
    },
  ],
  visualizer: "mapreduce",
  practice: [
    {
      id: "mr-pairs",
      kind: "numeric",
      prompt:
        "Without a combiner, how many pairs does word count shuffle for the three documents in the first preset (14 words in total)?",
      answer: 14,
      explanation: "One (word, 1) pair per word occurrence.",
      hints: ["Count the words."],
      objective: "Count shuffle traffic",
    },
    {
      id: "mr-combiner",
      kind: "numeric",
      prompt: "With a combiner, how many pairs does the same job shuffle?",
      answer: 12,
      explanation:
        "One pair per distinct word per split: 5 + 3 + 4 = 12 (“the” and “a” each repeat once within a document).",
      hints: ["Count distinct words in each document."],
      objective: "See what a combiner saves",
    },
    {
      id: "mr-reexec",
      kind: "mcq",
      prompt: "Why can the master simply re-run a failed map task?",
      options: [
        "Map is a deterministic function of its input split, so a second run produces the same pairs",
        "Mappers save their progress after every word",
        "The reducers can rebuild lost pairs",
        "Failed tasks are skipped and their words ignored",
      ],
      answer: 0,
      explanation:
        "Determinism makes re-execution (and duplicate backup tasks) safe: whichever copy finishes, the output is the same.",
      distractors: {
        1: "There is no checkpointing inside a task; it restarts from scratch.",
        2: "Reducers never see the input split.",
        3: "Skipping would give wrong counts.",
      },
      hints: ["What would go wrong if map used a random number?"],
      objective: "Understand fault tolerance",
    },
  ],
  exam: {
    definition:
      "MapReduce is a programming model and runtime for processing large data sets in parallel: user-defined map functions emit key–value pairs, the runtime groups them by key, and user-defined reduce functions combine each group.",
    steps: [
      "Split the input; assign splits to mappers.",
      "Map each record to key–value pairs, partitioned by key.",
      "Shuffle: each reducer fetches its partition from every mapper.",
      "Reduce each key's values; write the output.",
    ],
    timeComplexity:
      "$O(n)$ total work; elapsed time set by the slowest map task, the shuffle and the slowest reducer.",
    spaceComplexity: "$O(n)$ for intermediate pairs (less with a combiner).",
    correctness:
      "All pairs with one key reach one reducer; associative, commutative reductions give the same result whatever the grouping or order.",
    applications: [
      "Word counts and log analysis",
      "Inverted indexes",
      "Joins and aggregations",
      "Iterative graph algorithms such as PageRank (as chains of jobs)",
    ],
    limitations: [
      "Slow for iterative algorithms (disk between jobs)",
      "Hot keys overload one reducer",
      "Batch only",
    ],
    faq: [
      {
        q: "Combiner or no combiner?",
        a: "Use one whenever the reduction is associative and commutative: it cuts network traffic at no cost to correctness.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Map emits key–value pairs; reduce combines by key.",
          "The runtime shuffles and handles failures.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Phases (2).",
          "Partitioning and the shuffle (1).",
          "Combiner and fault tolerance (2).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Motivation and model (2).",
          "Word count walk-through (3).",
          "Partitioning, combiner and its conditions (2).",
          "Re-execution and stragglers (2).",
          "Limitations and successors (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Dean, S. Ghemawat, “MapReduce: Simplified data processing on large clusters,” Proc. 6th Symposium on Operating Systems Design and Implementation (OSDI), USENIX, 2004, pp. 137–150.",
      supports: "The model, the combiner, partitioning, re-execution and backup tasks.",
    },
    {
      citation:
        "J. Leskovec, A. Rajaraman, J. D. Ullman, Mining of Massive Datasets, 3rd ed., Cambridge University Press, 2020, Chapter 2.",
      supports: "Algorithms expressed as MapReduce jobs and their costs.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review. The visualizer is a simplified model: unit-time steps, only one kind of failure (a mapper crashing on its first task), and a master that never fails.",
  },
  version: 1,
  updated: "2026-10-25",
};
