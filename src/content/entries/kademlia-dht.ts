import type { AlgorithmEntry } from "../types";

export const kademliaDhtEntry: AlgorithmEntry = {
  slug: "kademlia-dht",
  name: "Kademlia DHT",
  aliases: ["Kademlia", "XOR-based DHT"],
  curriculum: [552],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "A peer-to-peer distributed hash table that uses XOR distance to route lookups in O(log n) hops, with k-buckets for peer management and iterative node lookups.",
  tags: ["DHT", "peer-to-peer", "XOR distance", "distributed"],
  prerequisites: ["Distributed Hash Tables"],
  related: ["chord-dht", "consistent-hashing"],
  problem: {
    input: "A network of n nodes, each with a unique ID, and key-value pairs to store.",
    output: "A distributed system where any key can be looked up in O(log n) hops.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each node has a 160-bit ID. The distance between two IDs is their XOR, which is a metric. Each node maintains contacts (k-buckets) for exponentially increasing distance ranges, like a binary tree where you know more nodes in your neighborhood.",
      },
      {
        kind: "p",
        text: "To find the node responsible for a key, you iteratively ask the closest known nodes for even closer nodes, converging in O(log n) steps.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Each node maintains 160 k-buckets: bucket $i$ holds up to $k$ contacts with XOR distance in $[2^i, 2^{i+1})$.",
          "To look up a key, compute XOR distance to known contacts, query the $\\alpha$ closest ones.",
          "Each queried node returns its $k$ closest contacts to the target.",
          "Repeat with the new closest contacts until no closer nodes are found.",
          "The closest node to the key is responsible for storing it.",
        ],
      },
      {
        kind: "p",
        text: "**Example.** Node 0011 looks for key 1100. XOR distance = 1111 (15). It queries nodes from bucket 3 (distance 8-15). They return closer nodes (distance 4-7), then closer still, converging to the node nearest 1100.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "k is typically 20; α (parallelism parameter) is typically 3.",
          "Nodes are evicted from k-buckets only if they fail to respond — longer-lived nodes are preferred.",
          "STORE, FIND_NODE, FIND_VALUE, PING are the four RPCs.",
          "Republishing: nodes periodically re-store their keys on the closest nodes.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With n nodes and 160-bit IDs, each bucket covers an exponentially larger range. A lookup halves the distance each step, requiring $O(\\log n)$ rounds. Each round contacts $\\alpha$ nodes in parallel.",
      },
      {
        kind: "p",
        text: "XOR is a valid metric: $d(x,y) = 0 \\iff x = y$, symmetric, and satisfies triangle inequality.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used in BitTorrent's mainline DHT, Ethereum, and IPFS.",
          "Sybil attacks: an attacker creates many fake node IDs near a target key.",
          "S/Kademlia adds crypto puzzles and disjoint lookup paths for security.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    space: "O(k log n)",
    worstClass: "log n",
    note: "Per lookup. k is the replication parameter (typically 20).",
  },
  properties: [
    {
      label: "Symmetric distance",
      value: "XOR distance is symmetric",
    },
    {
      label: "Lookup hops",
      value: "O(log n)",
    },
    {
      label: "Fault tolerance",
      value: "k-bucket redundancy handles node churn",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "kademlia_xor_distance",
      code: `def kademlia_xor_distance(a, b):
    """XOR distance between two node IDs."""
    return a ^ b

def find_closest(node_id, contacts, target, k=3):
    """Return the k contacts closest to target by XOR distance."""
    return sorted(contacts, key=lambda c: c ^ target)[:k]

def simulate_lookup(nodes, start, target, k=3):
    """Simulate a Kademlia lookup. nodes is dict {id: [contacts]}.
    Returns the closest node to target found."""
    queried = set()
    closest = sorted(nodes[start], key=lambda c: c ^ target)[:k]
    while True:
        to_query = [c for c in closest if c not in queried]
        if not to_query:
            break
        for c in to_query:
            queried.add(c)
            if c in nodes:
                for contact in nodes[c]:
                    if contact not in closest:
                        closest.append(contact)
        closest = sorted(closest, key=lambda c: c ^ target)[:k]
    return closest[0] if closest else start
`,
      tests: [
        {
          args: [5, 3],
          expected: 6,
        },
        {
          args: [0, 0],
          expected: 0,
        },
        {
          args: [15, 1],
          expected: 14,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "kademlia-distance",
      kind: "mcq",
      prompt: "What distance metric does Kademlia use?",
      options: ["XOR of node IDs", "Geographic distance", "Hop count", "Hamming distance"],
      answer: 0,
      explanation: "Kademlia uses XOR as a symmetric distance metric between node IDs.",
      hints: ["It's a bitwise operation on IDs."],
      objective: "Understand XOR distance",
    },
  ],
  exam: {
    definition:
      "Kademlia is a DHT using XOR distance for routing, with k-buckets organizing contacts by distance ranges, achieving O(log n) lookup hops.",
    steps: [
      "Maintain k-buckets per distance range.",
      "Iteratively query closest nodes to target.",
      "Converge to responsible node in O(log n) steps.",
    ],
    timeComplexity: "$O(\\log n)$ hops per lookup",
    spaceComplexity: "$O(k \\log n)$ per node",
    correctness:
      "XOR distance halves each iteration; k-bucket redundancy ensures live contacts are available.",
    applications: ["BitTorrent DHT", "IPFS", "Ethereum"],
    limitations: ["Vulnerable to Sybil attacks", "Churn causes stale contacts"],
    faq: [
      {
        q: "Why XOR?",
        a: "XOR is symmetric (d(a,b)=d(b,a)), so lookups converge from both sides, simplifying routing.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["XOR distance and k-buckets (1). Lookup procedure and O(log n) proof (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "P. Maymounkov and D. Mazières, 'Kademlia: A peer-to-peer information system based on the XOR metric,' IPTPS, 2002.",
      supports: "The original Kademlia paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
