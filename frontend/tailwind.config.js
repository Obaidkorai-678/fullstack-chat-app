import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "dim",
      "night",
      "business",
      "black",
      "coffee",
      "nord",
      "sunset",
      "emerald",
    ],
  },
};