import type { AlgorithmEntry } from "../types";

export const paxosEntry: AlgorithmEntry = {
  slug: "paxos",
  name: "Paxos Consensus",
  aliases: ["Single-decree Paxos", "Basic Paxos", "Synod protocol"],
  curriculum: [466],
  domain: "distributed",
  subcategory: "Consensus",
  difficulty: "advanced",
  summary:
    "Lets a group of unreliable processes agree on one value, even if messages are lost or delayed and proposers compete. Numbered ballots in two phases (prepare/promise, accept/accepted) guarantee that once a majority accepts a value, every later ballot can only propose that same value.",
  tags: ["paxos", "consensus", "quorum", "distributed systems", "fault tolerance", "ballots"],
  prerequisites: ["Basic probability", "Message passing"],
  related: ["raft", "mapreduce"],
  problem: {
    input:
      "Acceptors (3 or 5), proposers each with a value and a start time, a message-loss rate and a seed.",
    output: "At most one chosen value, and which proposers learned it.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Several servers must agree on one value, say which machine is in charge, while messages get lost and servers propose different things at once. Voting once is not enough: two proposers can each collect half the votes, and a lost message can hide who won.",
      },
      {
        kind: "p",
        text: "Paxos uses **numbered ballots** and **majorities**. Any two majorities share at least one acceptor, and that shared acceptor carries information forward: before proposing, a proposer asks a majority what they have already accepted, and if anything was, it must propose that value instead of its own. So once a value is chosen, it is the only value any later ballot can propose.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Phase 1a: a proposer picks a ballot number n higher than any it has used and sends prepare(n) to all acceptors.",
          "Phase 1b: an acceptor that has not promised a higher ballot promises n and replies with the highest-numbered value it has accepted, if any.",
          "Phase 2a: with promises from a majority, the proposer chooses the value of the highest-numbered accepted ballot among the replies, or its own value if none, and sends accept(n, v).",
          "Phase 2b: an acceptor accepts unless it has promised a higher ballot, and replies accepted(n, v).",
          "With accepted replies from a majority, v is chosen. On a refusal or a timeout the proposer waits a random time and tries a higher ballot.",
        ],
      },
      {
        kind: "p",
        text: "Ballot numbers here are round × (number of proposers) + proposer number, so no two proposers ever use the same one.",
      },
      {
        kind: "p",
        text: "**Worked example** (the duel preset): proposer P1 wants X and starts at time 0 with ballot 3; P2 wants Y and starts at time 2 with ballot 4.",
      },
      {
        kind: "table",
        head: ["Time", "What happens"],
        rows: [
          [
            "4",
            "A3 accepts X in ballot 3; A1 and A2 have already promised ballot 4, so they refuse it",
          ],
          ["9–10", "A1, A3 and then A2 accept Y in ballot 4"],
          ["11", "P2 has a majority of accepted replies: Y is chosen"],
          [
            "15–17",
            "P1 retries with ballot 7; the promises report (4, Y), so P1 must propose Y, and A2, A1 and A3 accept it",
          ],
          ["19", "P1 learns that Y is chosen"],
        ],
      },
      {
        kind: "p",
        text: "X was accepted by one acceptor only, never by a majority, so it was never chosen, and P1 ends up helping to confirm Y.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Acceptors must store their promised ballot and accepted (ballot, value) durably before replying, or a restart can make them break a promise.",
          "Duelling proposers can pre-empt each other forever (no progress, but never a wrong answer). Random back-off, as here, or a single elected leader makes progress likely.",
          "Real systems run Multi-Paxos: one leader does phase 1 once for many slots and then needs only phase 2 per value, which is how a replicated log is built.",
          "This visualizer runs single-decree Paxos with acceptors that never crash; messages can be lost (the loss rate) and take 1–3 time units.",
          "The Python sample replays two ballots synchronously; the JavaScript sample is the safety check the tests apply to every run: which values did a majority accept in one ballot?",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Quorum intersection.** Any two majorities of N acceptors share at least one acceptor, because $\\lfloor N/2 \\rfloor + 1$ plus $\\lfloor N/2 \\rfloor + 1$ exceeds N.",
      },
      {
        kind: "p",
        text: "**Safety (Lamport's P2).** Suppose v is chosen in ballot b: a majority Q accepted (b, v). Take any higher ballot b′ that reaches phase 2. Its proposer collected promises from a majority Q′, which shares an acceptor with Q. By induction on ballots between b and b′, the highest accepted ballot reported to it is at least b and carries v, so it proposes v. Hence every accepted value in ballots ≥ b is v, and no other value can ever be chosen.",
      },
      {
        kind: "p",
        text: "The tests check exactly these properties on every run, independently of the implementation: at most one value chosen; it was proposed by someone; no acceptor accepts a different value at or after the first ballot that chose; each acceptor's accepted ballots increase; and every proposer that announces a value saw a majority accept it.",
      },
      {
        kind: "p",
        text: "**Liveness** cannot be guaranteed: Fischer, Lynch and Paterson proved that no deterministic protocol can guarantee agreement in an asynchronous system if even one process may crash. Paxos keeps safety always and makes progress when the network behaves and one proposer is left alone long enough. Each run of the test suite checks 400 random schedules (up to 40% of messages lost, up to three racing proposers) and has found no safety violation; some of those schedules end without any value chosen.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Multi-Paxos with a stable leader replicates a log, with one round trip per entry; Raft is a closely related design that specifies the leader and log handling in full.",
          "Fast Paxos saves a message delay when there is no contention; Flexible Paxos shows that phase 1 and phase 2 quorums only need to intersect each other, not be majorities.",
          "Byzantine fault tolerance (for lying processes) needs more replicas: 3f + 1 to tolerate f faulty ones, as in PBFT.",
          "Google's Chubby lock service is a well-documented production use of Paxos.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "\\text{unbounded}" },
    space: "O(1)",
    worstClass: "other",
    note: "Measured in message rounds: two round trips (4N messages with N acceptors) when one proposer runs alone; competing proposers can delay agreement indefinitely, though never violate safety.",
  },
  properties: [
    {
      label: "Safety",
      value: "At most one value is ever chosen, whatever messages are lost or delayed",
    },
    { label: "Tolerates", value: "Fewer than half of the acceptors failing" },
    { label: "Liveness", value: "Not guaranteed (FLP); likely with back-off or a leader" },
  ],
  implementations: [
    {
      language: "python",
      entry: "two_proposers",
      code: `class Acceptor:
    def __init__(self):
        self.promised = 0
        self.accepted = None                   # (ballot, value) or None

    def prepare(self, n):
        if n > self.promised:
            self.promised = n
            return ("promise", self.accepted)
        return ("nack", self.promised)

    def accept(self, n, v):
        if n >= self.promised:
            self.promised = n
            self.accepted = (n, v)
            return True
        return False


def propose(acceptors, reachable, n, value):
    # One ballot n by a proposer that can reach the acceptors in \`reachable\`.
    # Returns the value chosen in this ballot, or None if it failed.
    need = len(acceptors) // 2 + 1
    replies = [acceptors[i].prepare(n) for i in reachable]
    promises = [acc for kind, acc in replies if kind == "promise"]
    if len(promises) < need:
        return None
    reported = [acc for acc in promises if acc is not None]
    if reported:
        value = max(reported)[1]               # the value of the highest ballot
    oks = sum(acceptors[i].accept(n, value) for i in reachable)
    return value if oks >= need else None


def two_proposers(reach1, reach2):
    # Ballot 1 proposes X reaching reach1, then ballot 2 proposes Y reaching reach2.
    acceptors = [Acceptor() for _ in range(3)]
    return [propose(acceptors, reach1, 1, "X"), propose(acceptors, reach2, 2, "Y")]
`,
      tests: [
        {
          args: [
            [0, 1],
            [1, 2],
          ],
          expected: ["X", "X"],
        },
        { args: [[0], [1, 2]], expected: [null, "Y"] },
        { args: [[0, 1, 2], [2]], expected: ["X", null] },
      ],
    },
    {
      language: "javascript",
      entry: "chosenValues",
      code: `// Which values were chosen? A value is chosen when a majority of acceptors accepted
// it in the same ballot. accepts: [acceptor, ballot, value] triples. Paxos is safe
// exactly when this never returns two values.
function chosenValues(accepts, acceptors) {
  const votes = new Map();
  for (const [a, ballot, value] of accepts) {
    const key = \`\${ballot}|\${value}\`;
    votes.set(key, (votes.get(key) ?? new Set()).add(a));
  }
  const need = Math.floor(acceptors / 2) + 1;
  const chosen = [...votes].filter(([, who]) => who.size >= need).map(([key]) => key.split("|")[1]);
  return [...new Set(chosen)].sort();
}
`,
      tests: [
        {
          args: [
            [
              [2, 3, "X"],
              [0, 4, "Y"],
              [2, 4, "Y"],
              [1, 4, "Y"],
              [1, 7, "Y"],
              [0, 7, "Y"],
              [2, 7, "Y"],
            ],
            3,
          ],
          expected: ["Y"],
        },
        {
          args: [
            [
              [0, 1, "X"],
              [1, 2, "Y"],
              [2, 3, "X"],
            ],
            3,
          ],
          expected: [],
        },
      ],
    },
  ],
  visualizer: "paxos",
  practice: [
    {
      id: "paxos-majority",
      kind: "numeric",
      prompt: "With 5 acceptors, how many must accept a value in one ballot for it to be chosen?",
      answer: 3,
      explanation: "A majority: ⌊5/2⌋ + 1 = 3. Any two groups of 3 out of 5 overlap.",
      hints: ["More than half."],
      objective: "Compute a quorum",
    },
    {
      id: "paxos-adopt",
      kind: "mcq",
      prompt:
        "A proposer's promises report accepted values (2, X) and (5, Y). Which value must it propose?",
      options: [
        "Y, the value of the highest ballot reported",
        "X, the first one reported",
        "Its own value",
        "Either one",
      ],
      answer: 0,
      explanation:
        "It must propose the value of the highest-numbered accepted ballot among the replies; that preserves any value that might already be chosen.",
      distractors: {
        1: "Order of arrival does not matter; ballot numbers do.",
        2: "Only when no promise reports an accepted value.",
        3: "Choosing freely could overwrite a chosen value.",
      },
      hints: ["Which ballot could have been chosen most recently?"],
      objective: "Apply the phase-2 rule",
    },
    {
      id: "paxos-flp",
      kind: "mcq",
      prompt: "What can two duelling proposers cause in Paxos?",
      options: [
        "Delay: they can keep pre-empting each other, but never cause two values to be chosen",
        "Two different values chosen",
        "A deadlock that requires a restart",
        "Acceptors breaking their promises",
      ],
      answer: 0,
      explanation:
        "Safety never depends on timing; progress does. Random back-off or a leader makes progress likely.",
      distractors: {
        1: "Quorum intersection rules that out.",
        2: "A later ballot can always start.",
        3: "Promises are kept by construction.",
      },
      hints: ["Separate safety from liveness."],
      objective: "Distinguish safety and liveness",
    },
  ],
  exam: {
    definition:
      "Paxos is a consensus protocol in which proposers run numbered ballots in two phases (prepare/promise and accept/accepted) with majorities of acceptors, guaranteeing that at most one value is chosen despite message loss, delay and crashes of a minority.",
    steps: [
      "prepare(n) to the acceptors",
      "promises from a majority, reporting accepted values",
      "accept(n, v) with v from the highest reported ballot (or own value)",
      "accepted from a majority: v chosen",
    ],
    timeComplexity: "Two message round trips without contention; unbounded with contention.",
    spaceComplexity: "$O(1)$ state per acceptor (promised ballot, accepted ballot and value).",
    correctness:
      "Majorities intersect, so any later ballot learns of a chosen value and must propose it (P2); hence only one value can be chosen.",
    applications: [
      "Replicated state machines (Multi-Paxos)",
      "Lock services and configuration stores",
      "Leader election",
      "Distributed databases",
    ],
    limitations: [
      "Liveness not guaranteed (FLP)",
      "Hard to implement fully (leader, log, reconfiguration)",
      "Crash faults only, not Byzantine",
    ],
    faq: [
      {
        q: "Paxos or Raft?",
        a: "Same fault model and similar message costs; Raft specifies the leader, log and membership changes in more detail, which makes it easier to implement correctly.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Two phases with majorities.", "At most one value chosen."] },
      {
        marks: 5,
        outline: [
          "Roles and phases (2).",
          "Value-adoption rule (2).",
          "Safety versus liveness (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem and fault model (1).",
          "Protocol in detail (3).",
          "Worked example with two proposers (2).",
          "Safety proof via quorum intersection (3).",
          "FLP and Multi-Paxos (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "L. Lamport, “The part-time parliament,” ACM Transactions on Computer Systems 16(2), 1998, pp. 133–169.",
      supports: "The original Paxos protocol.",
    },
    {
      citation: "L. Lamport, “Paxos made simple,” ACM SIGACT News 32(4), 2001, pp. 51–58.",
      supports: "The two-phase presentation, P2 and its proof used here.",
    },
    {
      citation:
        "M. J. Fischer, N. A. Lynch, M. S. Paterson, “Impossibility of distributed consensus with one faulty process,” Journal of the ACM 32(2), 1985, pp. 374–382.",
      supports: "The impossibility of guaranteed termination in asynchronous systems.",
    },
    {
      citation:
        "T. D. Chandra, R. Griesemer, J. Redstone, “Paxos made live: an engineering perspective,” Proc. 26th ACM Symposium on Principles of Distributed Computing (PODC), 2007, pp. 398–407.",
      supports: "Multi-Paxos in production (Chubby) and its engineering problems.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests, and every visualizer run is checked against Paxos's safety properties; the prose has not yet had expert review. The visualizer is single-decree Paxos with acceptors that never crash.",
  },
  version: 1,
  updated: "2026-10-25",
};
