//const tailwindcss = require("tailwindcss");

const production = process.env.NODE_ENV === "production";

/*module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    production &&
      require("cssnano")({
        preset: "default",
      }),
  ],
};*/

module.exports = {
	plugins: [
		require("postcss-preset-env")({features: {"nesting-rules": false}}),
		require("postcss-import"),
		require("tailwindcss/nesting"),
		require("tailwindcss"),
		require("autoprefixer"),

		require("cssnano"),
	], //features: { 'nesting-rules': false }
};
