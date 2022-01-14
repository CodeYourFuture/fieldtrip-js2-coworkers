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
          html: {
            color: "#111",
          },
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
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/custom-forms"),
  ],
};
