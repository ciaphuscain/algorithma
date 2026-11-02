import { describe, expect, it } from "vitest";
import { ENTRIES, getEntry } from "@/content/catalog";
import { ENTRY_FACTS } from "@/content/facts";
import { entriesNamed, leadsTo, learningPath, prerequisitesOf } from "@/content/paths";
import type { Progress } from "@/lib/progress";
import { domainSummaries, entryPractice, practised, readyNext } from "@/lib/progress-summary";

const slugs = (es: { slug: string }[]) => es.map((e) => e.slug);

describe("learning paths", () => {
  it("every prerequisite names at most one entry", () => {
    for (const e of ENTRIES)
      for (const p of e.prerequisites)
        expect(entriesNamed(p).length, `${e.slug}: "${p}"`).toBeLessThanOrEqual(1);
  });

  it("paths list prerequisites before the entries that need them, and never the entry itself", () => {
    for (const e of ENTRIES) {
      const path = learningPath(e);
      expect(slugs(path), e.slug).not.toContain(e.slug);
      expect(new Set(slugs(path)).size).toBe(path.length);
      path.forEach((step, i) => {
        for (const p of prerequisitesOf(step).entries)
          expect(
            slugs(path).indexOf(p.slug),
            `${e.slug}: ${p.slug} before ${step.slug}`,
          ).toBeLessThan(i);
      });
      // Every direct prerequisite entry is on the path.
      for (const p of prerequisitesOf(e).entries) expect(slugs(path)).toContain(p.slug);
    }
  });

  it("resolves names, notes and aliases", () => {
    expect(slugs(prerequisitesOf(getEntry("aho-corasick")!).entries)).toEqual([
      "trie",
      "kmp",
      "bfs",
    ]);
    expect(prerequisitesOf(getEntry("bfs")!).background).toEqual([
      "Graphs and adjacency lists",
      "Queues",
    ]);
    const kosaraju = slugs(learningPath(getEntry("kosaraju")!));
    expect(kosaraju.indexOf("dfs")).toBeLessThan(kosaraju.indexOf("topological-sort-dfs"));
    expect(slugs(leadsTo(getEntry("kmp")!))).toContain("aho-corasick");
    expect(slugs(learningPath(getEntry("raft")!))).toEqual(["paxos"]);
  });
});

describe("practice summaries", () => {
  const progress = (ids: string[], wrong: string[] = []): Progress => ({
    recent: [],
    practice: Object.fromEntries([
      ...ids.map((id) => [id, { correct: true, attempts: 1, at: 0 }]),
      ...wrong.map((id) => [id, { correct: false, attempts: 2, at: 0 }]),
    ]),
  });
  const bubble = ENTRY_FACTS.find((f) => f.slug === "bubble-sort")!;

  it("an entry is practised once every question has been answered correctly", () => {
    const some = progress(bubble.questionIds.slice(0, 2), bubble.questionIds.slice(2, 3));
    expect(entryPractice(bubble, some)).toEqual({
      slug: "bubble-sort",
      total: bubble.questionIds.length,
      correct: 2,
      attempted: 3,
    });
    expect(practised(entryPractice(bubble, some))).toBe(false);
    expect(practised(entryPractice(bubble, progress(bubble.questionIds)))).toBe(true);
  });

  it("summarises by topic", () => {
    const sums = domainSummaries(ENTRY_FACTS, progress(bubble.questionIds));
    const sorting = sums.find((s) => s.domain === bubble.domain)!;
    expect(sorting.practised).toBe(1);
    expect(sorting.correct).toBe(bubble.questionIds.length);
    expect(sums.reduce((n, s) => n + s.entries, 0)).toBe(ENTRIES.length);
  });

  it("suggests beginner entries first, then entries whose prerequisites are practised", () => {
    const start = readyNext(ENTRY_FACTS, progress([]), 100);
    expect(start.length).toBeGreaterThan(0);
    expect(start.every((f) => f.difficulty === "beginner" || f.requires.length === 0)).toBe(true);
    expect(start.every((f) => f.requires.length === 0)).toBe(true);
    // Practising every prerequisite of Aho–Corasick unlocks it.
    const aho = ENTRY_FACTS.find((f) => f.slug === "aho-corasick")!;
    const ids = ENTRY_FACTS.filter((f) => aho.requires.includes(f.slug)).flatMap(
      (f) => f.questionIds,
    );
    expect(slugs(readyNext(ENTRY_FACTS, progress(ids), 100))).toContain("aho-corasick");
    expect(slugs(readyNext(ENTRY_FACTS, progress([]), 100))).not.toContain("aho-corasick");
  });
});
