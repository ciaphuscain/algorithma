import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import {
  apply,
  evalPostfix,
  isOp,
  postfixByDescent,
  showTokens,
  tokenize,
  type Token,
} from "./expr";

export interface ExprTreeOutput {
  value: number;
  /** In-order reading of the tree, fully parenthesised. */
  infix: string;
  /** Tokens in in-order, without parentheses. */
  inorder: Token[];
  height: number;
}

const input: InputSpec<Token[]> = {
  fields: [{ name: "expr", label: "Infix expression", placeholder: "e.g. (3 + 4) * (5 - 2)" }],
  constraints:
    "Whole numbers 0–999, + − * / ^ and parentheses, at most 19 tokens; / truncates toward zero and ^ takes exponents 0–10.",
  parse(f) {
    const t = tokenize(f.expr ?? "");
    if (typeof t === "string") return { ok: false, errors: [t] };
    const post = postfixByDescent(t);
    if (typeof post === "string") return { ok: false, errors: [`Not a valid expression: ${post}`] };
    const v = evalPostfix(post);
    if (typeof v === "string") return { ok: false, errors: [`Cannot evaluate: ${v}`] };
    return { ok: true, value: t };
  },
  format: (v) => ({ expr: showTokens(v) }),
  presets: [
    {
      id: "classic",
      label: "(3 + 4) * (5 − 2)",
      value: ["(", 3, "+", 4, ")", "*", "(", 5, "-", 2, ")"],
    },
    {
      id: "precedence",
      label: "Precedence: 2 + 3 * 4 − 6 / 2",
      value: [2, "+", 3, "*", 4, "-", 6, "/", 2],
    },
    { id: "power", label: "Right-associative ^: 2 ^ 3 ^ 2", value: [2, "^", 3, "^", 2] },
  ],
  random(rng) {
    const ops: Token[] = ["+", "-", "*"];
    const n = rng.int(2, 5);
    const out: Token[] = [rng.int(1, 9)];
    for (let i = 1; i < n; i++) out.push(ops[rng.int(0, 2)]!, rng.int(1, 9));
    return rng.int(0, 1) && out.length >= 5 ? ["(", ...out.slice(0, 3), ")", ...out.slice(3)] : out;
  },
};

/**
 * Builds the expression tree of an infix expression and evaluates it. The expression
 * is first written in postfix (by recursive descent, not traced); the tree is then
 * built top-down from the end of the postfix: the last token is the root, and an
 * operator's right subtree is built before its left. A post-order walk evaluates
 * every subtree; an in-order walk reads the expression back, fully parenthesised.
 */
export const expressionTree: AlgorithmModule<Token[], ExprTreeOutput> = {
  id: "expression-tree",
  version: 1,
  pseudocode: [
    "postfix ← the expression in postfix order",
    "build(): t ← the next token from the end of postfix",
    "  node ← new node(t);  if t is an operator: node.right ← build();  node.left ← build()",
    "evaluate(node): a leaf is its number;  else evaluate(left) (op) evaluate(right)",
    "in-order: (left op right) gives the expression back",
  ],
  input,

  run(tokens, t) {
    const post = postfixByDescent(tokens) as Token[];
    const P = t.array("P", post, { label: "Postfix", display: "cells" });
    const T = t.tree("T", { binary: true, label: "Expression tree" });
    t.step({ line: 1, note: `In postfix: ${showTokens(post)}. Build from the last token.` });
    let at = post.length - 1;
    const kids = new Map<string, [string, string]>();
    const tok = new Map<string, Token>();
    const build = (
      parent: string | null,
      slot: number | undefined,
      depth: number,
    ): [string, number] => {
      const i = at--;
      const x = post[i]!;
      P.read(i, { line: 2 });
      const id = T.add(String(x), parent, slot, {
        line: 3,
        note: parent === null ? `The last token, ${x}, is the root.` : undefined,
      });
      tok.set(id, x);
      if (!isOp(x)) return [id, depth];
      const [r, hr] = build(id, 1, depth + 1);
      const [l, hl] = build(id, 0, depth + 1);
      kids.set(id, [l, r]);
      return [id, Math.max(hl, hr)];
    };
    const [root, height] = build(null, undefined, 0);
    const evaluate = (id: string): number => {
      const x = tok.get(id)!;
      if (!isOp(x)) {
        T.status(id, "visited", { line: 4 });
        return x as number;
      }
      const [l, r] = kids.get(id)!;
      const a = evaluate(l);
      const b = evaluate(r);
      const v = apply(a, x, b) as number;
      t.tally("operations");
      T.annotate(id, `= ${v}`, { line: 4, note: `${a} ${x} ${b} = ${v}.` });
      T.status(id, "visited", { line: 4 });
      return v;
    };
    const value = evaluate(root);
    T.status(root, "path", { line: 4 });
    const inorder: Token[] = [];
    const show = (id: string): string => {
      const x = tok.get(id)!;
      if (!isOp(x)) {
        inorder.push(x);
        return String(x);
      }
      const [l, r] = kids.get(id)!;
      const left = show(l);
      inorder.push(x);
      return `(${left} ${x} ${show(r)})`;
    };
    const infix = show(root);
    const output: ExprTreeOutput = { value, infix, inorder, height };
    t.finish(tokens, output, {
      line: 5,
      note: `${infix} = ${value}; the tree has height ${height}.`,
    });
    return output;
  },

  check(tokens, out) {
    // Independent checks: the value equals stack evaluation of the postfix, and the
    // tree's in-order reading equals the input without its parentheses.
    const post = postfixByDescent(tokens);
    if (typeof post === "string") return "invalid input accepted";
    const v = evalPostfix(post);
    if (out.value !== v) return `value ${out.value}, expected ${v}`;
    const bare = tokens.filter((x) => x !== "(" && x !== ")");
    if (showTokens(out.inorder) !== showTokens(bare))
      return `in-order ${showTokens(out.inorder)}, expected ${showTokens(bare)}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    const root = T.root;
    if (root === null) return "empty tree";
    return T.annotations[root] === `= ${out.value}` || T.nodes[root]!.value === String(out.value)
      ? null
      : `the root shows ${T.annotations[root]}`;
  },

  describeOutput: (o) => `${o.infix} = ${o.value}`,
};
