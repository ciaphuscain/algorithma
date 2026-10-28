import type { Block } from "@/content/types";
import { MathBlock, RichText } from "./RichText";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "p":
            return (
              <p key={i}>
                <RichText text={b.text} />
              </p>
            );
          case "heading":
            return (
              <h3 key={i}>
                <RichText text={b.text} />
              </h3>
            );
          case "math":
            return <MathBlock key={i} tex={b.tex} />;
          case "list": {
            const items = b.items.map((item, j) => (
              <li key={j}>
                <RichText text={item} />
              </li>
            ));
            return b.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          }
          case "callout":
            return (
              <div key={i} className={`callout callout--${b.tone}`} role="note">
                {b.title && <div className="callout__title">{b.title}</div>}
                <p>
                  <RichText text={b.text} />
                </p>
              </div>
            );
          case "code":
            return (
              <pre key={i} className="code">
                <code>{b.code}</code>
              </pre>
            );
          case "table":
            return (
              <div key={i} className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} scope="col">
                          <RichText text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>
                            <RichText text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}
