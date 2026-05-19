/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', "PingFang SC", "Microsoft YaHei", "system-ui", "sans-serif"],
        serif: ["Georgia", "Noto Serif SC", "serif"],
        mono: ["Consolas", "ui-monospace", "monospace"],
      },
      colors: {
        cork: "#b8956a",
        corkDark: "#8f6f4a",
        paper: "#fffef8",
        ink: "#1c1410",
        inkMuted: "#4a3f35",
        thread: "#c62828",
        threadDim: "#8e1c1c",
        sticky: "#fff9c4",
        stickyPink: "#fce4ec",
        stamp: "#1565c0",
      },
      boxShadow: {
        polaroid: "2px 3px 12px rgba(28,20,16,0.35), 0 0 0 1px rgba(255,255,255,0.5) inset",
        note: "1px 2px 6px rgba(28,20,16,0.2)",
      },
    },
  },
  plugins: [],
};
