import { ImageResponse } from "next/og";
import { highlights, profile } from "@/data/projects";

const stats = highlights.slice(0, 3).map((h) => [h.value, h.label.toLowerCase()] as const);

// Vista previa al compartir el link (LinkedIn, WhatsApp…).
// Los colores van en hex porque ImageResponse no lee variables CSS; replican los tokens de globals.css.
export const alt = `${profile.name} · ${profile.role} (${profile.focus})`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const glyphs = " .:;tX%S8@";
  const rows = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 38 }, (_, c) => {
      const d = Math.hypot((c - 19) / 19, (r - 4) / 2.2);
      return glyphs[Math.max(0, Math.min(9, Math.round((1 - d) * 10)))];
    }).join(""),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0d0d0d",
          color: "#d1c7b7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", position: "absolute", right: 40, top: 60, opacity: 0.18, fontSize: 22, fontFamily: "monospace", color: "#ff5a36" }}>
          {rows.map((r, i) => (
            <span key={i} style={{ whiteSpace: "pre" }}>{r}</span>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#a8a093", textTransform: "uppercase" }}>
          {profile.name} · {profile.location}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: -2 }}>
            {profile.role}
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, color: "#ff5a36", marginTop: 12 }}>{profile.focus}</div>
        </div>
        <div style={{ display: "flex", gap: 48, fontSize: 28, color: "#a8a093" }}>
          {stats.map(([value, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: "#d1c7b7" }}>{value}</span>
              <span>{label}</span>
            </div>
          ))}
          <span>{profile.stack}</span>
        </div>
      </div>
    ),
    size,
  );
}
