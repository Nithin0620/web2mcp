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
      fontFamily: {
        sans: [
          'sohne-var',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        stripe: {
          primary: "#533AFD",
          "primary-focus": "#5452FB",
          "primary-bright": "#635BFF",
          "primary-pressed": "#4032C8",
          "primary-deep": "#2E2B8C",
          "primary-soft": "#D6D9FC",
          ink: "#061B31",
          heading: "#0A2540",
          "ink-secondary": "#1A2C44",
          "ink-tertiary": "#273951",
          body: "#3C4F69",
          "body-secondary": "#50617A",
          muted: "#64748D",
          slate: "#364657",
          "slate-light": "#6480B2",
          surface: "#FFFFFF",
          "surface-soft": "#F8FAFD",
          hairline: "#E5EDF5",
        },
        primary: {
          DEFAULT: "#533AFD",
          hover: "#5452FB",
          pressed: "#4032C8",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
      },
      boxShadow: {
        stripe: "0 2px 4px rgba(50, 50, 93, 0.06), 0 1px 1.5px rgba(0, 0, 0, 0.04)",
        "stripe-md": "0 4px 8px rgba(50, 50, 93, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05)",
        "stripe-lg": "0 13px 27px -5px rgba(50, 50, 93, 0.15), 0 8px 16px -8px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
