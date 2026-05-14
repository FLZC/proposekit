import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm paper + charcoal ink scale — replaces default slate.
        // Editorial aesthetic: paper whites → warm charcoals.
        slate: {
          "50": "#FBF7F2",   // paper — page bg
          "100": "#F5F0E8",  // paper-warm — secondary bg
          "200": "#E5E0D8",  // border
          "300": "#D5CFC5",  // border-strong, input borders
          "400": "#A8A098",  // placeholder
          "500": "#8C8C8C",  // ink-muted
          "600": "#6B6B6B",  // medium
          "700": "#4D4D4D",  // hover state
          "800": "#3D3D3D",  // ink-soft — body text
          "900": "#1A1A1A",  // ink — headings, button bg
          "950": "#0D0D0D",  // shadows
        },
        // Terracotta accent scale — replaces default amber.
        // Warm, distinctive, not blue/purple.
        amber: {
          "50": "#FDF6F3",   // terracotta paper
          "100": "#F0DED5",  // terracotta-light — subtle bg
          "200": "#E2C5B8",
          "300": "#C4704F",  // terracotta — accent text, rings
          "400": "#C4704F",  // terracotta — buttons, primary
          "500": "#A05A3E",  // terracotta-dark — hover
          "600": "#8A4F35",
          "700": "#6F3E2A",
          "800": "#553020",
          "900": "#3C2216",
          "950": "#24120C",
        },
        // Sage green — botanical, trustworthy, for success states
        sage: {
          "50": "#F2F7F3",
          "100": "#E8F0E9",
          "200": "#C5DBC8",
          "300": "#7A9A7E",
          "400": "#6B8D6F",
          "500": "#4A7A4F",
          "600": "#3D633F",
          "700": "#2F4C31",
          "800": "#213624",
          "900": "#152418",
          "950": "#0A120C",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"DM Sans"', "Arial", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
