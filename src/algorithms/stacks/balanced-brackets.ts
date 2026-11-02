import type { AlgorithmModule, InputSpec } from "../types";

export interface BracketsOutput {
  balanced: boolean;
  /** Position of the first problem: a closer with no matching opener, or the earliest opener left open. */
  errorAt: number | null;
  reason: string;
}

const PAIRS: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
const OPENERS = "([{";
const MAX = 30;

const input: InputSpec<string> = {
  fields: [{ name: "text", label: "Text with brackets", placeholder: "e.g. {[()()]}" }],
  constraints: `1–${MAX} visible characters; ( ) [ ] { } are checked and everything else is ignored.`,
  parse(f) {
    const s = (f.text ?? "").trim();
    if (s.length === 0) return { ok: false, errors: ["Enter some text"] };
    if (s.length > MAX) return { ok: false, errors: [`At most ${MAX} characters`] };
    if (!/^[\x21-\x7e]+$/.test(s))
      return { ok: false, errors: ["Use visible ASCII characters without spaces"] };
    return { ok: true, value: s };
  },
  format: (s) => ({ text: s }),
  presets: [
    { id: "classic", label: "Nested and balanced", value: "{[()()]}" },
    { id: "mismatch", label: "Wrong closer", value: "([)]" },
    { id: "open", label: "Left open", value: "((a+b)*[c-d]" },
    { id: "code", label: "Code", value: "f(a[i],{x:1})" },
  ],
  random(rng, size) {
    const n = Math.min(MAX, Math.max(2, size ?? 10));
    return Array.from({ length: n }, () => "()[]{}"[rng.int(0, 5)]).join("");
  },
};

/**
 * Checks that brackets are balanced with a stack: an opening bracket is pushed; a
 * closing bracket must match the bracket on top of the stack, which is popped. The text
 * is balanced when every closer matched and the stack is empty at the end.
 */
export const balancedBrackets: AlgorithmModule<string, BracketsOutput> = {
  id: "balanced-brackets",
  version: 1,
  pseudocode: [
    "for each character c",
    "  opening bracket: push c",
    "  closing bracket: if the stack is empty or its top does not match c: unbalanced at c",
    "    else pop",
    "balanced exactly when the stack is empty at the end",
  ],
  input,

  run(text, t) {
    const A = t.array("T", [...text], { label: "Text", display: "cells" });
    const S = t.sequence("S", "stack", { label: "Open brackets (with positions)" });
    const stack: number[] = [];
    let result: BracketsOutput | null = null;
    for (let i = 0; i < text.length && !result; i++) {
      const c = text[i]!;
      A.pointer("i", i, { line: 1 });
      if (OPENERS.includes(c)) {
        stack.push(i);
        S.push(`${c} @${i}`, { line: 2, note: `Push ${c} from position ${i}.` });
      } else if (c in PAIRS) {
        A.read(i, { line: 3 });
        const top = stack.at(-1);
        t.tally("comparisons");
        if (top === undefined || text[top] !== PAIRS[c]) {
          A.mark(i, "discarded", {
            line: 3,
            note:
              top === undefined
                ? `${c} at position ${i} has nothing to close.`
                : `${c} at position ${i} does not match ${text[top]} from position ${top}.`,
          });
          result = {
            balanced: false,
            errorAt: i,
            reason: top === undefined ? "unmatched closer" : "mismatched closer",
          };
          break;
        }
        stack.pop();
        S.pop({ line: 4, note: `${c} closes ${text[top]} from position ${top}.` });
        A.mark([top, i], "found", { line: 4 });
      }
    }
    A.pointer("i", null, { line: 5 });
    if (!result) {
      if (stack.length) {
        A.mark(stack, "discarded", { line: 5 });
        result = { balanced: false, errorAt: stack[0]!, reason: "left open" };
      } else result = { balanced: true, errorAt: null, reason: "balanced" };
    }
    t.finish(text, result, {
      line: 5,
      note: result.balanced
        ? "Every bracket was closed in order: balanced."
        : result.reason === "left open"
          ? `${stack.length} bracket${stack.length === 1 ? " is" : "s are"} still open at the end: unbalanced.`
          : "Unbalanced.",
    });
    return result;
  },

  check(text, out) {
    // Independent oracle: delete adjacent matched pairs until none remain.
    let s = [...text].filter((c) => "()[]{}".includes(c)).join("");
    for (let prev = ""; prev !== s;) {
      prev = s;
      s = s.replace(/\(\)|\[\]|\{\}/g, "");
    }
    const want = s.length === 0;
    if (out.balanced !== want) return `balanced = ${out.balanced}, expected ${want}`;
    if (!want && (out.errorAt === null || !"()[]{}".includes(text[out.errorAt]!)))
      return "the error position is not a bracket";
    return null;
  },

  fidelity(state, out) {
    const T = state.structures.T;
    if (T?.kind !== "array") return "no text array";
    if (out.balanced)
      return T.values.every((c, i) => !"()[]{}".includes(String(c)) || T.marks[i] === "found")
        ? null
        : "a bracket is not marked as matched";
    return T.marks[out.errorAt!] === "discarded" ? null : "the error position is not marked";
  },

  describeOutput: (o) =>
    o.balanced ? "Balanced" : `Unbalanced (${o.reason} at position ${o.errorAt})`,
};
