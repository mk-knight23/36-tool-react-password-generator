import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Wraps long-form content in the `.prose` typography scope (globals.css). Use
 * for docs, guides, use-cases, and legal pages so headings, links, lists, and
 * code render consistently and lines stay within 72ch.
 */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("prose", className)}>{children}</div>;
}
