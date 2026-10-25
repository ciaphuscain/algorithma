/**
 * Trace files: plain JSON, or gzip-compressed JSON (.json.gz). Traces are repetitive
 * text, so gzip typically shrinks them several-fold. Decompression of untrusted files is
 * bounded: it stops as soon as the output passes the limit, so a small "zip bomb"
 * cannot exhaust memory.
 */

/** Largest trace file accepted, compressed or not. */
export const MAX_FILE_BYTES = 8_000_000;
/** Largest decompressed trace text accepted. */
export const MAX_TEXT_BYTES = 64_000_000;

const isGzip = (bytes: Uint8Array) => bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

export async function gzipText(text: string): Promise<Uint8Array> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Read a trace file's text, decompressing gzip; errors are learner-readable. */
export async function readTraceBytes(
  bytes: Uint8Array,
  limits: { maxFileBytes: number; maxTextBytes: number } = {
    maxFileBytes: MAX_FILE_BYTES,
    maxTextBytes: MAX_TEXT_BYTES,
  },
): Promise<{ ok: true; text: string; compressed: boolean } | { ok: false; error: string }> {
  if (bytes.length > limits.maxFileBytes)
    return {
      ok: false,
      error: `The file is ${(bytes.length / 1e6).toFixed(1)} MB; the limit is ${limits.maxFileBytes / 1e6} MB.`,
    };
  if (!isGzip(bytes)) return { ok: true, text: new TextDecoder().decode(bytes), compressed: false };
  const reader = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"))
    .getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > limits.maxTextBytes) {
        await reader.cancel();
        return {
          ok: false,
          error: `The compressed trace expands to more than ${limits.maxTextBytes / 1e6} MB; it was not loaded.`,
        };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, error: "The file looks like gzip but could not be decompressed." };
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return { ok: true, text: new TextDecoder().decode(out), compressed: true };
}
