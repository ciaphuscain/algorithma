import type { AlgorithmEntry } from "../types";

export const circularQueueEntry: AlgorithmEntry = {
  slug: "circular-queue",
  name: "Circular Queue (Ring Buffer)",
  aliases: ["Circular buffer", "Ring buffer", "Bounded queue", "Cyclic buffer"],
  curriculum: [123, 147],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "beginner",
  summary:
    "A queue in a fixed-size array whose end wraps around to the start. A head index and a count locate the items, so enqueue and dequeue are O(1) and nothing ever shifts. When full, a bounded queue refuses new items and a ring buffer overwrites the oldest.",
  tags: ["queue", "array", "modular arithmetic", "buffer", "fifo"],
  prerequisites: ["Queues", "Arrays"],
  related: ["deque", "queue-using-stacks", "sliding-window"],
  problem: {
    input:
      "A capacity, a policy for when the buffer is full, and a sequence of enqueue x / dequeue / front operations.",
    output:
      "What each operation returns, using one array of the given capacity and O(1) work per operation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A queue in a plain array either shifts every item when the front leaves ($O(n)$) or walks off the end of the array. Instead, bend the array into a ring: after the last slot comes slot 0 again. The front moves forward as items leave and the back moves forward as items arrive, both wrapping around, and the items always occupy one contiguous arc of the ring.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Keep head (the front slot) and count. The back slot is $(\\text{head} + \\text{count} - 1) \\bmod \\text{capacity}$; the next free slot, tail, is $(\\text{head} + \\text{count}) \\bmod \\text{capacity}$.",
          "enqueue(x): if count < capacity, write x at tail and add 1 to count. If full: a bounded queue reports “full”; a ring buffer overwrites the oldest item, A[head], and moves head forward.",
          "dequeue(): if count = 0 report “empty”; otherwise take A[head], move head forward, and subtract 1 from count.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): capacity 4, rejecting when full.",
      },
      {
        kind: "table",
        head: ["operation", "result", "slots 0 1 2 3", "head", "count"],
        rows: [
          ["enqueue 1, 2, 3", "—", "1 2 3 ·", "0", "3"],
          ["dequeue", "1", "· 2 3 ·", "1", "2"],
          ["dequeue", "2", "· · 3 ·", "2", "1"],
          ["enqueue 4", "—", "· · 3 4", "2", "2"],
          ["enqueue 5", "— (wraps to slot 0)", "5 · 3 4", "2", "3"],
          ["enqueue 6", "—", "5 6 3 4", "2", "4"],
          ["enqueue 7", "full", "5 6 3 4", "2", "4"],
          ["dequeue", "3", "5 6 · 4", "3", "3"],
          ["front", "4", "5 6 · 4", "3", "3"],
        ],
      },
      {
        kind: "p",
        text: "The queue ends as 4, 5, 6 from front to back, stored in slots 3, 0 and 1. In the second preset (capacity 3, overwriting), enqueuing 10 to 50 keeps only the newest three: 40 and 50 overwrite 10 and 20, and the dequeues return 30, 40, 50 and then “empty”.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Full or empty?** With only head and tail, head = tail means both. Keep a count (as here), or leave one slot always unused, or keep a “full” flag.",
          "With a power-of-two capacity, `index & (capacity − 1)` replaces the modulo, and free-running counters that are never reduced make full/empty tests simple subtractions.",
          "A single-producer, single-consumer ring buffer needs no lock: the producer writes only tail and the consumer only head (with the right memory ordering). Audio, network and logging pipelines rely on this.",
          "Overwriting mode keeps the most recent $k$ items: flight recorders, kernel logs (`dmesg`), and “last N events” histories.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant.** The queue, front to back, is A[head], A[head + 1], …, A[head + count − 1], indices taken modulo the capacity; all other slots are free. Enqueue writes at the slot just after the back, and dequeue removes from head, so both keep the invariant with $O(1)$ index arithmetic and no data movement.",
      },
      {
        kind: "p",
        text: "**Overwriting** removes the front and appends at the back in one step: the slot freed at head is exactly the slot after the back when the buffer is full. The tests compare every result with a plain array model that shifts from the front.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The LMAX Disruptor uses a pre-allocated ring buffer with sequence numbers to pass messages between threads at high rates.",
          "Linux's `io_uring` and many network cards communicate with the operating system through shared ring buffers of requests and completions.",
          "A growable version doubles the array when full and copies the items out in order — that is the deque lesson.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    space: "O(capacity)",
    worstClass: "1",
    note: "Per operation; the array is allocated once.",
  },
  properties: [
    { label: "Data movement", value: "None: only head and count change" },
    { label: "When full", value: "Reject (bounded queue) or overwrite the oldest (ring buffer)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run",
      code: `class RingBuffer:
    def __init__(self, capacity, overwrite=False):
        self.a = [None] * capacity
        self.head = self.count = 0
        self.overwrite = overwrite

    def enqueue(self, x):
        cap = len(self.a)
        if self.count == cap:
            if not self.overwrite:
                return False
            self.a[self.head] = x            # replace the oldest
            self.head = (self.head + 1) % cap
            return True
        self.a[(self.head + self.count) % cap] = x
        self.count += 1
        return True

    def dequeue(self):
        if self.count == 0:
            return None
        x = self.a[self.head]
        self.head = (self.head + 1) % len(self.a)
        self.count -= 1
        return x

def run(capacity, overwrite, ops):
    rb, out = RingBuffer(capacity, overwrite), []
    for op in ops:
        if op.startswith("enqueue"):
            if not rb.enqueue(int(op.split()[1])):
                out.append("full")
        else:
            out.append(rb.dequeue())
    return out
`,
      tests: [
        {
          args: [
            4,
            false,
            [
              "enqueue 1",
              "enqueue 2",
              "enqueue 3",
              "dequeue",
              "dequeue",
              "enqueue 4",
              "enqueue 5",
              "enqueue 6",
              "enqueue 7",
              "dequeue",
            ],
          ],
          expected: [1, 2, "full", 3],
        },
        {
          args: [
            3,
            true,
            [
              "enqueue 10",
              "enqueue 20",
              "enqueue 30",
              "enqueue 40",
              "enqueue 50",
              "dequeue",
              "dequeue",
              "dequeue",
              "dequeue",
            ],
          ],
          expected: [30, 40, 50, null],
        },
      ],
    },
    {
      language: "javascript",
      entry: "lastN",
      code: `// Keep only the last n values seen, oldest first, with a ring buffer.
function lastN(values, n) {
  const a = new Array(n);
  let head = 0;
  let count = 0;
  for (const v of values) {
    if (count < n) a[(head + count++) % n] = v;
    else {
      a[head] = v; // overwrite the oldest
      head = (head + 1) % n;
    }
  }
  return Array.from({ length: count }, (_, i) => a[(head + i) % n]);
}
`,
      tests: [
        { args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7] },
        { args: [[1, 2], 3], expected: [1, 2] },
      ],
    },
  ],
  visualizer: "circular-queue",
  practice: [
    {
      id: "ring-slot",
      kind: "numeric",
      prompt:
        "A circular queue of capacity 5 has head = 3 and count = 4. In which slot does the next enqueued item go?",
      answer: 2,
      explanation: "$(3 + 4) \\bmod 5 = 2$: the items occupy slots 3, 4, 0 and 1.",
      hints: ["The next free slot is (head + count) mod capacity."],
      objective: "Index arithmetic",
    },
    {
      id: "ring-full-empty",
      kind: "mcq",
      prompt: "Why can head and tail alone not tell a full buffer from an empty one?",
      options: [
        "In both cases tail = head",
        "Head moves backwards when the buffer is full",
        "The array must be cleared when empty",
        "They can: tail = head − 1 means full",
      ],
      answer: 0,
      explanation:
        "Filling the buffer moves tail all the way round to head, exactly where it is when the buffer is empty. Keep a count, a flag, or one unused slot.",
      distractors: {
        1: "Head only moves forward.",
        2: "Emptiness is a matter of indices, not contents.",
        3: "That holds only if one slot is always left unused.",
      },
      hints: ["Fill a buffer of capacity 2 and compare with the empty one."],
      objective: "Full versus empty",
    },
  ],
  exam: {
    definition:
      "A circular queue stores a FIFO queue in a fixed array, treating index capacity − 1 as followed by index 0; head and count locate the items.",
    steps: [
      "enqueue: if not full, write at (head + count) mod capacity and increment count.",
      "dequeue: if not empty, take A[head], advance head, decrement count.",
      "When full: reject, or overwrite A[head] and advance head (ring buffer).",
    ],
    timeComplexity: "$O(1)$ per operation.",
    spaceComplexity: "$O(\\text{capacity})$.",
    correctness: "The items are always the count slots starting at head, modulo the capacity.",
    applications: [
      "Producer–consumer buffers (audio, networking, keyboards)",
      "Logs that keep the last N entries",
      "Sliding windows of fixed size",
    ],
    limitations: ["Fixed capacity unless it grows by copying"],
    faq: [
      {
        q: "Circular queue, circular buffer, ring buffer: are they the same?",
        a: "Yes, the same structure; “ring buffer” often implies overwriting the oldest item when full, “bounded queue” refusing the new one. The curriculum lists both names and this lesson covers both policies.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Array used as a ring; head and count.", "$O(1)$ operations."] },
      {
        marks: 5,
        outline: ["Index formulas (2).", "Trace with wrap-around (2).", "Full versus empty (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Section 10.1.",
      supports: "Queues implemented in an array with wrap-around.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 1: Fundamental Algorithms, 3rd ed., Addison-Wesley, 1997, Section 2.2.2.",
      supports: "Sequential allocation of queues with circular indexing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
