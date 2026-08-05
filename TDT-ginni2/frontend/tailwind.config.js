module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 4%)",
        foreground: "hsl(45 60% 94%)",
        card: "hsl(0 0% 7%)",
        cardForeground: "hsl(45 60% 94%)",
        primary: "hsl(45 95% 60%)",
        primaryForeground: "hsl(0 0% 6%)",
        secondary: "hsl(0 0% 12%)",
        secondaryForeground: "hsl(45 60% 94%)",
        muted: "hsl(0 0% 10%)",
        mutedForeground: "hsl(45 10% 70%)",
        accent: "hsl(45 95% 62%)",
        accentForeground: "hsl(0 0% 6%)",
        destructive: "hsl(0 70% 55%)",
        border: "hsl(45 30% 18%)",
        input: "hsl(0 0% 11%)",
        ring: "hsl(45 95% 60%)",
        gold: "hsl(45 90% 65%)",
        goldGlow: "hsl(45 100% 75%)",
        mystic: "hsl(280 70% 65%)",
        mysticDeep: "hsl(270 60% 45%)",
        rose: "hsl(340 70% 70%)",
        midnight: "hsl(0 0% 3%)",
        deepSlate: "hsl(0 0% 5%)",
        neonPurple: "hsl(280 70% 65%)",
        neonPink: "hsl(340 70% 70%)"
      },
      backgroundImage: {
        cosmic: "radial-gradient(ellipse at top, hsl(45 80% 20% / .25), transparent 60%), radial-gradient(ellipse at bottom, hsl(20 70% 18% / .2), transparent 60%), linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 5%))",
        gold: "linear-gradient(135deg, hsl(45 95% 60%), hsl(25 90% 55%))",
        bubbleUser: "linear-gradient(135deg, hsl(45 70% 35%), hsl(25 65% 30%))",
        bubbleGinni: "linear-gradient(135deg, hsl(0 0% 9%), hsl(0 0% 12%))",
        cardGrad: "linear-gradient(135deg, hsl(45 60% 18%), hsl(0 0% 8%))"
      },
      boxShadow: {
        card: "0 20px 60px -10px hsl(280 80% 30% / .5)",
        gold: "0 0 30px hsl(45 90% 65% / .4)",
        glow: "0 0 40px hsl(280 70% 65% / .35)"
      },
      animation: {
        "gx-fade-in": "gx-fade-in .4s ease-out both",
        "gx-fade-up": "gx-fade-up .5s cubic-bezier(.2,.7,.2,1) both",
        "gx-deal": "gx-deal .55s cubic-bezier(.2,.7,.2,1) both",
        "gx-glow": "gx-glow 1.8s ease-in-out infinite",
        "gx-float": "gx-float 3s ease-in-out infinite",
        "gx-spin-slow": "gx-spin-slow 14s linear infinite"
      },
      keyframes: {
        "gx-fade-in": {
          "0%": { opacity: "0" },
          "to": { opacity: "1" }
        },
        "gx-fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "to": { opacity: "1", transform: "translateY(0)" }
        },
        "gx-deal": {
          "0%": { opacity: "0", transform: "translateY(46px) scale(.7) rotate(-6deg)" },
          "to": { opacity: "1", transform: "translateY(0) scale(1) rotate(0)" }
        },
        "gx-glow": {
          "0%,to": { boxShadow: "0 0 12px #f6ce5559" },
          "50%": { boxShadow: "0 0 26px #ffd966b3" }
        },
        "gx-float": {
          "0%,to": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        "gx-spin-slow": {
          "to": { transform: "rotate(360deg)" }
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"]
      }
    },
  },
  plugins: []
};
