/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        danger: { DEFAULT: "#EF4444", light: "#FCA5A5", dark: "#B91C1C" },
        warning: { DEFAULT: "#F59E0B", light: "#FCD34D", dark: "#B45309" },
        success: { DEFAULT: "#10B981", light: "#6EE7B7", dark: "#047857" },
        info: { DEFAULT: "#3B82F6", light: "#93C5FD", dark: "#1D4ED8" },
        surface: { DEFAULT: "#1E1E2E", light: "#2D2D3F", dark: "#111118" },
        panel: { DEFAULT: "#181825", light: "#1E1E2E" }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"]
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanLine 4s linear infinite"
      },
      keyframes: {
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        }
      }
    }
  },
  plugins: []
};
