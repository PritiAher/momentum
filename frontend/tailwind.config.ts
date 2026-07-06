import type { Config } from "tailwindcss";

/**
 * Momentum design tokens.
 * Direction: a focused engineering-console feel (closer to a terminal/IDE
 * than a marketing SaaS page) since this is a daily-use tool, not a sales
 * surface.
 *
 * base/ink/accent are backed by CSS variables (see src/styles/index.css)
 * rather than static hex, because Settings (Module 8) needs both a real
 * light/dark toggle and swappable accent colors — baking hex into Tailwind's
 * config would mean neither could change without a rebuild. success/warning/
 * danger/difficulty stay static: they're semantic signals (revision due,
 * streak, error) that should mean the same thing regardless of theme or
 * accent choice, not something a color picker should be able to touch.
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "rgb(var(--color-base) / <alpha-value>)",
          surface: "rgb(var(--color-base-surface) / <alpha-value>)",
          "surface-raised": "rgb(var(--color-base-surface-raised) / <alpha-value>)",
          border: "rgb(var(--color-base-border) / <alpha-value>)",
          "border-subtle": "rgb(var(--color-base-border-subtle) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          muted: "rgb(var(--color-ink-muted) / <alpha-value>)",
          faint: "rgb(var(--color-ink-faint) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",
          muted: "rgb(var(--color-accent) / 0.1)",
        },
        success: {
          DEFAULT: "#34D399",
          muted: "#34D3991A",
        },
        warning: {
          DEFAULT: "#F5A623",
          muted: "#F5A6231A",
        },
        danger: {
          DEFAULT: "#F87171",
          muted: "#F871711A",
        },
        difficulty: {
          easy: "#34D399",
          medium: "#F5A623",
          hard: "#F87171",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        glow: "0 0 0 1px rgba(124,111,240,0.4), 0 0 24px rgba(124,111,240,0.15)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
