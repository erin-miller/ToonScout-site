import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./styles/**/*.css",
  ],
  safelist: [
    "dark",
    "scale-up",
    "bg-blue-400",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "bg-pink-400",
    "bg-pink-500",
    "bg-pink-300",
    "bg-pink-100",
    "bg-blue-300",
    "bg-blue-200",
    "bg-blue-100",
    "border-blue-400",
    "border-blue-500",
    "border-blue-600",
    "border-blue-700",
    "border-pink-400",
    "border-pink-500",
    "border-pink-300",
    "border-pink-100",
    "border-blue-300",
    "border-blue-200",
    "border-blue-100",
    "text-blue-400",
    "text-blue-500",
    "text-blue-600",
    "text-blue-700",
    "text-pink-400",
    "text-pink-500",
    "text-pink-300",
    "text-pink-100",
    "text-blue-300",
    "text-blue-200",
    "text-blue-100",
    "bg-toon-up",
    "bg-trap",
    "bg-lure",
    "bg-sound",
    "bg-throw",
    "bg-squirt",
    "bg-drop",
    "bg-gagblue",
    "border-toon-up",
    "border-yellow-400",
    "border-lure",
    "border-sound",
    "border-throw",
    "border-squirt",
    "border-drop",
    "border-gagblue",
    "text-toon-up",
    "text-yellow-400",
    "text-lure",
    "text-sound",
    "text-throw",
    "text-squirt",
    "text-drop",
    "text-gagblue",
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-red-300",
    "bg-green-300",
    "bg-blue-300",
    "bg-yellow-300",
    "bg-orange-300",
    "bg-purple-300",
    "border-amber-500",
    "border-gray-600",
  ],
  theme: {
    extend: {
      colors: {
        "toon-up": "var(--toon-up)",
        trap: "var(--trap)",
        lure: "var(--lure)",
        sound: "var(--sound)",
        throw: "var(--throw)",
        squirt: "var(--squirt)",
        drop: "var(--drop)",
        gagblue: "var(--gagblue)",
        blue: {
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
          900: "var(--blue-900)",
        },
        pink: {
          100: "var(--pink-100)",
          200: "var(--pink-200)",
          300: "var(--pink-300)",
          400: "var(--pink-400)",
          500: "var(--pink-500)",
          600: "var(--pink-600)",
          700: "var(--pink-700)",
          800: "var(--pink-800)",
          900: "var(--pink-900)",
        },
        gray: {
          // Light Grays
          100: "#fafafa",
          200: "#f4f4f4",
          300: "#ededed",
          400: "#e0e0e0",
          500: "#c6c6c6",
          600: "#a6a6a6",
          700: "#8b8b8b",

          // Dark Grays
          800: "#686868",
          900: "#434343",
          1000: "#343434",
          1100: "#2d2d2d",
          1200: "#242424",
          1300: "#1b1b1b",
          1400: "#131313",
        },
      },
      fontFamily: {
        mickey: ["mickey", "serif"],
        minnie: ["minnie", "serif"],
        impress: ["impress", "serif"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({
      nocompatible: true,
    }),
  ],
};
export default config;
