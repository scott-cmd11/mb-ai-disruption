import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Manitoba AI Disruption Explorer — How exposed is your business to AI disruption?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0B1929",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 14,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D97706",
              fontFamily: "sans-serif",
              fontWeight: 700,
            }}
          >
            Manitoba Labour Intelligence · 2026
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 300,
              fontStyle: "italic",
              color: "#F5F0E8",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              fontFamily: "sans-serif",
            }}
          >
            How exposed is your
            <br />
            <span style={{ color: "#D97706" }}>business</span> to AI
            <br />
            disruption?
          </div>
          <p
            style={{
              fontSize: 22,
              color: "#8B9DB0",
              fontFamily: "sans-serif",
              fontWeight: 400,
              margin: 0,
              maxWidth: 640,
            }}
          >
            A data-driven risk assessment for Manitoba industries
            and occupations — built on academic automation research
            and Statistics Canada labour market data.
          </p>
        </div>

        {/* Bottom: site name + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontFamily: "sans-serif",
              fontWeight: 600,
              color: "#F5F0E8",
              letterSpacing: "0.02em",
            }}
          >
            mb-ai-disruption.vercel.app
          </span>
          <span
            style={{
              fontSize: 13,
              fontFamily: "sans-serif",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#D97706",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "rgba(217, 119, 6, 0.4)",
              padding: "6px 14px",
              borderRadius: 4,
            }}
          >
            Free tool · no data collected
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
