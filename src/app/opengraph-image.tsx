import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/**
 * Static OpenGraph/Twitter card image, generated at build time by next/og. No
 * external service or font is fetched (CSP-clean). Next applies this file to
 * every route automatically, so pages do not set their own `images`.
 */
export const alt = "MK VaultPass — local password & secret generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B1220",
          padding: "72px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#4ADE80",
            fontSize: "26px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              border: "2px solid #4ADE80",
              borderRadius: "6px",
              padding: "6px 16px",
            }}
          >
            Local only
          </div>
          <span>vaultpass.mkazi.live</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              color: "#E6EBF2",
              fontSize: "84px",
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: "1000px",
            }}
          >
            Passwords and secrets that never leave your device.
          </div>
          <div style={{ display: "flex", color: "#94A3B8", fontSize: "34px" }}>
            {SITE.name} — generated locally with Web Crypto. Not a password manager.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#38BDF8",
            fontSize: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "20px",
              height: "20px",
              borderRadius: "9999px",
              background: "#38BDF8",
            }}
          />
          Built by Kazi Musharraf · Open source
        </div>
      </div>
    ),
    { ...size },
  );
}
