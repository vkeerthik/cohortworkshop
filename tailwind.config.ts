import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "1.5rem" },
    extend: {
      colors: {
        canvas: "#F7F6F2",        // warm off-white
        surface: "#FFFFFF",
        border: "#E6E4DD",
        ink: {
          DEFAULT: "#1A2330",     // deep slate
          muted: "#5B6472",
          subtle: "#8A9099",
        },
        primary: {
          DEFAULT: "#2B6E6A",     // muted teal
          hover: "#235956",
          soft: "#E4EFEE",
        },
        accent: {
          ochre: "#B58A3D",
          rose: "#A65B5B",
          sage: "#7C8F6E",
        },
        status: {
          success: "#3F7A4E",
          warn: "#B5803A",
          error: "#A14545",
          info: "#3A6A8A",
        },
      },
      fontFamily: {
        sans: ['"Inter Tight"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        "display": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 30, 40, 0.04), 0 0 0 1px rgba(20, 30, 40, 0.04)",
        pop: "0 8px 24px -8px rgba(20, 30, 40, 0.12), 0 0 0 1px rgba(20, 30, 40, 0.06)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 240ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
