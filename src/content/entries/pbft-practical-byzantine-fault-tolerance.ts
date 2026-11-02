import type { AlgorithmEntry } from "../types";

export const pbftPracticalByzantineFaultToleranceEntry: AlgorithmEntry = {
  slug: "pbft-practical-byzantine-fault-tolerance",
  name: "PBFT (Practical Byzantine Fault Tolerance)",
  aliases: ["PBFT"],
  curriculum: [550],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "Achieves consensus among 3f+1 replicas despite up to f Byzantine (arbitrarily faulty) nodes through a three-phase protocol: pre-prepare, prepare, and commit, ensuring safety and liveness.",
  tags: ["consensus", "Byzantine", "fault tolerance", "distributed"],
  prerequisites: ["Paxos"],
  related: ["paxos", "raft"],
  problem: {
    input: "Client requests sent to a set of 3f+1 replicas, up to f of which may be Byzantine.",
    output: "A consistent total order of executed requests agreed upon by all correct replicas.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In a Byzantine setting, faulty nodes can lie, send conflicting messages, or go silent. PBFT ensures that as long as fewer than a third of nodes are faulty, correct nodes agree on the same sequence of operations. The 3f+1 threshold ensures honest nodes always outnumber faulty ones in any quorum.",
      },
      {
        kind: "p",
        text: "The three phases (pre-prepare, prepare, commit) progressively lock in the decision: after prepare, correct nodes agree on what to execute; after commit, they know everyone agrees.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Pre-prepare:** The primary (leader) assigns a sequence number to a client request and broadcasts it.",
          "**Prepare:** Each replica validates and broadcasts a prepare message. A replica is 'prepared' when it has 2f+1 matching prepares.",
          "**Commit:** Each prepared replica broadcasts commit. After 2f+1 commits, the request is committed and executed.",
          "**Reply:** The client waits for f+1 matching replies.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** With f=1 (4 replicas), the primary sends pre-prepare; 3 matching prepares suffice; 3 matching commits confirm.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "View changes handle a faulty primary: replicas timeout and elect a new primary.",
          "Checkpoints and garbage collection bound the log size.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Message complexity per request: $O(n^2)$ where $n = 3f+1$. The 2f+1 quorum ensures any two quorums overlap in at least one correct node.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Modern BFT protocols (HotStuff, Tendermint) reduce communication to $O(n)$ using threshold signatures.",
          "PBFT is the basis of many blockchain consensus mechanisms.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n^2)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
    space: "O(n)",
    worstClass: "n^2",
    note: "n = 3f+1 replicas; O(n²) messages per consensus round.",
  },
  properties: [
    {
      label: "Fault tolerance",
      value: "Up to f Byzantine faults with 3f+1 nodes",
    },
    {
      label: "Phases",
      value: "Pre-prepare → Prepare → Commit",
    },
    {
      label: "Message complexity",
      value: "$O(n^2)$ per round",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "pbft_quorum",
      code: `def pbft_quorum(n):
    """Given n replicas, return (max faults tolerated, quorum size needed)."""
    f = (n - 1) // 3
    quorum = 2 * f + 1
    return f, quorum
`,
      tests: [
        {
          args: [4],
          expected: [1, 3],
        },
        {
          args: [7],
          expected: [2, 5],
        },
        {
          args: [10],
          expected: [3, 7],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pbft-n",
      kind: "mcq",
      prompt: "How many replicas does PBFT need to tolerate f Byzantine faults?",
      options: ["3f + 1", "2f + 1", "f + 1", "4f + 1"],
      answer: 0,
      explanation:
        "3f+1 ensures that even with f faulty nodes, quorums of 2f+1 always contain a majority of correct nodes.",
      hints: ["How many nodes must be correct to outvote f faulty ones?"],
      objective: "Know PBFT threshold",
    },
  ],
  exam: {
    definition:
      "PBFT achieves Byzantine consensus with 3f+1 replicas through three phases: pre-prepare, prepare, and commit.",
    steps: [
      "Primary assigns sequence number (pre-prepare).",
      "Replicas broadcast prepare; wait for 2f+1.",
      "Broadcast commit; wait for 2f+1.",
      "Execute and reply.",
    ],
    timeComplexity: "$O(n^2)$ messages per round.",
    spaceComplexity: "$O(n)$ log per replica.",
    correctness:
      "Any two 2f+1 quorums share at least f+1 members, of which at least one is correct, ensuring consistency.",
    applications: ["Blockchain consensus", "Replicated state machines", "Financial systems"],
    limitations: ["O(n²) messages limit scalability", "Requires known membership"],
    faq: [
      {
        q: "Why 3f+1?",
        a: "With 3f+1 nodes, quorums of 2f+1 overlap in f+1 nodes — even if f are faulty, at least one overlap node is correct.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Three phases and quorum argument (2)."],
      },
    ],
  },
  references: [
    {
      citation: 'M. Castro, B. Liskov, "Practical Byzantine Fault Tolerance," OSDI 1999.',
      supports: "The original PBFT paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
