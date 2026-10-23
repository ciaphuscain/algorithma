/** The 25 subject domains of the encyclopedia (product spec §2.2). */
export const DOMAINS = [
  { id: "searching-sorting", title: "Searching and Sorting", short: "Search & Sort" },
  { id: "arrays-hashing", title: "Arrays, Prefix Sums, and Hashing", short: "Arrays & Hashing" },
  {
    id: "linear-structures",
    title: "Linked Lists, Stacks, Queues, and Heaps",
    short: "Lists & Heaps",
  },
  { id: "trees", title: "Trees and Advanced Data Structures", short: "Trees" },
  { id: "graphs", title: "Graph Algorithms", short: "Graphs" },
  { id: "dynamic-programming", title: "Dynamic Programming", short: "Dynamic Programming" },
  { id: "strings", title: "String Processing and Pattern Matching", short: "Strings" },
  {
    id: "number-theory",
    title: "Number Theory and Mathematical Algorithms",
    short: "Number Theory & Math",
  },
  { id: "geometry", title: "Computational Geometry", short: "Geometry" },
  { id: "randomized", title: "Randomized and Probabilistic Algorithms", short: "Randomized" },
  { id: "optimization", title: "Approximation and Optimization", short: "Approximation" },
  { id: "parallel", title: "Parallel Computing and GPU Algorithms", short: "Parallel" },
  { id: "distributed", title: "Distributed Systems and Consensus", short: "Distributed" },
  { id: "cryptography", title: "Cryptography and Security", short: "Cryptography" },
  { id: "databases", title: "Databases and External Memory Algorithms", short: "Databases" },
  { id: "ai-search", title: "Artificial Intelligence and Search", short: "AI & Search" },
  { id: "machine-learning", title: "Machine Learning", short: "Machine Learning" },
  { id: "deep-learning", title: "Deep Learning and Neural Networks", short: "Deep Learning" },
  { id: "operating-systems", title: "Operating Systems and Scheduling", short: "OS & Scheduling" },
  { id: "networks", title: "Computer Networks and Routing", short: "Networks" },
  { id: "compilers", title: "Compilers and Programming Languages", short: "Compilers" },
  {
    id: "bioinformatics",
    title: "Computational Biology and Bioinformatics",
    short: "Bioinformatics",
  },
  { id: "robotics", title: "Robotics and Path Planning", short: "Robotics" },
  { id: "compression", title: "Information Theory and Compression", short: "Compression" },
  { id: "research", title: "Advanced, Experimental, and Research Algorithms", short: "Research" },
] as const;

export type DomainId = (typeof DOMAINS)[number]["id"];

const byId = new Map<string, (typeof DOMAINS)[number]>(DOMAINS.map((d) => [d.id, d]));

export function getDomain(id: string) {
  return byId.get(id);
}
