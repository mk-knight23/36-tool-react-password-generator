import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/content/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/jsonld";

/**
 * Visible breadcrumb trail plus a matching BreadcrumbList JSON-LD (STANDARDS §5).
 * The final crumb is the current page and is not a link. "Home" is prepended
 * automatically, so callers pass only the trail below the root.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, ...trail];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-muted">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1">
                {index > 0 ? (
                  <ChevronRight
                    size={14}
                    strokeWidth={1.75}
                    className="text-fg-faint"
                    aria-hidden="true"
                  />
                ) : null}
                {isLast ? (
                  <span aria-current="page" className="text-fg">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.path} className="hover:text-fg">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
