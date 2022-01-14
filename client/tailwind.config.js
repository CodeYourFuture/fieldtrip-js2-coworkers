module.exports = {
  content: ["./build/**/*.{html,js}"],
  important: true,
  theme: {
    fontFamily: {
      heading: "Rubik",
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
          a: {
            color: "#38a169",
          },
        },
      },
    },
    extend: {
      colors: {
        cyan: "#9cdbff",
      },
      margin: {
        96: "24rem",
        128: "32rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/custom-forms"),
  ],
};
