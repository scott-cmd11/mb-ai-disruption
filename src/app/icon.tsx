import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Small square brand mark: gold "A" on navy-deep. Echoes the footer/header
// wordmark. Generated at build time — no static file to maintain.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1929",
          color: "#D97706",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: "Georgia, serif",
          letterSpacing: "-0.04em",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
