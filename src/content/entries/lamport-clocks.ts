import type { AlgorithmEntry } from "../types";

export const lamportClocksEntry: AlgorithmEntry = {
  slug: "lamport-clocks",
  name: "Lamport Clocks",
  aliases: ["Lamport logical clocks", "Lamport timestamps"],
  curriculum: [546],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "Assigns logical timestamps to events in a distributed system so that if event a causally precedes event b, then the timestamp of a is less than b's — capturing the 'happened-before' relation.",
  tags: ["logical clock", "distributed", "happened-before", "causality"],
  prerequisites: ["Distributed Systems"],
  related: ["vector-clocks", "chandy-lamport-snapshot-algorithm"],
  problem: {
    input: "A distributed system with multiple processes exchanging messages.",
    output: "A timestamp for each event such that causally ordered events have ordered timestamps.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In a distributed system, there's no global clock. Lamport clocks give each event a logical timestamp: each process keeps a counter, increments it on every event, and when sending a message, includes its counter. The receiver updates its counter to be at least as large.",
      },
      {
        kind: "p",
        text: "This ensures: if event a happened before event b (a → b), then timestamp(a) < timestamp(b). The converse is NOT true — concurrent events may have ordered timestamps.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Each process $P_i$ maintains a counter $C_i$, initially 0.",
          "Before any event at $P_i$: increment $C_i$.",
          "When $P_i$ sends a message: include $C_i$ with the message.",
          "When $P_j$ receives a message with timestamp $t$: set $C_j = \\max(C_j, t) + 1$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Process A sends message at time 1 to B (B's clock is 0). B sets clock = max(0, 1) + 1 = 2. B then sends to C (C's clock is 0). C sets clock = max(0, 2) + 1 = 3. Causal order is preserved: A's send (1) < B's receive (2) < C's receive (3).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Simple: just an integer counter per process.",
          "Total ordering: break ties by process ID: (timestamp, process_id).",
          "Cannot detect concurrency — for that, use vector clocks.",
          "Used in mutual exclusion, event ordering, and debugging.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "If $a \\to b$ (a happened before b), then $C(a) < C(b)$. This is the clock condition.",
      },
      {
        kind: "p",
        text: "The converse does not hold: $C(a) < C(b)$ does not imply $a \\to b$. Events may be concurrent even with different timestamps. Vector clocks capture the full happened-before relation.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Vector clocks extend Lamport clocks to detect concurrency: $a \\to b \\iff VC(a) < VC(b)$.",
          "Lamport's mutual exclusion algorithm uses Lamport clocks for totally-ordered resource access.",
          "Hybrid logical clocks combine physical and logical timestamps.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
    },
    space: "O(1)",
    worstClass: "1",
    note: "Per event: one counter increment and comparison.",
  },
  properties: [
    {
      label: "Causal ordering",
      value: "a → b implies C(a) < C(b)",
    },
    {
      label: "Not sufficient for concurrency",
      value: "Cannot detect concurrent events",
    },
    {
      label: "Space per process",
      value: "O(1) — single integer",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "lamport_clock",
      code: `class LamportClock:
    def __init__(self):
        self.time = 0
    def tick(self):
        self.time += 1
        return self.time
    def send(self):
        self.time += 1
        return self.time
    def receive(self, msg_time):
        self.time = max(self.time, msg_time) + 1
        return self.time

def lamport_clock(events):
    """Simulate Lamport clocks. events = list of (process, type, [target/source]).
    Processes are 0-indexed. Types: 'local', 'send to P', 'receive from P'.
    Returns list of timestamps for each event."""
    clocks = {}
    pending = {}  # process -> list of send timestamps
    timestamps = []
    for ev in events:
        proc = ev[0]
        if proc not in clocks:
            clocks[proc] = 0
        if ev[1] == "local":
            clocks[proc] += 1
            timestamps.append(clocks[proc])
        elif ev[1] == "send":
            target = ev[2]
            clocks[proc] += 1
            if target not in pending:
                pending[target] = []
            pending[target].append(clocks[proc])
            timestamps.append(clocks[proc])
        elif ev[1] == "receive":
            source = ev[2]
            msg_time = pending[proc].pop(0) if proc in pending and pending[proc] else 0
            clocks[proc] = max(clocks[proc], msg_time) + 1
            timestamps.append(clocks[proc])
    return timestamps
`,
      tests: [
        {
          args: [
            [
              [0, "send", 1],
              [0, "local"],
              [1, "receive", 0],
              [1, "send", 0],
            ],
          ],
          expected: [1, 2, 2, 3],
        },
        {
          args: [
            [
              [0, "local"],
              [1, "local"],
              [0, "local"],
            ],
          ],
          expected: [1, 1, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lamport-converse",
      kind: "mcq",
      prompt: "If C(a) < C(b), does a necessarily happen before b?",
      options: [
        "No — the events may be concurrent",
        "Yes, always",
        "Only if they are on the same process",
        "Only if a message was sent",
      ],
      answer: 0,
      explanation:
        "Lamport clocks capture one direction only: a→b implies C(a)<C(b), but not the converse.",
      hints: ["Can two independent processes have ordered timestamps?"],
      objective: "Understand Lamport clock limitations",
    },
  ],
  exam: {
    definition:
      "Lamport clocks assign logical timestamps to distributed events such that causally ordered events have ordered timestamps (but not vice versa).",
    steps: [
      "Each process maintains a counter.",
      "Increment on every event.",
      "Messages carry the sender's timestamp.",
      "Receiver sets clock = max(local, received) + 1.",
    ],
    timeComplexity: "$O(1)$ per event",
    spaceComplexity: "$O(1)$ per process",
    correctness:
      "Induction: if a→b through a chain of local events and message sends/receives, each step increases the timestamp.",
    applications: [
      "Event ordering in distributed systems",
      "Mutual exclusion",
      "Debugging distributed logs",
    ],
    limitations: ["Cannot detect concurrent events", "Vector clocks needed for full causality"],
    faq: [
      {
        q: "How do vector clocks improve on Lamport clocks?",
        a: "Vector clocks capture full causality: VC(a) < VC(b) iff a→b.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Rules for updating the clock (1). Clock condition and its limitation (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "L. Lamport, 'Time, clocks, and the ordering of events in a distributed system,' Communications of the ACM, 21(7), 1978.",
      supports: "The seminal paper on logical clocks.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
