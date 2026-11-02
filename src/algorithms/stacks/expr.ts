/** Tokens of arithmetic expressions: whole numbers 0–999, + − * / ^ and parentheses. */
export type Token = number | "+" | "-" | "*" | "/" | "^" | "(" | ")";
export type Op = "+" | "-" | "*" | "/" | "^";

export const OPS: readonly Op[] = ["+", "-", "*", "/", "^"];
export const isOp = (t: Token): t is Op =>
  typeof t === "string" && (OPS as readonly string[]).includes(t);
export const PREC: Record<Op, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
/** ^ groups to the right: 2^3^2 = 2^(3^2). */
export const RIGHT_ASSOC: Record<Op, boolean> = {
  "+": false,
  "-": false,
  "*": false,
  "/": false,
  "^": true,
};

export const MAX_TOKENS = 19;
const LIMIT = 1e12;

export const showTokens = (ts: Token[]) => ts.join(" ");

/** Split text into tokens; a string explains the first problem. */
export function tokenize(text: string): Token[] | string {
  const out: Token[] = [];
  const s = text.replace(/\s+/g, " ").trim();
  for (let i = 0; i < s.length;) {
    const c = s[i]!;
    if (c === " ") {
      i++;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9]/.test(s[j]!)) j++;
      const n = Number(s.slice(i, j));
      if (n > 999) return `${s.slice(i, j)} is larger than 999`;
      out.push(n);
      i = j;
      continue;
    }
    if ("+-*/^()".includes(c)) {
      out.push(c as Token);
      i++;
      continue;
    }
    return `"${c}" is not a number, operator or parenthesis`;
  }
  if (out.length === 0) return "Enter an expression";
  if (out.length > MAX_TOKENS)
    return `At most ${MAX_TOKENS} tokens (numbers, operators, parentheses)`;
  return out;
}

/**
 * Exact integer arithmetic: / truncates toward zero (as in C and Java), ^ needs an
 * exponent from 0 to 10, and results must stay within ±10^12. Errors are strings.
 */
export function apply(a: number, op: Op, b: number): number | string {
  let r: number;
  if (op === "+") r = a + b;
  else if (op === "-") r = a - b;
  else if (op === "*") r = a * b;
  else if (op === "/") {
    if (b === 0) return "division by zero";
    r = Math.trunc(a / b);
  } else {
    if (b < 0 || b > 10) return `exponent ${b} is outside 0–10`;
    r = a ** b;
  }
  if (!Number.isSafeInteger(r) || Math.abs(r) > LIMIT)
    return `the value ${a} ${op} ${b} is too large`;
  return r;
}

/**
 * Infix to postfix by recursive descent (one function per precedence level). An
 * independent route to the same answer as the shunting-yard algorithm, used as its oracle.
 */
export function postfixByDescent(tokens: Token[]): Token[] | string {
  let i = 0;
  const out: Token[] = [];
  const expr = (): string | null => {
    const e = term();
    if (e) return e;
    while (tokens[i] === "+" || tokens[i] === "-") {
      const op = tokens[i++]!;
      const f = term();
      if (f) return f;
      out.push(op);
    }
    return null;
  };
  const term = (): string | null => {
    const e = factor();
    if (e) return e;
    while (tokens[i] === "*" || tokens[i] === "/") {
      const op = tokens[i++]!;
      const f = factor();
      if (f) return f;
      out.push(op);
    }
    return null;
  };
  const factor = (): string | null => {
    const e = base();
    if (e) return e;
    if (tokens[i] === "^") {
      i++;
      const f = factor(); // right-associative
      if (f) return f;
      out.push("^");
    }
    return null;
  };
  const base = (): string | null => {
    const t = tokens[i];
    if (typeof t === "number") {
      out.push(t);
      i++;
      return null;
    }
    if (t === "(") {
      i++;
      const e = expr();
      if (e) return e;
      if (tokens[i] !== ")") return "a parenthesis is not closed";
      i++;
      return null;
    }
    return t === undefined ? "the expression ends too early" : `unexpected "${t}"`;
  };
  const err = expr();
  if (err) return err;
  if (i < tokens.length)
    return tokens[i] === ")" ? "a ) has no matching (" : `unexpected "${tokens[i]}"`;
  return out;
}

/** Evaluate postfix tokens with a stack; string on error (malformed or arithmetic). */
export function evalPostfix(tokens: Token[]): number | string {
  const st: number[] = [];
  for (const t of tokens) {
    if (typeof t === "number") st.push(t);
    else if (isOp(t)) {
      if (st.length < 2) return `"${t}" needs two operands`;
      const b = st.pop()!;
      const a = st.pop()!;
      const r = apply(a, t, b);
      if (typeof r === "string") return r;
      st.push(r);
    } else return "parentheses are not allowed in postfix";
  }
  if (st.length !== 1)
    return st.length === 0
      ? "nothing to evaluate"
      : `${st.length} values are left over: an operator is missing`;
  return st[0]!;
}
