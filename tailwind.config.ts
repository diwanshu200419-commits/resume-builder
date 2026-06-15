import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#111118",
        "surface-elevated": "#1A1A24",
        border: "#2A2A3A",
        "border-active": "#3D3D55",
        accent: {
          DEFAULT: "#6C63FF",
          hover: "#7C74FF",
          glow: "rgba(108, 99, 255, 0.15)",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        "text-primary": "#F1F0FF",
        "text-secondary": "#9B9BB4",
        "text-muted": "#5A5A72",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(108, 99, 255, 0.1)",
        "glow-lg": "0 0 60px rgba(108, 99, 255, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "count-up": "countUp 1.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
