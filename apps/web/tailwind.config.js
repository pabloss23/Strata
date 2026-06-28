/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tokens temáticos (claro/oscuro) vía variables CSS con soporte de opacidad.
        // Fondos: space.900=fondo, 800=superficie, 700=elevada, 600=elevada+
        space: {
          900: "rgb(var(--bg) / <alpha-value>)",
          800: "rgb(var(--surface) / <alpha-value>)",
          700: "rgb(var(--surface-2) / <alpha-value>)",
          600: "rgb(var(--surface-3) / <alpha-value>)",
        },
        sunken: "rgb(var(--sunken) / <alpha-value>)",
        // Texto: 100=primario, 200=secundario fuerte, 300=secundario, 500=terciario
        ink: {
          100: "rgb(var(--text-1) / <alpha-value>)",
          200: "rgb(var(--text-2b) / <alpha-value>)",
          300: "rgb(var(--text-2) / <alpha-value>)",
          500: "rgb(var(--text-3) / <alpha-value>)",
        },
        // Bordes / rejilla
        grid: "rgb(var(--border) / <alpha-value>)",
        "grid-strong": "rgb(var(--border-strong) / <alpha-value>)",
        // Marca: oro (acento temático; fill = oro brillante en ambos temas)
        gold: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hi: "rgb(var(--accent-hi) / <alpha-value>)",
          dim: "rgb(var(--accent-dim) / <alpha-value>)",
          fill: "rgb(var(--accent-fill) / <alpha-value>)",
        },
        // Estados (semánticos, temáticos)
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        // Dimensiones (datos; fijas en ambos temas)
        econ: "#E8B04B",
        polit: "#7C6FF0",
        social: "#3FBFA8",
      },
      fontFamily: {
        // Geist (premium, Vercel). Inter de respaldo.
        display: ["Geist", "Inter", "system-ui", "sans-serif"],
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }], // 11
        xs: ["0.75rem", { lineHeight: "1.1rem" }], // 12
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14
        base: ["1rem", { lineHeight: "1.5rem" }], // 16
        lg: ["1.125rem", { lineHeight: "1.5rem" }], // 18
        xl: ["1.25rem", { lineHeight: "1.6rem" }], // 20
        "2xl": ["1.5rem", { lineHeight: "1.8rem", letterSpacing: "-0.01em" }], // 24
        "3xl": ["2rem", { lineHeight: "2.2rem", letterSpacing: "-0.02em" }], // 32
        "4xl": ["2.5rem", { lineHeight: "2.6rem", letterSpacing: "-0.025em" }], // 40
      },
      letterSpacing: { label: "0.1em", brand: "0.2em" },
      borderRadius: { btn: "14px", card: "20px", input: "16px" },
      boxShadow: {
        "elev-1": "0 1px 2px rgba(0,0,0,0.4)",
        "elev-2": "0 10px 34px -12px rgba(0,0,0,0.6)",
        "elev-3": "0 24px 70px -20px rgba(0,0,0,0.65)",
        glass: "0 24px 70px -20px rgba(0,0,0,0.6)",
        gold: "0 0 0 1px rgba(229,184,91,0.25), 0 8px 30px -8px rgba(229,184,91,0.25)",
      },
      transitionTimingFunction: { smooth: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};
