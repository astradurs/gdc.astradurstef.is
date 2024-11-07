/** @type {import('tailwindcss').Config} */
import twAnimate from "tailwindcss-animate"
import plugin from "tailwindcss/plugin"

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [
    twAnimate,
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: theme("fontSize.4xl"),
          scrollMarginTop: "5rem",
          fontWeight: "800",
          letterSpacing: "-0.025em",
          "@screen lg": {
            fontSize: theme("fontSize.5xl"),
          },
        },
        h2: {
          fontSize: theme("fontSize.3xl"),
          scrollMarginTop: "4rem",
          fontWeight: "700",
          letterSpacing: "-0.020em",
          "@screen lg": {
            fontSize: theme("fontSize.4xl"),
          },
        },
        h3: {
          fontSize: theme("fontSize.2xl"),
          scrollMarginTop: "3rem",
          fontWeight: "600",
          letterSpacing: "-0.015em",
          "@screen lg": {
            fontSize: theme("fontSize.3xl"),
          },
        },
        h4: {
          fontSize: theme("fontSize.base"),
          scrollMarginTop: "2rem",
          fontWeight: "500",
          letterSpacing: "-0.010em",
          "@screen lg": {
            fontSize: theme("fontSize.2xl"),
          },
        },
        p: {
          lineHeight: theme("lineHeight.7"),
          "&:not(:first-child)": {
            marginTop: theme("spacing.6"),
          },
        },
        span: {
          fontSize: theme("fontSize.sm"),
          fontWeight: "400",
          letterSpacing: "-0.005em",
          "@screen lg": {
            fontSize: theme("fontSize.base"),
          },
        },
      })
    }),
  ],
}
