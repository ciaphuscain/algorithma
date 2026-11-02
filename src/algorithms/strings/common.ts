import type { InputPreset, InputSpec } from "../types";
import { clamp } from "../inputs";

/** One lowercase string (a–z), with length limits. */
export function wordInput(options: {
  label: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
  presets: InputPreset<string>[];
  /** Letters used by random inputs; a small alphabet gives repeats worth seeing. */
  randomAlphabet?: string;
}): InputSpec<string> {
  const { minLength, maxLength } = options;
  return {
    fields: [{ name: "text", label: options.label, placeholder: options.placeholder }],
    constraints: `${minLength}–${maxLength} lowercase letters a–z.`,
    parse(fields) {
      const text = (fields.text ?? "").trim();
      const errors: string[] = [];
      if (!/^[a-z]*$/.test(text)) errors.push("Use lowercase letters a–z only");
      if (text.length < minLength)
        errors.push(`Enter at least ${minLength} letter${minLength === 1 ? "" : "s"}`);
      if (text.length > maxLength) errors.push(`${text.length} letters; the limit is ${maxLength}`);
      return errors.length ? { ok: false, errors } : { ok: true, value: text };
    },
    format: (v) => ({ text: v }),
    presets: options.presets,
    random(rng, size) {
      const n = clamp(size ?? 8, minLength, maxLength);
      const alphabet = options.randomAlphabet ?? "abc";
      return Array.from({ length: n }, () => alphabet[rng.int(0, alphabet.length - 1)]!).join("");
    },
  };
}
