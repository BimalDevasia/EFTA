const { Instrument_Sans } = require('next/font/google');


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(249.81deg, #8300FF -9.71%, #FB718B 61.86%, #FA6D47 105.74%)",
      },
      boxShadow: {
        button_shadow:
          "7px 8px 17.4px 0px #FFFFFF40 inset, -7px -6px 9.2px 0px #00000029 inset",
        "carousal-btn": "0px 3.2px 12px 0px rgba(0, 0, 0, 0.10)",
        "carousal-card": "2.988px 5.23px 33.618px -4.482px rgba(0, 0, 0, 0.16)",
        "white-button":
          "5.62px 6.42px 13.97px 0px #FFFFFF40 inset,-5.62px -4.82px 7.39px 0px #00000029 inset",
        carossel_shadow: "4px 4px 9px 0px #0000002B",
        enquiry_shadow: "3px 5px 23px -4px rgba(0, 0, 0, 0.15)",
      },
      textShadow: {
        "custom-light":
          "2px 3px 8px 0px #FFFFFF4D inset, -2px -2px 4px 0px #0000001A inset, 4px 4px 10px 0px #0000000F",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        italiana: ["var(--font-italiana)", "sans-serif"],
        caveat: ["var(--font-caveat)", "cursive"],
        satisfy: ["var(--font-satisfy)", "cursive"],
        instrumentsans:["var(--font-instrument-serif)","sans-serif"]
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary_color: "#F46782",
        nav_blue: "#8300FF",
        gift_blue: "#1F76BD",
        course_blue:"#297CC0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-custom-light": {
          textShadow:
            "2px 3px 8px 0px #FFFFFF4D inset, -2px -2px 4px 0px #0000001A inset, 4px 4px 10px 0px #0000000F",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
    require("tailwindcss-animate"),
  ],
};