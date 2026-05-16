import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaire: "#DCAE96",
        secondaire: "#B76E79",
        fond: "#F8F9FA",
        accent: "#D4AF37",
        charbon: "#2C2C2C",
        "primaire-foncee": "#C8987F",
        "fond-douce": "#FBF7F4",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        elegance: "0 4px 12px rgba(0,0,0,0.05)",
        "elegance-hover": "0 8px 24px rgba(0,0,0,0.08)",
        gold: "0 4px 14px rgba(212,175,55,0.25)",
      },
      backgroundImage: {
        marbre:
          "linear-gradient(135deg, #F8F9FA 0%, #FBF7F4 25%, #F3EEEA 50%, #FBF7F4 75%, #F8F9FA 100%)",
        "marbre-doux":
          "radial-gradient(ellipse at top left, #FBF7F4, transparent 60%), radial-gradient(ellipse at bottom right, #F3EEEA, transparent 60%), #F8F9FA",
        "gradient-or":
          "linear-gradient(135deg, #D4AF37 0%, #F4D27A 50%, #D4AF37 100%)",
        "voile-mobile":
          "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 100%)",
      },
      letterSpacing: {
        luxe: "0.18em",
      },
      transitionTimingFunction: {
        elegance: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
