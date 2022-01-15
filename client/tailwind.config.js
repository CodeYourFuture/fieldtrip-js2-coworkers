global.tailwind = {};
require("./public/tailwind.cdn.config");

module.exports = Object.assign(tailwind.config, {
  content: ["./build/**/*.{html,js}"],
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
});
