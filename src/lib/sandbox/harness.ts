/**
 * Source text for the code sandbox (ADR-0007). User code runs in a dedicated Worker
 * started from a blob: URL inside an opaque-origin iframe, so nothing here is ever
 * passed to eval or new Function. These strings are the code that runs there; the
 * value formatter is unit-tested by evaluating the exact same text.
 */

/** Formats a value for console output, similar to browser consoles. Self-contained. */
export const FORMAT_VALUE_SOURCE = String.raw`function __fmt(value) {
  const MAX_ITEMS = 100;
  const MAX_DEPTH = 4;
  const path = new Set();
  const key = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k));
  const list = (items, total) =>
    total > MAX_ITEMS ? items.concat(["… " + (total - MAX_ITEMS) + " more"]) : items;
  function inner(v, depth) {
    if (v === null) return "null";
    switch (typeof v) {
      case "string":
        return depth === 0 ? v : JSON.stringify(v);
      case "number":
        return Object.is(v, -0) ? "-0" : String(v);
      case "bigint":
        return String(v) + "n";
      case "boolean":
      case "undefined":
        return String(v);
      case "symbol":
        return v.toString();
      case "function":
        return "[Function " + (v.name || "(anonymous)") + "]";
    }
    if (path.has(v)) return "[Circular]";
    if (v instanceof Error) return (v.name || "Error") + ": " + v.message;
    if (v instanceof Date) return isNaN(v.getTime()) ? "Invalid Date" : v.toISOString();
    if (v instanceof RegExp) return String(v);
    if (depth >= MAX_DEPTH) return Array.isArray(v) ? "[Array]" : "[Object]";
    path.add(v);
    try {
      if (Array.isArray(v)) {
        const items = [];
        for (let i = 0; i < Math.min(v.length, MAX_ITEMS); i++)
          items.push(i in v ? inner(v[i], depth + 1) : "<empty>");
        return "[" + list(items, v.length).join(", ") + "]";
      }
      if (ArrayBuffer.isView(v) && typeof v.length === "number") {
        const items = Array.from(v.subarray(0, MAX_ITEMS), (x) => inner(x, depth + 1));
        return v.constructor.name + "(" + v.length + ") [" + list(items, v.length).join(", ") + "]";
      }
      if (v instanceof Map) {
        const items = [];
        for (const [k, x] of v) {
          if (items.length === MAX_ITEMS) break;
          items.push(inner(k, depth + 1) + " => " + inner(x, depth + 1));
        }
        return "Map(" + v.size + ") {" + (items.length ? " " + list(items, v.size).join(", ") + " " : "") + "}";
      }
      if (v instanceof Set) {
        const items = [];
        for (const x of v) {
          if (items.length === MAX_ITEMS) break;
          items.push(inner(x, depth + 1));
        }
        return "Set(" + v.size + ") {" + (items.length ? " " + list(items, v.size).join(", ") + " " : "") + "}";
      }
      const keys = Object.keys(v);
      const items = keys.slice(0, MAX_ITEMS).map((k) => {
        let shown;
        try {
          shown = inner(v[k], depth + 1);
        } catch (e) {
          shown = "[Thrown]";
        }
        return key(k) + ": " + shown;
      });
      return items.length ? "{ " + list(items, keys.length).join(", ") + " }" : "{}";
    } finally {
      path.delete(v);
    }
  }
  try {
    return inner(value, 0);
  } catch (e) {
    return "[Unprintable]";
  }
}`;

/** Runs before the user's code in the worker: console capture and error reporting. */
const WORKER_PRELUDE = [
  FORMAT_VALUE_SOURCE,
  `const __send = self.postMessage.bind(self);`,
  `for (const level of ["log", "info", "warn", "error", "debug"]) {`,
  `  console[level] = (...args) => __send({ type: "log", level: level === "debug" ? "log" : level, text: args.map((a) => (typeof a === "string" ? a : __fmt(a))).join(" ") });`,
  `}`,
  `const __fail = (e) => __send({ type: "fail", message: e instanceof Error ? (e.name || "Error") + ": " + e.message : "Uncaught " + __fmt(e), stack: e instanceof Error ? String(e.stack || "") : "" });`,
  `self.addEventListener("unhandledrejection", (e) => { e.preventDefault(); __fail(e.reason); });`,
].join("\n");

/** The user's line 1 is this (1-based) line of the worker script: after the prelude and the wrapper line. */
export const USER_LINE_OFFSET = WORKER_PRELUDE.split("\n").length + 2;

/**
 * The complete worker script. The program ends when its top-level code (including
 * awaited promises) finishes; callbacks scheduled for later are not run.
 */
export function workerSource(code: string): string {
  return `${WORKER_PRELUDE}\n(async () => {\n${code}\n})().then(() => __send({ type: "done" }), __fail);\n`;
}

/**
 * Content-Security-Policy of the sandbox document, inherited by its worker: no
 * network (fetch, XHR, WebSocket, EventSource), no script URLs (importScripts),
 * no eval, and workers only from blob: URLs.
 */
export const SANDBOX_CSP =
  "default-src 'none'; script-src 'unsafe-inline'; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'";

/**
 * The sandbox document's own script. It starts one worker per document, forwards
 * console output within the limits it was given, and terminates the worker when the
 * program ends, exceeds the output limit, or the parent says stop.
 */
const IFRAME_SCRIPT = String.raw`(() => {
  "use strict";
  let worker = null;
  let finished = false;
  let lines = 0;
  let chars = 0;
  let maxLines = 0;
  let maxChars = 0;
  const send = (m) => parent.postMessage(m, "*");
  const finish = (m) => {
    if (finished) return;
    finished = true;
    if (worker) worker.terminate();
    send(Object.assign({ type: "exit" }, m));
  };
  addEventListener("message", (e) => {
    if (e.source !== parent) return;
    const m = e.data;
    if (!m || typeof m !== "object") return;
    if (m.type === "stop") return finish({ status: "stopped" });
    if (m.type !== "run" || worker || finished || typeof m.source !== "string") return;
    maxLines = Math.max(0, Number(m.maxLines) || 0);
    maxChars = Math.max(0, Number(m.maxChars) || 0);
    const url = URL.createObjectURL(new Blob([m.source], { type: "text/javascript" }));
    try {
      worker = new Worker(url);
    } catch (err) {
      return finish({ status: "unavailable", message: "The sandbox could not start a worker." });
    }
    worker.onmessage = (ev) => {
      const d = ev.data;
      if (finished || !d || typeof d !== "object") return;
      if (d.type === "log") {
        if (lines >= maxLines || chars >= maxChars) return finish({ status: "output-limit" });
        let text = typeof d.text === "string" ? d.text : "";
        const cut = chars + text.length > maxChars;
        if (cut) text = text.slice(0, maxChars - chars);
        lines += 1;
        chars += text.length;
        send({ type: "log", level: d.level, text: text });
        if (cut) finish({ status: "output-limit" });
      } else if (d.type === "done") {
        finish({ status: "ok" });
      } else if (d.type === "fail") {
        finish({ status: "error", message: String(d.message), stack: String(d.stack || "") });
      }
    };
    worker.onerror = (ev) => {
      ev.preventDefault();
      finish({ status: "error", message: String(ev.message || "Error"), line: Number(ev.lineno) || 0 });
    };
  });
  send({ type: "ready" });
})();`;

export const SANDBOX_HTML = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${SANDBOX_CSP}"></head><body><script>${IFRAME_SCRIPT}</script></body></html>`;
