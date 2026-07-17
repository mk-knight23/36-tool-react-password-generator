"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/generate", label: "Generate" },
  { href: "/analyze", label: "Analyze" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-[8px] supports-[not(backdrop-filter:blur(8px))]:bg-bg">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md font-semibold text-fg"
          aria-label={`${SITE.name} home`}
        >
          <KeyRound size={20} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
          <span>{SITE.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast ease-enter",
                  active
                    ? "text-accent"
                    : "text-fg-muted hover:bg-surface-sunken hover:text-fg",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-fg-muted hover:bg-surface-sunken hover:text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-border bg-surface md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium",
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-fg-muted hover:bg-surface-sunken hover:text-fg",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-border pt-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
