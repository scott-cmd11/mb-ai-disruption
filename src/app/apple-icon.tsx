import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS/Android home-screen icon. Navy-deep background + gold wordmark stripe.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1929",
          color: "#D97706",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Top accent stripe — matches header */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #D97706 0%, #FCD34D 50%, #D97706 100%)",
          }}
        />
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#D97706",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Manitoba
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: "#F8FAFC",
            letterSpacing: "-0.06em",
            lineHeight: 1,
          }}
        >
          AI
        </div>
      </div>
    ),
    { ...size },
  );
}
