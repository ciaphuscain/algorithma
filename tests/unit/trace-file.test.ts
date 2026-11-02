import { describe, expect, it } from "vitest";
import { getModule } from "@/algorithms/registry";
import { runAlgorithm } from "@/algorithms/run";
import { validateTrace } from "@/engine/validate";
import { gzipText, readTraceBytes } from "@/lib/trace-file";

describe("trace files", () => {
  it("round-trips a compressed trace, which validates and is much smaller", async () => {
    const m = getModule("raft")!;
    const { trace } = runAlgorithm(m, m.input.presets[0]!.value);
    const json = JSON.stringify(trace, null, 1);
    const gz = await gzipText(json);
    expect(gz.length).toBeLessThan(json.length / 5);
    const read = await readTraceBytes(gz);
    expect(read).toEqual({ ok: true, text: json, compressed: true });
    if (read.ok) expect(validateTrace(JSON.parse(read.text)).ok).toBe(true);
  });

  it("reads plain JSON as before", async () => {
    const read = await readTraceBytes(new TextEncoder().encode('{"a":1}'));
    expect(read).toEqual({ ok: true, text: '{"a":1}', compressed: false });
  });

  it("stops decompressing a bomb at the limit, and rejects oversized or corrupt files", async () => {
    const bomb = await gzipText(" ".repeat(3_000_000));
    expect(bomb.length).toBeLessThan(10_000);
    const read = await readTraceBytes(bomb, { maxFileBytes: 1e6, maxTextBytes: 1_000_000 });
    expect(read.ok).toBe(false);
    if (!read.ok) expect(read.error).toMatch(/expands to more than 1 MB/);
    expect(
      (await readTraceBytes(new Uint8Array(20), { maxFileBytes: 10, maxTextBytes: 10 })).ok,
    ).toBe(false);
    const corrupt = new Uint8Array([0x1f, 0x8b, 1, 2, 3, 4, 5]);
    const bad = await readTraceBytes(corrupt);
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.error).toMatch(/could not be decompressed/);
  });
});
