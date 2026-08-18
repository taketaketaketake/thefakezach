/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue}"],
    theme: {
      extend: {
        colors: {
          // Swiss grid — pure white/black, one signal color
          paper: "#FFFFFF",   // page background
          paper2: "#FAFAFA",  // panel / hover surface
          ink: "#000000",     // text, hairlines, dark panels
          anchor: "#000000",  // deep sections
          muted: "#6B6B6B",   // secondary text
          hair: "#D9D9D9",    // hairline rules (lighter than ink borders)
          accent: {
            DEFAULT: "#0000EE", // electric blue
            dark: "#0000B8",    // hover
          },
        },
        fontFamily: {
          // brand-only families (applied via BrandLayout); main site sans untouched
          display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          mono: ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
