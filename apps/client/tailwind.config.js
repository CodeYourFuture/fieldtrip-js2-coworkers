const path = require("path");
module.exports = {
  content: [
    path.join(__dirname, "./src/**/*.{js,jsx,ts,tsx,md,mdx}"),
    path.join(
      __dirname,
      "../../node_modules/@djgrant/components/src/**/*.{ts,tsx}"
    ),
  ],
  important: false,
  theme: {
    fontFamily: {
      heading: "Rubik",
    },
  },
  typography: {
    default: {
      css: {
        h1: {
          fontFamily: "Rubik",
        },
        h2: {
          fontFamily: "Rubik",
        },
        h3: {
          fontFamily: "Rubik",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
