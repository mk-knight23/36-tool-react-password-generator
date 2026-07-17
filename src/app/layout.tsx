import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE, CREATOR } from "@/lib/site";
import { THEME_NO_FLASH_SCRIPT } from "@/lib/theme";
import { ToastProvider } from "@/components/ui/Toast";
import { Nav } from "@/components/shell/Nav";
import { Footer } from "@/components/shell/Footer";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { GtmScript } from "@/components/analytics/GtmScript";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: CREATOR.name, url: CREATOR.portfolio }],
  creator: CREATOR.name,
  publisher: CREATOR.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-bg font-sans text-fg antialiased">
        {/* Set the theme before first paint to avoid a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_NO_FLASH_SCRIPT }} />
        <ToastProvider>
          <a
            href="#main-content"
            className="sr-only left-4 top-4 z-50 rounded-md bg-accent-fill px-4 py-2 text-sm font-medium text-on-accent focus:not-sr-only focus:absolute"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <ConsentBanner />
        </ToastProvider>
        <GtmScript />
      </body>
    </html>
  );
}
