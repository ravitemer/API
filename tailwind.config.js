module.exports = {
	purge: {
		enabled: true, //process.env.NODE_ENV === "production",
		content: ["./src/**/*.html", "./src/**/*.svelte", "./src/**/*.css"],
		options: {
			safelist: [/data-theme$/, /bg-(.*)-([0-9][0-9][0-9])/],
		},
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {},
	plugins: [], //require('daisyui'),
};
