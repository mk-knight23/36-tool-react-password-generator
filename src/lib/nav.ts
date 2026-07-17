/**
 * Primary navigation links, kept in a plain (non-client) module so both server
 * components (not-found, footer) and the client Nav can import the data. A data
 * export living in a "use client" file becomes a client reference when imported
 * by a server component, which is why this is separate.
 */
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
