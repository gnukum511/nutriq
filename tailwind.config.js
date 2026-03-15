/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        red: "#D91429",
        gold: "#C99400",
        orange: "#E8581F",
        green: "#1BA34D",
        charcoal: "#FAFAF8",
        surface: "#FFFFFF",
        surface2: "#F5F4F1",
        surface3: "#ECEAE6",
        cream: "#1A1A1A",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
}
