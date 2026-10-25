import type { AlgorithmEntry } from "../types";

export const raftEntry: AlgorithmEntry = {
  slug: "raft",
  name: "Raft Consensus",
  aliases: ["Raft", "Replicated log", "Leader-based consensus"],
  curriculum: [467],
  domain: "distributed",
  subcategory: "Consensus",
  difficulty: "advanced",
  summary:
    "Keeps a replicated log consistent across servers: one leader per term, elected by majority with randomized timeouts, appends client commands and replicates them; an entry is committed once a majority stores it. Committed entries survive crashes and leader changes.",
  tags: [
    "raft",
    "consensus",
    "leader election",
    "replicated log",
    "state machine replication",
    "fault tolerance",
  ],
  prerequisites: ["Paxos Consensus"],
  related: ["paxos", "mapreduce"],
  problem: {
    input:
      "3 or 5 servers, client commands with arrival times, optionally one server crashing and restarting, a message-loss rate and a seed.",
    output:
      "Each server's log and commit index, and the elections won, such that every server applies the same committed commands in the same order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To make a service survive machine failures, run it on several servers and feed them the same commands in the same order: a **replicated log**. Raft makes this manageable by always having one **leader** that decides the order; the others follow. If the leader goes quiet, someone else takes over.",
      },
      {
        kind: "p",
        text: "Time is divided into numbered **terms**, each with at most one leader. A command is safe (committed) once a majority of servers have it in their logs, because any future leader needs votes from a majority, and voters refuse candidates whose logs are behind theirs.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Every server starts as a follower with a random election timeout (here 12–24 time units).",
          "A follower that hears nothing from a leader before its timeout becomes a candidate: it increments the term, votes for itself and asks the others for votes.",
          "A server grants at most one vote per term, and only to a candidate whose log is at least as up to date (later last term, or the same last term and at least as long).",
          "With votes from a majority, the candidate becomes leader and sends AppendEntries every few time units (here 4); empty ones are heartbeats.",
          "The leader appends client commands to its log and sends each follower the entries from that follower's next index. A follower accepts them only if its log matches the leader's at the entry before; otherwise the leader backs up one entry and retries.",
          "The leader commits index N once a majority stores entry N and entry N is from the current term; followers learn the commit index from later AppendEntries.",
          "Any message with a higher term makes the receiver adopt that term and become a follower.",
        ],
      },
      {
        kind: "p",
        text: "**Worked examples** (presets). With three servers and no failures, S2 wins the first election at time 16, and x=1 and y=2 are committed on all servers by time 47. In the failover preset, S3 leads term 1 from time 20 and commits x=1; it crashes at 40, and after an election timeout S1 wins term 2 at time 59. y=2 arrives at time 70 and is committed in term 2. S3 restarts at 90 and catches up from the new leader.",
      },
      {
        kind: "table",
        head: ["Preset", "Elections won (term: server at time)", "Final committed log"],
        rows: [
          ["Three servers", "1: S2 at 16", "1:x=1, 1:y=2"],
          ["Failover", "1: S3 at 20; 2: S1 at 59", "1:x=1, 2:y=2"],
          [
            "Overwritten entries",
            "1: S3 at 16; 2: S2 at 59; 3: S1 at 60",
            "1:c1, 1:c2, 1:c3, 3:c5",
          ],
        ],
      },
      {
        kind: "p",
        text: "The third preset shows what Raft does **not** promise. With 27% of messages lost, S2 briefly leads term 2 and appends c6 and c4, but they never reach a majority; S1 then wins term 3 and appends c5 at the same index, overwriting them. c4 and c6 were never committed, so losing them is allowed: a real client is told “done” only after its command commits, and otherwise retries. When c5 commits, the older entries c2 and c3, not yet committed, commit with it.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "currentTerm, votedFor and the log must be on stable storage before replying; the commit index can be relearned after a restart, as here.",
          "Randomized election timeouts make split votes rare; the timeout must be much longer than a round trip and the heartbeat interval.",
          "Never commit an entry from an earlier term by counting replicas alone; commit a current-term entry and the earlier ones follow (the Raft paper's Figure 8 shows a log being lost otherwise).",
          "Production systems add log compaction (snapshots), membership changes, pre-vote, and read leases; this visualizer has none of them, at most one crash, and a client that does not retry.",
          "The Python sample is the follower side of AppendEntries, including the conflict rule; the JavaScript sample is the leader's commit rule.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Raft guarantees five properties. The tests check four of them on every run, from the recorded history and independently of the implementation:",
      },
      {
        kind: "list",
        items: [
          "**Election safety**: at most one leader per term (each server votes once per term, and majorities intersect).",
          "**Log matching**: if two logs have an entry with the same index and term, they are identical up to that index (a leader creates at most one entry per index in a term, and the consistency check on the previous entry carries this by induction). The tests also check that terms never decrease along any log.",
          "**Leader completeness**: an entry committed before an election is in the new leader's log (a voter in the committing majority refuses any candidate with a less up-to-date log).",
          "**State machine safety**: no two servers commit different entries at the same index.",
          "**Leader append-only**: a leader never overwrites its own log; this one follows from the code structure rather than being checked.",
        ],
      },
      {
        kind: "p",
        text: "Like Paxos, Raft cannot guarantee progress in a fully asynchronous network (FLP), but it does make progress whenever messages are delivered within the election timeout and a majority is up.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Raft and Multi-Paxos have the same fault tolerance (fewer than half of the servers may fail) and similar costs: one round trip from the leader per committed batch.",
          "Membership changes use joint consensus or single-server changes so that old and new majorities always overlap.",
          "Linearizable reads must go through the log or use leader leases, or a deposed leader could serve stale data.",
          "etcd, Consul and CockroachDB use Raft.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "\\text{unbounded}" },
    space: "O(L)",
    worstClass: "other",
    note: "Per committed command, one round trip and 2(N − 1) messages from a stable leader; elections take a timeout plus a round trip, and progress is not guaranteed while messages are being lost. L is the log length.",
  },
  properties: [
    { label: "Leaders", value: "At most one per term" },
    { label: "Tolerates", value: "Fewer than half of the servers failing" },
    {
      label: "Committed means",
      value: "Stored on a majority, and from the leader's term (or before such an entry)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "append_entries",
      code: `def append_entries(log, prev_index, prev_term, entries):
    # Follower side of AppendEntries. log and entries hold [term, command] pairs;
    # indexes start at 1. Returns [success, the log after the call].
    if prev_index > len(log) or (prev_index > 0 and log[prev_index - 1][0] != prev_term):
        return [False, log]
    log = list(log)
    for k, entry in enumerate(entries):
        i = prev_index + k                     # 0-based slot for this entry
        if i < len(log) and log[i][0] != entry[0]:
            del log[i:]                        # conflict: drop it and everything after
        if i >= len(log):
            log.append(entry)
    return [True, log]
`,
      tests: [
        {
          args: [
            [
              [1, "a"],
              [1, "b"],
              [1, "c"],
            ],
            1,
            1,
            [[2, "x"]],
          ],
          expected: [
            true,
            [
              [1, "a"],
              [2, "x"],
            ],
          ],
        },
        { args: [[[1, "a"]], 2, 1, [[2, "x"]]], expected: [false, [[1, "a"]]] },
        {
          args: [
            [
              [1, "a"],
              [2, "b"],
            ],
            1,
            1,
            [[2, "b"]],
          ],
          expected: [
            true,
            [
              [1, "a"],
              [2, "b"],
            ],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "newCommitIndex",
      code: `// Leader side: the highest index stored on a majority (matchIndex includes the
// leader) whose entry is from the current term; earlier entries commit with it.
function newCommitIndex(matchIndex, logTerms, currentTerm, commit) {
  const majority = Math.floor(matchIndex.length / 2) + 1;
  for (let n = logTerms.length; n > commit; n--) {
    if (logTerms[n - 1] !== currentTerm) break;
    if (matchIndex.filter((m) => m >= n).length >= majority) return n;
  }
  return commit;
}
`,
      tests: [
        { args: [[3, 3, 1], [1, 1, 2], 2, 0], expected: 3 },
        { args: [[2, 2, 1], [1, 2], 4, 1], expected: 1 },
        { args: [[3, 3, 1], [1, 2, 4], 4, 1], expected: 3 },
      ],
    },
  ],
  visualizer: "raft",
  practice: [
    {
      id: "raft-majority",
      kind: "numeric",
      prompt: "How many of 5 servers can crash while a Raft cluster can still commit new commands?",
      answer: 2,
      explanation: "A majority (3) must be up to elect a leader and commit, so up to 2 may fail.",
      hints: ["What size is a majority of 5?"],
      objective: "Relate cluster size and fault tolerance",
    },
    {
      id: "raft-vote",
      kind: "mcq",
      prompt:
        "A voter's last log entry is (term 3, index 7). Which candidate may it vote for, if it has not voted this term?",
      options: [
        "A candidate whose last entry is (term 3, index 7)",
        "A candidate whose last entry is (term 2, index 9)",
        "A candidate whose last entry is (term 3, index 6)",
        "Any candidate with a higher current term",
      ],
      answer: 0,
      explanation:
        "The candidate's log must be at least as up to date: a later last term, or the same last term and at least the same length.",
      distractors: {
        1: "Term 2 is older than 3, whatever the length.",
        2: "Same term but shorter: it may lack a committed entry.",
        3: "A higher current term alone is not enough; the log must be up to date.",
      },
      hints: ["Compare last terms first, then lengths."],
      objective: "Apply the election restriction",
    },
    {
      id: "raft-commit",
      kind: "numeric",
      prompt:
        "A leader in term 4 has log terms [1, 2] and match indexes [2, 2, 1] (itself included), with commit index 1. What commit index does the commit rule give?",
      answer: 1,
      explanation:
        "Entry 2 is on a majority but is from term 2, not the current term 4, so it cannot be committed by counting. It will commit once a term-4 entry after it does.",
      hints: ["Check the term of entry 2."],
      objective: "Apply the current-term commit rule",
    },
  ],
  exam: {
    definition:
      "Raft is a consensus algorithm for managing a replicated log: a leader elected per term by majority vote appends client commands and replicates them with AppendEntries; entries stored on a majority in the leader's term are committed and applied in order by all servers.",
    steps: [
      "Leader election with randomized timeouts and up-to-date checks",
      "Log replication with the consistency check on the previous entry",
      "Commit by majority (current-term entries)",
      "Followers apply committed entries in order",
    ],
    timeComplexity:
      "One round trip per committed batch with a stable leader; elections take one timeout plus a round trip.",
    spaceComplexity: "$O(L)$ log per server (bounded in practice by snapshots).",
    correctness:
      "Election safety, log matching, leader completeness and state machine safety together ensure all servers apply the same commands in the same order.",
    applications: [
      "Configuration stores (etcd, Consul)",
      "Distributed databases",
      "Lock services",
      "Any replicated state machine",
    ],
    limitations: [
      "A majority must be up and connected",
      "The leader is a throughput bottleneck",
      "Crash faults only, not Byzantine",
    ],
    faq: [
      {
        q: "Why randomized timeouts?",
        a: "So that usually one server times out first and wins before others start competing; fixed timeouts cause repeated split votes.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Leader election and log replication.", "Commit on a majority."] },
      {
        marks: 5,
        outline: [
          "Terms and roles (1).",
          "Election with the up-to-date check (2).",
          "Replication and commit (2).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Replicated state machines and the role of the log (1).",
          "Leader election (2).",
          "Log replication and conflict handling (2).",
          "Commit rule including the current-term restriction (2).",
          "The safety properties and why they hold (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. Ongaro, J. Ousterhout, “In search of an understandable consensus algorithm,” Proc. USENIX Annual Technical Conference (ATC), 2014, pp. 305–319.",
      supports: "The algorithm, its five safety properties and the Figure 8 commit example.",
    },
    {
      citation:
        "D. Ongaro, Consensus: Bridging Theory and Practice, PhD thesis, Stanford University, 2014.",
      supports: "Membership changes, log compaction, client interaction and pre-vote.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked examples are checked by automated tests, and every visualizer run is checked against four of Raft's safety properties; the prose has not yet had expert review. The visualizer omits snapshots, membership changes and client retries, and allows at most one crash.",
  },
  version: 1,
  updated: "2026-10-25",
};
