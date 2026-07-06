import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#FDF9F0",
        background: "#FDF9F0",
        primary: "#835500",
        "primary-container": "#f5a623",
        "on-primary": "#ffffff",
        "on-primary-container": "#644000",
        secondary: "#006e2f",
        "secondary-container": "#91f9a2",
        "on-secondary-container": "#007432",
        "on-surface": "#1a1c1e",
        "on-background": "#1a1c1e",
        "on-surface-variant": "#524534",
        "border-subtle": "#E5E7EB",
        "sale-red": "#E02020",
        "price-green": "#1D8B42",
        "warm-gray": "#636B74",
      },
      fontFamily: {
        sans: ["var(--font-public-sans)", "Public Sans", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "title-md": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "price-display": ["20px", { lineHeight: "24px", fontWeight: "700" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        "2xl": "16px",
      },
      spacing: {
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        gutter: "24px",
        "margin-mobile": "16px",
        "section-gap": "80px",
        "container-max": "1280px",
      },
      boxShadow: {
        "elevation-1": "0px 4px 20px rgba(26, 28, 30, 0.15)",
        "elevation-2": "0px 8px 30px rgba(26, 28, 30, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
