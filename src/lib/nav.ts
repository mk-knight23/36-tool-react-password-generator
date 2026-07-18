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

export const PRIMARY_LINKS: NavLink[] = [
  { href: "/", label: "Generate" },
  { href: "/analyze", label: "Analyze" },
];

export const SECONDARY_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export const NAV_LINKS: NavLink[] = [...PRIMARY_LINKS, ...SECONDARY_LINKS];

/** Content/learning links for the footer (SEO internal linking, STANDARDS §5). */
export const RESOURCE_LINKS: NavLink[] = [
  { href: "/docs", label: "How it works" },
  { href: "/guides", label: "Guides" },
  { href: "/use-cases", label: "Use-cases" },
  { href: "/policies", label: "Policy builder" },
  { href: "/checklists", label: "Checklists" },
  { href: "/faq", label: "FAQ" },
];

/** Project/company links for the footer. */
export const COMPANY_LINKS: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/creator", label: "Creator" },
  { href: "/open-source", label: "Open source" },
  { href: "/changelog", label: "Changelog" },
  { href: "/contact", label: "Contact" },
];

/** Legal links for the footer. */
export const LEGAL_LINKS: NavLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];
