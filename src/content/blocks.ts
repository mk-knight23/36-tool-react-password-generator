/**
 * Lightweight content block model. Prose lives in plain strings (so contractions
 * and quotes read naturally without JSX entity escaping) and is rendered by
 * ContentRenderer. Inline syntax inside `text`:
 *   `code`            → inline code
 *   **bold**          → strong
 *   [label](/path)    → internal Link (href starting with "/") or external <a>
 */
export type Block =
  | { t: "h2"; text: string; id?: string }
  | { t: "h3"; text: string; id?: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "code"; code: string }
  | { t: "note"; text: string };

/** URL-safe id from heading text, for in-page anchors and skip targets. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Strips the inline markup syntax to plain text (for JSON-LD answer fields). */
export function toPlainText(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** Rough word count across a block list — powers "N min read" estimates. */
export function countWords(blocks: Block[]): number {
  let words = 0;
  for (const block of blocks) {
    if (block.t === "ul" || block.t === "ol") {
      words += block.items.join(" ").split(/\s+/).filter(Boolean).length;
    } else if (block.t === "code") {
      words += block.code.split(/\s+/).filter(Boolean).length;
    } else {
      words += block.text.split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}
