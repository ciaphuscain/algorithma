import type { AlgorithmModule, InputSpec } from "../types";
import { apply, isOp, MAX_TOKENS, showTokens, tokenize, type Op, type Token } from "./expr";

export interface RpnInput {
  tokens: Token[];
  notation: "postfix" | "prefix";
}

export interface RpnOutput {
  value: number;
  /** Largest number of operands on the stack at once. */
  maxStack: number;
}

/**
 * Independent evaluation by recursion, not by an explicit stack: a postfix expression
 * is read from its last token (an operator applies to the two expressions before it),
 * a prefix expression from its first.
 */
export function evalRecursive(tokens: Token[], notation: "postfix" | "prefix"): number | string {
  const seq = notation === "postfix" ? [...tokens].reverse() : tokens;
  let i = 0;
  const go = (): number | string => {
    const t = seq[i++];
    if (t === undefined) return "an operator is missing an operand";
    if (typeof t === "number") return t;
    if (!isOp(t)) return "parentheses are not allowed";
    const first = go();
    if (typeof first === "string") return first;
    const second = go();
    if (typeof second === "string") return second;
    // Reading postfix backwards meets the right operand first.
    return notation === "postfix" ? apply(second, t, first) : apply(first, t, second);
  };
  const v = go();
  if (typeof v === "string") return v;
  if (i < seq.length) return "values are left over: an operator is missing";
  return v;
}

const input: InputSpec<RpnInput> = {
  fields: [
    {
      name: "tokens",
      label: "Expression (tokens separated by spaces)",
      placeholder: "e.g. 5 1 2 + 4 * + 3 -",
    },
    { name: "notation", label: "Notation (postfix or prefix)", placeholder: "postfix" },
  ],
  constraints: `Whole numbers 0–999 and the operators + − * / ^ (/ truncates toward zero; ^ takes exponents 0–10), at most ${MAX_TOKENS} tokens, no parentheses.`,
  parse(f) {
    const notation = ((f.notation ?? "").trim().toLowerCase() || "postfix") as RpnInput["notation"];
    if (notation !== "postfix" && notation !== "prefix")
      return { ok: false, errors: ['Notation must be "postfix" or "prefix"'] };
    const t = tokenize(f.tokens ?? "");
    if (typeof t === "string") return { ok: false, errors: [t] };
    const v = evalRecursive(t, notation);
    if (typeof v === "string") return { ok: false, errors: [`Cannot evaluate: ${v}`] };
    return { ok: true, value: { tokens: t, notation } };
  },
  format: (v) => ({ tokens: showTokens(v.tokens), notation: v.notation }),
  presets: [
    {
      id: "classic",
      label: "Postfix: 5 1 2 + 4 * + 3 −",
      value: { tokens: [5, 1, 2, "+", 4, "*", "+", 3, "-"], notation: "postfix" },
    },
    {
      id: "prefix",
      label: "Prefix: − + 5 * + 1 2 4 3",
      value: { tokens: ["-", "+", 5, "*", "+", 1, 2, 4, 3], notation: "prefix" },
    },
    {
      id: "power",
      label: "Postfix with powers: 2 3 2 ^ ^",
      value: { tokens: [2, 3, 2, "^", "^"], notation: "postfix" },
    },
  ],
  random(rng) {
    // Build a random expression tree, then write it in the chosen notation.
    const ops: Op[] = ["+", "-", "*"];
    const make = (d: number): Token[] => {
      if (d === 0 || rng.int(0, 2) === 0) return [rng.int(1, 9)];
      const op = ops[rng.int(0, 2)]!;
      return [...make(d - 1), ...make(d - 1), op];
    };
    const post = make(3);
    const notation = rng.int(0, 1) ? "postfix" : "prefix";
    if (notation === "postfix") return { tokens: post, notation };
    // Convert postfix to prefix through a tree.
    type N = { t: Token; l?: N; r?: N };
    const st: N[] = [];
    for (const t of post) {
      if (typeof t === "number") st.push({ t });
      else {
        const r = st.pop()!;
        const l = st.pop()!;
        st.push({ t, l, r });
      }
    }
    const pre = (n: N): Token[] => (n.l ? [n.t, ...pre(n.l), ...pre(n.r!)] : [n.t]);
    return { tokens: pre(st[0]!), notation };
  },
};

/**
 * Evaluates postfix (reverse Polish) or prefix (Polish) notation with one stack of
 * operands: numbers are pushed; an operator pops two operands, applies itself and
 * pushes the result. Postfix is read left to right; prefix right to left, which pops
 * the operands in the opposite order.
 */
export const rpnEval: AlgorithmModule<RpnInput, RpnOutput> = {
  id: "postfix-evaluation",
  version: 1,
  pseudocode: [
    "read the tokens left to right (postfix) or right to left (prefix)",
    "  number: push it",
    "  operator: pop two operands (postfix: right then left; prefix: left then right)",
    "    push left (operator) right",
    "the single value left on the stack is the result",
  ],
  input,

  run(input, t) {
    const { tokens, notation } = input;
    const In = t.array("In", tokens, { label: `Input (${notation})`, display: "cells" });
    const S = t.sequence("S", "stack", { label: "Operand stack" });
    const st: number[] = [];
    let maxStack = 0;
    const order =
      notation === "postfix"
        ? tokens.map((_, i) => i)
        : tokens.map((_, i) => tokens.length - 1 - i);
    for (const i of order) {
      const tok = tokens[i]!;
      In.read(i, { line: 1, vars: { token: String(tok) } });
      In.pointer("i", i, { line: 1 });
      if (typeof tok === "number") {
        st.push(tok);
        S.push(tok, { line: 2, note: `Push ${tok}.` });
      } else if (isOp(tok)) {
        const x = st.pop()!;
        S.pop({ line: 3 });
        const y = st.pop()!;
        S.pop({ line: 3 });
        const [a, b] = notation === "postfix" ? [y, x] : [x, y];
        const r = apply(a, tok, b) as number;
        t.tally("operations");
        st.push(r);
        S.push(r, { line: 4, vars: { left: a, right: b }, note: `${a} ${tok} ${b} = ${r}.` });
      }
      maxStack = Math.max(maxStack, st.length);
    }
    In.pointer("i", null, { line: 5, vars: { token: null, left: null, right: null } });
    const output: RpnOutput = { value: st[0]!, maxStack };
    t.finish(input, output, { line: 5, note: `The result is ${st[0]}.` });
    return output;
  },

  check(input, out) {
    const want = evalRecursive(input.tokens, input.notation);
    if (typeof want === "string") return `the input cannot be evaluated (${want})`;
    return out.value === want ? null : `value ${out.value}, expected ${want}`;
  },

  fidelity(state, out) {
    const S = state.structures.S;
    if (S?.kind !== "sequence") return "no stack";
    return S.items.length === 1 && S.items[0] === out.value ? null : `the stack holds ${S.items}`;
  },

  describeOutput: (o) => `Value: ${o.value}`,
};
