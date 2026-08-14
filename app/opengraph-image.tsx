import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Vaylo AI Dashboard — AI Resume Builder and ATS Scanner";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#090d16",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2px, transparent 0)",
          backgroundSize: "50px 50px",
          padding: "60px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />

        {/* Top Navbar Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 10 }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
              boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)",
            }}
          >
            V
          </div>
          <span style={{ fontSize: "36px", fontWeight: "900", letterSpacing: "-1px" }}>
            Vaylo<span style={{ color: "#818cf8" }}>AI</span>
          </span>
        </div>

        {/* Hero Headline & Subtext */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", zIndex: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(129, 140, 248, 0.3)",
              color: "#a5b4fc",
              fontSize: "18px",
              fontWeight: "700",
              width: "fit-content",
            }}
          >
            ✨ World's Best AI Career Copilot
          </div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "900",
              lineHeight: "1.15",
              letterSpacing: "-1.5px",
              margin: 0,
            }}
          >
            Your next career move{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #818cf8 0%, #c084fc 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              starts with AI.
            </span>
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            Build ATS-optimized resumes, practice FAANG voice interviews, and simulate real recruiter screening.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: "flex", gap: "16px", width: "100%", zIndex: 10 }}>
          <div
            style={{
              flex: 1,
              padding: "20px 24px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "3px solid #10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#34d399",
                fontWeight: "900",
                fontSize: "18px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
              }}
            >
              89
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
                ATS Score Optimizer
              </span>
              <span style={{ fontSize: "13px", color: "#64748b" }}>90%+ Match Guaranteed</span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px 24px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(129, 140, 248, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#818cf8",
                fontWeight: "900",
                fontSize: "20px",
              }}
            >
              🎙️
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
                STAR Voice Interviews
              </span>
              <span style={{ fontSize: "13px", color: "#64748b" }}>Interactive Realtime AI</span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px 24px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(168, 85, 247, 0.2)",
                border: "1px solid rgba(192, 132, 252, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c084fc",
                fontWeight: "900",
                fontSize: "20px",
              }}
            >
              👁️
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
                Recruiter Simulation
              </span>
              <span style={{ fontSize: "13px", color: "#64748b" }}>Eye-Tracking Heatmaps</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
