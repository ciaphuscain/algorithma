import { SANDBOX_HTML, USER_LINE_OFFSET, workerSource } from "./harness";

export type LogLevel = "log" | "info" | "warn" | "error";
export interface LogLine {
  level: LogLevel;
  text: string;
}

export type RunStatus = "ok" | "error" | "timeout" | "output-limit" | "stopped" | "unavailable";

export interface RunResult {
  status: RunStatus;
  logs: LogLine[];
  /** Error message for status "error" (with the user's line number when known). */
  error?: string;
  durationMs: number;
}

export interface RunOptions {
  /** Wall-clock limit, enforced by the parent page. */
  timeoutMs?: number;
  maxLines?: number;
  maxChars?: number;
  signal?: AbortSignal;
  onLog?: (line: LogLine) => void;
}

export const SANDBOX_LIMITS = {
  timeoutMs: 3000,
  maxTimeoutMs: 10_000,
  maxLines: 500,
  maxChars: 20_000,
  maxCodeChars: 50_000,
  /** How long the sandbox document may take to start. */
  startupMs: 5000,
  /** How long to wait for the sandbox to confirm it terminated its worker. */
  teardownMs: 1000,
} as const;

const LEVELS = new Set<LogLevel>(["log", "info", "warn", "error"]);
const STATUSES = new Set<RunStatus>(["ok", "error", "output-limit", "stopped", "unavailable"]);

export type SandboxMessage =
  | { type: "ready" }
  | { type: "log"; line: LogLine }
  | { type: "exit"; status: RunStatus; error?: string };

/** Map a line in the worker script back to the user's line, or null if outside it. */
export function userLine(workerLine: number, codeLines: number): number | null {
  const line = workerLine - USER_LINE_OFFSET + 1;
  return line >= 1 && line <= codeLines ? line : null;
}

function errorText(d: Record<string, unknown>, codeLines: number): string {
  const message = String(d.message ?? "Error").slice(0, 2000);
  let line = typeof d.line === "number" ? userLine(d.line, codeLines) : null;
  if (line === null && typeof d.stack === "string") {
    // The first frame inside the blob: script, e.g. "blob:null/…:14:9".
    const m = /blob:[^\s)]*?:(\d+):\d+/.exec(d.stack);
    if (m) line = userLine(Number(m[1]), codeLines);
  }
  return line === null ? message : `${message} (line ${line})`;
}

/**
 * Validate a message from the sandbox document. Everything about it is treated as
 * untrusted: unknown shapes are dropped, text is coerced and length-capped.
 */
export function parseSandboxMessage(data: unknown, codeLines: number): SandboxMessage | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  if (d.type === "ready") return { type: "ready" };
  if (d.type === "log") {
    if (typeof d.text !== "string") return null;
    const level = LEVELS.has(d.level as LogLevel) ? (d.level as LogLevel) : "log";
    return { type: "log", line: { level, text: d.text.slice(0, SANDBOX_LIMITS.maxChars) } };
  }
  if (d.type === "exit" && STATUSES.has(d.status as RunStatus)) {
    const status = d.status as RunStatus;
    if (status === "error") return { type: "exit", status, error: errorText(d, codeLines) };
    if (status === "unavailable")
      return { type: "exit", status, error: String(d.message ?? "").slice(0, 500) };
    return { type: "exit", status };
  }
  return null;
}

/**
 * Run the user's own JavaScript in a fresh sandbox: an `allow-scripts`-only iframe
 * (opaque origin: no access to this app's storage, cookies or DOM) whose CSP forbids
 * network access, running the code in a Worker. The iframe is removed when the run
 * ends for any reason, which also discards its worker. See ADR-0007 for what this
 * does and does not protect against.
 */
export function runInSandbox(code: string, options: RunOptions = {}): Promise<RunResult> {
  const started = performance.now();
  const elapsed = () => Math.round(performance.now() - started);
  if (code.length > SANDBOX_LIMITS.maxCodeChars) {
    return Promise.resolve({
      status: "error",
      logs: [],
      error: `The program is ${code.length} characters long; the limit is ${SANDBOX_LIMITS.maxCodeChars}.`,
      durationMs: 0,
    });
  }
  const timeoutMs = Math.min(
    options.timeoutMs ?? SANDBOX_LIMITS.timeoutMs,
    SANDBOX_LIMITS.maxTimeoutMs,
  );
  const maxLines = Math.min(options.maxLines ?? SANDBOX_LIMITS.maxLines, SANDBOX_LIMITS.maxLines);
  const maxChars = Math.min(options.maxChars ?? SANDBOX_LIMITS.maxChars, SANDBOX_LIMITS.maxChars);
  const codeLines = code.split("\n").length;

  return new Promise((resolve) => {
    const logs: LogLine[] = [];
    let chars = 0;
    let settled = false;
    let runTimer: number | undefined;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("referrerpolicy", "no-referrer");
    iframe.tabIndex = -1;
    iframe.title = "Code sandbox";
    iframe.className = "sandbox-frame";
    iframe.srcdoc = SANDBOX_HTML;

    /**
     * Removing the iframe alone does not reliably stop a worker stuck in a loop, so
     * unless the sandbox has already exited, ask it to terminate its worker and remove
     * the iframe once it confirms (or after a short fallback delay).
     */
    const teardown = (sandboxExited: boolean) => {
      const win = iframe.contentWindow;
      if (sandboxExited || !win) return iframe.remove();
      const done = () => {
        window.removeEventListener("message", onAck);
        window.clearTimeout(fallback);
        iframe.remove();
      };
      const onAck = (e: MessageEvent) => {
        if (e.source === win && (e.data as { type?: unknown } | null)?.type === "exit") done();
      };
      const fallback = window.setTimeout(done, SANDBOX_LIMITS.teardownMs);
      window.addEventListener("message", onAck);
      win.postMessage({ type: "stop" }, "*");
    };

    const finish = (status: RunStatus, error?: string, sandboxExited = false) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(startupTimer);
      window.clearTimeout(runTimer);
      window.removeEventListener("message", onMessage);
      options.signal?.removeEventListener("abort", onAbort);
      teardown(sandboxExited);
      resolve({ status, logs, ...(error ? { error } : {}), durationMs: elapsed() });
    };

    const onMessage = (event: MessageEvent) => {
      // Only the sandbox we created, and only while it still has an opaque origin.
      if (event.source !== iframe.contentWindow || event.origin !== "null") return;
      const msg = parseSandboxMessage(event.data, codeLines);
      if (!msg || settled) return;
      if (msg.type === "ready") {
        if (runTimer !== undefined) return;
        window.clearTimeout(startupTimer);
        runTimer = window.setTimeout(() => finish("timeout"), timeoutMs);
        iframe.contentWindow?.postMessage(
          { type: "run", source: workerSource(code), maxLines, maxChars },
          "*",
        );
      } else if (msg.type === "log") {
        // The sandbox enforces the limits; the parent enforces them again.
        if (logs.length >= maxLines || chars >= maxChars) return finish("output-limit");
        const line = { ...msg.line, text: msg.line.text.slice(0, maxChars - chars) };
        chars += line.text.length;
        logs.push(line);
        options.onLog?.(line);
      } else {
        finish(msg.status, msg.error, true);
      }
    };

    const onAbort = () => finish("stopped");
    const startupTimer = window.setTimeout(
      () => finish("unavailable", "The sandbox did not start."),
      SANDBOX_LIMITS.startupMs,
    );
    if (options.signal?.aborted) return finish("stopped");
    options.signal?.addEventListener("abort", onAbort);
    window.addEventListener("message", onMessage);
    document.body.appendChild(iframe);
  });
}
