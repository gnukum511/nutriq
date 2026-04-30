/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- Semantic tokens (new design system) ---
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          soft: "var(--primary-soft)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        leaf: "var(--leaf)",
        tomato: {
          DEFAULT: "var(--tomato)",
          foreground: "var(--tomato-foreground)",
        },
        cream: "var(--cream)",
        bark: "var(--bark)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // --- Legacy aliases — point to new tokens so existing
        //     class strings keep rendering during the visual port. ---
        red:      "var(--tomato)",
        gold:     "var(--accent)",
        orange:   "var(--accent)",
        green:    "var(--leaf)",
        charcoal: "var(--background)",
        surface:  "var(--card)",
        surface2: "var(--secondary)",
        surface3: "var(--muted)",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
        "4xl": "calc(var(--radius) + 24px)",
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
      },
      backgroundImage: {
        hero: "var(--gradient-hero)",
        "leaf-gradient": "var(--gradient-leaf)",
        "warm-gradient": "var(--gradient-warm)",
      },
    },
  },
  plugins: [],
}
