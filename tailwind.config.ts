import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ─── Brand blues (kunyashev/putilin palette) ─── */
        blue: {
          deep: "#0f2ccf",
          mid: "#2f5dff",
          action: "#116dff",
          light: "#acbeff",
          pale: "#e8eeff",
        },
        /* ─── Neutrals ─── */
        cream: "#f1f0ef",
        "cream-dark": "#e8e7e5",
        ink: "#151414",
        "ink-secondary": "#3d3c3b",
        "ink-muted": "#595857",
        stone: "#e0dfdf",
        "stone-dark": "#c8c7c6",
        /* ─── Legacy (kept for any remaining references) ─── */
        navy: {
          DEFAULT: "#0A1628",
          700: "#0D1A3D",
          800: "#0A1628",
          900: "#060D1A",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E8C97E",
          dark: "#A07840",
        },
        /* ─── Shadcn ─── */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Arial", ...fontFamily.sans],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      fontSize: {
        "display-xl": ["72px", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["56px", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-md": ["44px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["36px", { lineHeight: "1.15", letterSpacing: "-0.018em" }],
        "heading-lg": ["28px", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "heading-md": ["22px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading-sm": ["18px", { lineHeight: "1.4" }],
        "body-lg": ["16px", { lineHeight: "1.7" }],
        "body-md": ["14px", { lineHeight: "1.65" }],
        "body-sm": ["13px", { lineHeight: "1.6" }],
        caption: ["11px", { lineHeight: "1.5", letterSpacing: "0.02em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        DEFAULT: "2px",
        "sm": "2px",
        "md": "4px",
        "lg": "6px",
        "xl": "8px",
        "2xl": "12px",
        "full": "9999px",
      },
      boxShadow: {
        "legal-sm": "0 1px 4px rgba(0,0,0,0.10)",
        "legal-md": "0 4px 16px rgba(0,0,0,0.12)",
        "legal-lg": "0 8px 32px rgba(0,0,0,0.16)",
        "legal-blue": "0 4px 20px rgba(15,44,207,0.2)",
      },
      transitionTimingFunction: {
        "snappy": "cubic-bezier(0.83, 0, 0.17, 1)",
        "smooth-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "marquee": "marquee 32s linear infinite",
        "pulse-blue": "pulseBlue 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseBlue: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(17,109,255,0.3)" },
          "50%": { boxShadow: "0 0 0 8px rgba(17,109,255,0)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#151414",
            a: { color: "#116dff", textDecoration: "underline" },
            strong: { color: "#151414" },
            h1: { color: "#151414" },
            h2: { color: "#151414" },
            h3: { color: "#0f2ccf" },
            code: { color: "#0f2ccf", backgroundColor: "#e8eeff", padding: "2px 6px", borderRadius: "2px" },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};

export default config;
