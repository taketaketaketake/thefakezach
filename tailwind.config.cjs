/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue}"],
    theme: {
      extend: {
        colors: {
          // Espresso + Amber — warm, editorial, calm
          paper: "#F4EFE7",   // cream background
          paper2: "#E9E2D6",  // warm surface / panel
          ink: "#241E18",     // warm near-black: text, borders, dark panels
          anchor: "#211C16",  // espresso for deep sections
          muted: "#6B6358",   // secondary text
          accent: {
            DEFAULT: "#B8702E", // muted amber
            dark: "#935724",    // hover
          },
        },
        fontFamily: {
          // brand-only families (applied via BrandLayout); main site sans untouched
          display: ['Archivo', 'system-ui', 'sans-serif'],
          mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        },
      },
    },
    plugins: [],
  };
