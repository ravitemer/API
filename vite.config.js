import path from "path";
import {svelte} from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

const SRC_DIR = path.resolve(__dirname, "./src");
const PUBLIC_DIR = path.resolve(__dirname, "./public");
const BUILD_DIR = path.resolve(__dirname, "./www");

export default {
	plugins: [
		svelte({
			preprocess: [sveltePreprocess({postcss: true})],
		}),
	],
	root: SRC_DIR,
	base: "",
	publicDir: PUBLIC_DIR,
	build: {
		outDir: BUILD_DIR,
		assetsInlineLimit: 0,
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			"@": SRC_DIR,
		},
	},
};
