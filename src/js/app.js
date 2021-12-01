// Import Framework7
import Framework7 from "framework7/lite-bundle";

// Import Framework7-Svelte Plugin
import Framework7Svelte from "framework7-svelte";

// Import Framework7 Styles
import "framework7/framework7-bundle.css";
//import "swiper/css";
//import "swiper/css/effect-cards";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/tailwind.css";

// Import App Component

import App from "../components/app.svelte";
import * as localForage from "localforage";
import {userName, passWord} from "./defaults";

import {debugPlugin, AudioPlugin, customEvents, screen, upscroller, ClipboardPlugin, ContactsPlugin, GeolocationPlugin, OrientationPlugin, SharePlugin, SpeechSynthesisPlugin} from "../plugins";

// Init F7 Svelte Plugin
Framework7.use(Framework7Svelte);

try {
	Framework7.use(customEvents);
	Framework7.use(debugPlugin);

	Framework7.use(screen);

	Framework7.use([ClipboardPlugin, OrientationPlugin, ContactsPlugin, GeolocationPlugin, SharePlugin, AudioPlugin, SpeechSynthesisPlugin]);
} catch (err) {
	console.log(err.message);
}
var app;
import {load} from "./utils.js";
load().then(async () => {
	if (Framework7.Screen) {
		let USERNAME = await localForage.getItem("VITE_USERNAME");
		let PASSWORD = await localForage.getItem("VITE_PASSWORD");
		if (USERNAME !== userName || PASSWORD !== passWord) {
			let screen = new Framework7.Screen();
			screen.open();
		}
	}
	app = new App({
		target: document.getElementById("app"),
	});
	window.app = app;
	window.F7Class = Framework7;
});
