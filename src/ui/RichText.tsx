import katex from "katex";
import { Fragment, type ReactNode } from "react";

/**
 * Render trusted lesson text with a minimal inline syntax: $TeX$, **bold**, `code`.
 * Deliberately not Markdown: the content schema stays small and every construct is
 * covered by tests (tests/unit/content.test.ts renders all TeX through KaTeX).
 */
const TOKEN = /(\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;

export function renderTex(tex: string, displayMode = false): string {
  // trust: false and strict defaults keep KaTeX from emitting links or raw HTML.
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    trust: false,
    output: "htmlAndMathml",
  });
}

export function RichText({ text }: { text: string }): ReactNode {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          return (
            <span key={i} dangerouslySetInnerHTML={{ __html: renderTex(part.slice(1, -1)) }} />
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2)
          return <code key={i}>{part.slice(1, -1)}</code>;
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
          return <em key={i}>{part.slice(1, -1)}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function MathBlock({ tex }: { tex: string }) {
  return <div className="math-block" dangerouslySetInnerHTML={{ __html: renderTex(tex, true) }} />;
}

export function Tex({ tex }: { tex: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderTex(tex) }} />;
}
