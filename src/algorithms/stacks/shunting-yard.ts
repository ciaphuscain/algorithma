import type { AlgorithmModule, InputSpec } from "../types";
import {
  isOp,
  PREC,
  RIGHT_ASSOC,
  postfixByDescent,
  showTokens,
  tokenize,
  type Token,
} from "./expr";

export interface ShuntingOutput {
  postfix: Token[];
  /** Largest number of items on the operator stack at once. */
  maxStack: number;
}

const input: InputSpec<Token[]> = {
  fields: [
    { name: "expr", label: "Infix expression", placeholder: "e.g. 3 + 4 * 2 / (1 - 5) ^ 2 ^ 3" },
  ],
  constraints:
    "Whole numbers 0–999, + − * / ^ and parentheses, at most 19 tokens. ^ binds tightest and groups to the right; no unary minus.",
  parse(f) {
    const t = tokenize(f.expr ?? "");
    if (typeof t === "string") return { ok: false, errors: [t] };
    const check = postfixByDescent(t);
    if (typeof check === "string")
      return { ok: false, errors: [`Not a valid expression: ${check}`] };
    return { ok: true, value: t };
  },
  format: (v) => ({ expr: showTokens(v) }),
  presets: [
    {
      id: "classic",
      label: "Dijkstra's example",
      value: [3, "+", 4, "*", 2, "/", "(", 1, "-", 5, ")", "^", 2, "^", 3],
    },
    { id: "left", label: "Left to right: 8 − 3 − 2", value: [8, "-", 3, "-", 2] },
    {
      id: "parens",
      label: "Parentheses first",
      value: ["(", 1, "+", 2, ")", "*", "(", 3, "+", 4, ")"],
    },
  ],
  random(rng) {
    // A random expression: numbers joined by operators, sometimes parenthesised.
    const ops: Token[] = ["+", "-", "*", "/", "^"];
    const n = rng.int(2, 5);
    const out: Token[] = [rng.int(1, 9)];
    for (let i = 1; i < n; i++) {
      out.push(ops[rng.int(0, 4)]!, rng.int(1, 9));
    }
    if (rng.int(0, 1) && out.length >= 5) return ["(", ...out.slice(0, 3), ")", ...out.slice(3)];
    return out;
  },
};

/**
 * Dijkstra's shunting-yard algorithm: read an infix expression left to right; numbers
 * go straight to the output; operators wait on a stack until an operator of lower
 * precedence (or equal precedence, for left-associative ones) arrives, or a closing
 * parenthesis, or the end. The output is postfix (reverse Polish) notation.
 */
export const shuntingYard: AlgorithmModule<Token[], ShuntingOutput> = {
  id: "shunting-yard",
  version: 1,
  pseudocode: [
    "for each token t, left to right",
    "  number: append t to the output",
    "  (: push it",
    "  ): pop operators to the output until (; discard the (",
    "  operator: while the top is an operator that binds at least as tightly (strictly, if t is right-associative): pop it to the output",
    "    push t",
    "at the end: pop every remaining operator to the output",
  ],
  input,

  run(tokens, t) {
    const In = t.array("In", tokens, { label: "Input (infix)", display: "cells" });
    const S = t.sequence("S", "stack", { label: "Operator stack" });
    const Out = t.sequence("Out", "queue", { label: "Output (postfix)" });
    const stack: Token[] = [];
    const postfix: Token[] = [];
    let maxStack = 0;
    const emit = (x: Token, line: number, note?: string) => {
      postfix.push(x);
      Out.push(x, { line, note });
    };
    tokens.forEach((tok, i) => {
      In.read(i, { line: 1, vars: { token: String(tok) } });
      In.pointer("i", i, { line: 1 });
      if (typeof tok === "number") emit(tok, 2, `${tok} goes straight to the output.`);
      else if (tok === "(") {
        stack.push(tok);
        S.push(tok, { line: 3, note: "Push ( : it waits for its )." });
      } else if (tok === ")") {
        while (stack.at(-1) !== "(") {
          const op = stack.pop()!;
          S.pop({ line: 4 });
          emit(op, 4, `Pop ${op} to the output.`);
        }
        stack.pop();
        S.pop({ line: 4, note: "Discard the matching (." });
      } else if (isOp(tok)) {
        for (;;) {
          const top = stack.at(-1);
          if (top === undefined || !isOp(top)) break;
          t.tally("comparisons");
          const tighter = PREC[top] > PREC[tok] || (PREC[top] === PREC[tok] && !RIGHT_ASSOC[tok]);
          if (!tighter) {
            t.step({
              line: 5,
              note:
                PREC[top] === PREC[tok]
                  ? `${tok} groups to the right, so ${top} stays on the stack.`
                  : `${top} binds less tightly than ${tok}, so it stays on the stack.`,
            });
            break;
          }
          stack.pop();
          S.pop({ line: 5 });
          emit(top, 5, `${top} binds at least as tightly as ${tok}: pop it to the output.`);
        }
        stack.push(tok);
        S.push(tok, { line: 6, note: `Push ${tok}.` });
      }
      maxStack = Math.max(maxStack, stack.length);
    });
    In.pointer("i", null, { line: 7, vars: { token: null } });
    while (stack.length) {
      const op = stack.pop()!;
      S.pop({ line: 7 });
      emit(op, 7, `End of input: pop ${op} to the output.`);
    }
    const output: ShuntingOutput = { postfix, maxStack };
    t.finish(tokens, output, { line: 7, note: `Postfix: ${showTokens(postfix)}` });
    return output;
  },

  check(tokens, out) {
    const want = postfixByDescent(tokens);
    if (typeof want === "string") return `the input is invalid (${want}) but was converted`;
    return showTokens(out.postfix) === showTokens(want)
      ? null
      : `postfix ${showTokens(out.postfix)}, expected ${showTokens(want)}`;
  },

  fidelity(state, out) {
    const Out = state.structures.Out;
    if (Out?.kind !== "sequence") return "no output queue";
    return Out.items.join(" ") === showTokens(out.postfix)
      ? null
      : `the output shows ${Out.items.join(" ")}`;
  },

  describeOutput: (o) => `Postfix: ${showTokens(o.postfix)}`,
};
