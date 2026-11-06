import type { AlgorithmEntry } from "../types";

export const snapshotIsolationEntry: AlgorithmEntry = {
  slug: "snapshot-isolation",
  name: "Snapshot Isolation",
  aliases: ["SI", "MVCC Snapshot Isolation"],
  curriculum: [558],
  domain: "databases",
  subcategory: "Database Algorithms",
  difficulty: "intermediate",
  summary:
    "Snapshot isolation provides each transaction a consistent view of the database as of its start time, using multi-version concurrency control (MVCC) to avoid read-write conflicts.",
  tags: ["concurrency control", "MVCC", "isolation level", "transactions"],
  prerequisites: ["Two-Phase Locking"],
  related: ["two-phase-locking", "two-phase-commit"],
  problem: {
    input: "Concurrent database transactions that read and write shared data.",
    output:
      "A schedule where each transaction sees a consistent snapshot and write-write conflicts are detected.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In snapshot isolation, every transaction reads from a frozen snapshot of the database taken at the transaction's start. Reads never block writes, and writes never block reads. Conflicts only arise when two concurrent transactions write to the same item — the first to commit wins, and the other must abort (first-committer-wins rule).",
      },
      {
        kind: "p",
        text: "This gives much better concurrency than locking (readers and writers don't interfere) while preventing most anomalies. However, it is not fully serializable: the write skew anomaly can occur.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "When a transaction T starts, record its start timestamp ts.",
          "T reads all data as of version ts (ignore all later writes).",
          "T writes go into a local buffer.",
          "At commit: check if any other transaction committed a write to the same key between ts and now. If so, abort T. Otherwise, assign a commit timestamp and make writes visible.",
        ],
      },
      {
        kind: "p",
        text: "**Example**: T1 starts at t=10, T2 starts at t=11. T1 writes x=5, T2 writes y=3. Both commit — no conflict. If T2 also wrote x, it would abort (T1 committed x first).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "MVCC maintains multiple versions of each row, each tagged with its transaction's commit timestamp.",
          "Garbage collection removes old versions no longer needed by any active transaction.",
          "PostgreSQL, Oracle, SQL Server all implement variants of snapshot isolation.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Snapshot isolation prevents dirty reads, non-repeatable reads, and phantom reads. It does NOT prevent write skew: two transactions can read overlapping data, each write to a different item, and both commit, producing a state that no serial execution would. Serializable Snapshot Isolation (SSI) adds dependency tracking to close this gap.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "PostgreSQL's SERIALIZABLE mode uses SSI (Serializable Snapshot Isolation) by Cahill et al. (2009).",
          "CockroachDB and Spanner implement serializable isolation with MVCC at global scale.",
          "Write skew detection requires tracking read sets, which SSI does efficiently with read-write dependency graphs.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(n)",
    },
    space: "O(v)",
    worstClass: "other",
    note: "Reads are O(1) per key via version lookup; space grows with number of versions v.",
  },
  properties: [
    {
      label: "Read blocking",
      value: "None (reads from snapshot)",
    },
    {
      label: "Write conflicts",
      value: "First-committer-wins",
    },
    {
      label: "Anomalies prevented",
      value: "All except write skew",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "snapshot_isolation",
      code: `def snapshot_isolation(operations):
    """Simulate snapshot isolation on a sequence of operations.
    operations: list of (txn_id, 'read'|'write'|'start'|'commit', key, value).
    Returns dict of committed transaction results and aborted list."""
    store = {}  # key -> [(commit_ts, value)]
    txns = {}   # txn_id -> {start_ts, writes, status}
    ts = 0
    committed = {}
    aborted = []
    for op in operations:
        txn_id = op[0]
        action = op[1]
        if action == 'start':
            ts += 1
            txns[txn_id] = {'start_ts': ts, 'writes': {}, 'reads': {}}
        elif action == 'write':
            txns[txn_id]['writes'][op[2]] = op[3]
        elif action == 'read':
            key = op[2]
            t = txns[txn_id]
            if key in t['writes']:
                t['reads'][key] = t['writes'][key]
            elif key in store:
                val = None
                for cts, v in reversed(store[key]):
                    if cts <= t['start_ts']:
                        val = v
                        break
                t['reads'][key] = val
        elif action == 'commit':
            t = txns[txn_id]
            ts += 1
            conflict = False
            for key in t['writes']:
                if key in store:
                    for cts, v in store[key]:
                        if cts > t['start_ts']:
                            conflict = True
                            break
                if conflict:
                    break
            if conflict:
                aborted.append(txn_id)
            else:
                for key, val in t['writes'].items():
                    if key not in store:
                        store[key] = []
                    store[key].append((ts, val))
                committed[txn_id] = t['writes']
    return [committed, aborted]
`,
      tests: [
        {
          args: [
            [
              ["T1", "start", null, null],
              ["T2", "start", null, null],
              ["T1", "write", "x", 10],
              ["T1", "commit", null, null],
              ["T2", "write", "x", 20],
              ["T2", "commit", null, null],
            ],
          ],
          expected: [
            {
              T1: {
                x: 10,
              },
            },
            ["T2"],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "si-anomaly",
      kind: "mcq",
      prompt: "Which anomaly can occur under snapshot isolation but not under serializability?",
      options: ["Write skew", "Dirty read", "Non-repeatable read", "Phantom read"],
      answer: 0,
      explanation:
        "Snapshot isolation prevents dirty/non-repeatable/phantom reads but allows write skew, where two transactions read overlapping data and each write different items.",
      hints: ["Think about what SI does NOT check."],
      objective: "Understand SI limitations",
    },
  ],
  exam: {
    definition:
      "Snapshot isolation gives each transaction a consistent read snapshot and detects write-write conflicts at commit time.",
    steps: [
      "Record start timestamp.",
      "Read from snapshot.",
      "Buffer writes.",
      "At commit, check for conflicting writes.",
    ],
    timeComplexity: "O(1) per read, O(w) per commit for w write conflicts",
    spaceComplexity: "O(v) for versions",
    correctness:
      "Prevents all read anomalies; first-committer-wins prevents lost updates. Write skew remains possible.",
    applications: ["PostgreSQL", "Oracle", "SQL Server", "CockroachDB"],
    limitations: ["Write skew anomaly", "Version storage overhead"],
    faq: [
      {
        q: "How is write skew fixed?",
        a: "Serializable Snapshot Isolation (SSI) tracks rw-dependencies and aborts dangerous patterns.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "MVCC reads and write conflict detection (1).",
          "Comparison with serializability (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "H. Berenson et al., 'A Critique of ANSI SQL Isolation Levels,' SIGMOD 1995.",
      supports: "Defined snapshot isolation formally.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
