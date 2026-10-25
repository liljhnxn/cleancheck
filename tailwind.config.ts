import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#15171C",
        card: "#20232B",
        border: "#343741",
        accent: {
          DEFAULT: "#45C4B0",
          hover: "#38a897",
          light: "rgba(69, 196, 176, 0.15)",
        },
        mainText: "#E8E8E8",
        mutedText: "#9CA3AF",
        success: {
          DEFAULT: "#7DBE9A",
          light: "rgba(125, 190, 154, 0.15)",
        },
        error: {
          DEFAULT: "#D98282",
          light: "rgba(217, 130, 130, 0.15)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
