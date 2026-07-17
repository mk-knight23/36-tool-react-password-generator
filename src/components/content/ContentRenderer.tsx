import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { type Block, slugifyHeading } from "@/content/blocks";

/**
 * Renders a Block[] into semantic prose inside a `.prose` scope. Text strings
 * support a tiny inline syntax (see blocks.ts): `code`, **bold**, and
 * [label](href) links (internal via next/link, external opening in a new tab).
 */
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string): ReactNode[] {
  const parts = text.split(INLINE).filter((part) => part !== "");
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/")) {
        return (
          <Link key={index} href={href}>
            {label}
          </Link>
        );
      }
      return (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function ContentRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.t) {
          case "h2":
            return (
              <h2 key={index} id={block.id ?? slugifyHeading(block.text)}>
                {renderInline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} id={block.id ?? slugifyHeading(block.text)}>
                {renderInline(block.text)}
              </h3>
            );
          case "p":
            return <p key={index}>{renderInline(block.text)}</p>;
          case "ul":
            return (
              <ul key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case "code":
            return (
              <pre key={index}>
                <code>{block.code}</code>
              </pre>
            );
          case "note":
            return (
              <blockquote key={index}>{renderInline(block.text)}</blockquote>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
