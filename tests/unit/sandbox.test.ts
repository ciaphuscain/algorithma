/**
 * Unit tests for the pure parts of the code sandbox. The isolation itself (opaque
 * origin, CSP, worker termination) can only be observed in a real browser and is
 * covered by tests/e2e/sandbox.spec.ts.
 */
import { describe, expect, it } from "vitest";
import {
  FORMAT_VALUE_SOURCE,
  SANDBOX_CSP,
  SANDBOX_HTML,
  USER_LINE_OFFSET,
  workerSource,
} from "@/lib/sandbox/harness";
import { parseSandboxMessage, userLine } from "@/lib/sandbox/run-code";
import { jsLiteral, starterProgram } from "@/ui/algorithm/CodeView";
import { ENTRIES } from "@/content/catalog";

// Node has no CSP, so the shipped formatter text can be evaluated directly here.
const fmt = new Function(`${FORMAT_VALUE_SOURCE}; return __fmt;`)() as (v: unknown) => string;

describe("console value formatting (the exact text that runs in the worker)", () => {
  it("formats primitives like a browser console", () => {
    expect(fmt("plain")).toBe("plain");
    expect(fmt(42)).toBe("42");
    expect(fmt(-0)).toBe("-0");
    expect(fmt(NaN)).toBe("NaN");
    expect(fmt(-Infinity)).toBe("-Infinity");
    expect(fmt(10n)).toBe("10n");
    expect(fmt(undefined)).toBe("undefined");
    expect(fmt(null)).toBe("null");
    expect(fmt(Symbol("s"))).toBe("Symbol(s)");
    expect(fmt(function named() {})).toBe("[Function named]");
  });

  it("formats nested structures, quoting strings inside them", () => {
    expect(fmt([1, "a", [true, null]])).toBe('[1, "a", [true, null]]');
    expect(fmt({ a: 1, "b c": [2] })).toBe('{ a: 1, "b c": [2] }');
    expect(fmt({})).toBe("{}");
    expect(
      fmt(
        new Map<unknown, unknown>([
          [1, "x"],
          ["k", [2]],
        ]),
      ),
    ).toBe('Map(2) { 1 => "x", "k" => [2] }');
    expect(fmt(new Set([1, 2]))).toBe("Set(2) { 1, 2 }");
    expect(fmt(new Int32Array([3, 4]))).toBe("Int32Array(2) [3, 4]");
    expect(fmt(new Error("boom"))).toBe("Error: boom");
    expect(fmt(new Date(0))).toBe("1970-01-01T00:00:00.000Z");
    // eslint-disable-next-line no-sparse-arrays
    expect(fmt([1, , 3])).toBe("[1, <empty>, 3]");
  });

  it("survives cycles, deep nesting, huge collections and hostile getters", () => {
    const cyclic: Record<string, unknown> = { name: "loop" };
    cyclic.self = cyclic;
    expect(fmt(cyclic)).toBe('{ name: "loop", self: [Circular] }');
    const shared = { x: 1 };
    expect(fmt([shared, shared])).toBe("[{ x: 1 }, { x: 1 }]");
    expect(fmt([[[[[[1]]]]]])).toBe("[[[[[Array]]]]]");
    const big = fmt(Array.from({ length: 1000 }, (_, i) => i));
    expect(big.endsWith("99, … 900 more]")).toBe(true);
    const hostile = {
      get bad() {
        throw new Error("no");
      },
      ok: 1,
    };
    expect(fmt(hostile)).toBe("{ bad: [Thrown], ok: 1 }");
    const revoked = Proxy.revocable({}, {});
    revoked.revoke();
    expect(fmt(revoked.proxy)).toBe("[Unprintable]");
  });
});

describe("worker script and line mapping", () => {
  it("places the user's first line at USER_LINE_OFFSET", () => {
    const lines = workerSource("first();\nsecond();").split("\n");
    expect(lines[USER_LINE_OFFSET - 1]).toBe("first();");
    expect(lines[USER_LINE_OFFSET]).toBe("second();");
    expect(userLine(USER_LINE_OFFSET, 2)).toBe(1);
    expect(userLine(USER_LINE_OFFSET + 1, 2)).toBe(2);
    expect(userLine(USER_LINE_OFFSET - 1, 2)).toBeNull(); // the wrapper line
    expect(userLine(USER_LINE_OFFSET + 2, 2)).toBeNull(); // the closing line
  });

  it("is valid JavaScript for valid user code, and never uses eval", () => {
    expect(() => new Function(workerSource("const x = await Promise.resolve(1);"))).not.toThrow();
    expect(FORMAT_VALUE_SOURCE + SANDBOX_HTML).not.toMatch(/\beval\(|new Function/);
  });

  it("pins the sandbox document to a no-network, no-eval policy and opaque messaging", () => {
    expect(SANDBOX_CSP).toContain("connect-src 'none'");
    expect(SANDBOX_CSP).toContain("default-src 'none'");
    expect(SANDBOX_CSP).not.toContain("unsafe-eval");
    expect(SANDBOX_HTML).toContain(`content="${SANDBOX_CSP}"`);
    expect(SANDBOX_HTML).not.toMatch(/<\/script>[\s\S]*<script/); // one script only
  });
});

describe("messages from the sandbox are treated as untrusted", () => {
  it("rejects anything that is not a known message", () => {
    for (const bad of [null, 1, "ready", [], { type: "nope" }, { type: "log", text: 5 }]) {
      expect(parseSandboxMessage(bad, 1)).toBeNull();
    }
    expect(parseSandboxMessage({ type: "exit", status: "timeout" }, 1)).toBeNull(); // parent-only
    expect(parseSandboxMessage({ type: "exit", status: "pwned" }, 1)).toBeNull();
  });

  it("coerces log levels and caps text", () => {
    expect(parseSandboxMessage({ type: "log", level: "<b>", text: "hi" }, 1)).toEqual({
      type: "log",
      line: { level: "log", text: "hi" },
    });
    const long = parseSandboxMessage({ type: "log", level: "warn", text: "x".repeat(1e6) }, 1);
    expect(long?.type === "log" && long.line.text.length).toBe(20_000);
  });

  it("maps error positions back to the user's lines", () => {
    const stack = `Error: boom\n    at blob:null/27cc88ae-6aeb-4a61-a4fd-4396297e45f8:${USER_LINE_OFFSET + 1}:7\n    at blob:null/27cc88ae:${USER_LINE_OFFSET + 3}:3`;
    expect(
      parseSandboxMessage({ type: "exit", status: "error", message: "Error: boom", stack }, 2),
    ).toEqual({ type: "exit", status: "error", error: "Error: boom (line 2)" });
    expect(
      parseSandboxMessage(
        { type: "exit", status: "error", message: "SyntaxError: x", line: USER_LINE_OFFSET },
        3,
      ),
    ).toEqual({ type: "exit", status: "error", error: "SyntaxError: x (line 1)" });
    expect(
      parseSandboxMessage({ type: "exit", status: "error", message: "late", line: 9999 }, 3),
    ).toEqual({ type: "exit", status: "error", error: "late" });
  });
});

describe("starter programs in the Code tab", () => {
  it("serialise arguments as JavaScript, including non-finite numbers", () => {
    expect(jsLiteral([1, "a", null, [Infinity, -Infinity]])).toBe(
      '[1, "a", null, [Infinity, -Infinity]]',
    );
    expect(jsLiteral({ k: NaN })).toBe('{ "k": NaN }');
  });

  it("every JavaScript reference implementation becomes a program that prints its first expected result", () => {
    for (const entry of ENTRIES) {
      for (const impl of entry.implementations.filter((i) => i.language === "javascript")) {
        const logged: unknown[] = [];
        const program = starterProgram(impl);
        new Function("console", program)({ log: (v: unknown) => logged.push(v) });
        expect(logged, `${entry.slug}: ${impl.entry}`).toEqual([impl.tests[0]!.expected]);
      }
    }
  });
});
