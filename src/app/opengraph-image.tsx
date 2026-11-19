import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { connection } from "next/server";
import { getSettings } from "@/lib/data";

// Default social-share image (used when a page has no image of its own).
export const alt = "Adam Law Chamber";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  await connection();
  let firmName = "Adam Law Chamber";
  let tagline = "";
  let city = "";
  try {
    const s = await getSettings();
    firmName = s.firmName;
    tagline = s.tagline;
    city = s.city;
  } catch {
    // Fall back to defaults if the database is unavailable.
  }

  const logo = await readFile(path.join(process.cwd(), "public/brand/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #0c1a2e 0%, #13263f 60%, #1c3556 100%)",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", width: 90, height: 4, background: "#b8955a", marginBottom: 40 }} />
          <div style={{ fontSize: 76, lineHeight: 1.05, display: "flex" }}>{firmName}</div>
          {tagline && (
            <div style={{ fontSize: 34, marginTop: 28, color: "#e3cfa3", display: "flex", fontFamily: "sans-serif" }}>
              {tagline}
            </div>
          )}
          {city && (
            <div style={{ fontSize: 28, marginTop: 40, color: "rgba(255,255,255,0.65)", display: "flex", fontFamily: "sans-serif" }}>
              {city}
            </div>
          )}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={logoSrc} width={378} height={422} />
      </div>
    ),
    size,
  );
}
