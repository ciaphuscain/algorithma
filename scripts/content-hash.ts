/**
 * Print the content hash a reviewer records after reviewing an entry:
 *
 *   npm run content:hash -- bfs dijkstra     # chosen entries
 *   npm run content:hash                     # all entries
 *
 * See docs/content-review.md for the review procedure.
 */
import { ENTRIES } from "../src/content/catalog";
import { contentHash, reviewState } from "../src/content/review";

const wanted = process.argv.slice(2);
const unknown = wanted.filter((slug) => !ENTRIES.some((e) => e.slug === slug));
if (unknown.length) {
  console.error(`Unknown entries: ${unknown.join(", ")}`);
  process.exit(1);
}
for (const entry of ENTRIES) {
  if (wanted.length && !wanted.includes(entry.slug)) continue;
  console.log(`${entry.slug}\t${contentHash(entry)}\t${reviewState(entry).kind}`);
}
