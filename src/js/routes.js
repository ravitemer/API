import {tabs, pages, modals} from "./defaults";
import Home from "../tabs/Home.svelte";
import NotFoundPage from "../pages/404.svelte";
let tabRoutes = Object.entries(tabs)
	.slice(1)
	.map(([key, {routeParams = []}]) => ({
		name: key,
		path: "/" + key + "/" + routeParams.map((param) => ":" + param).join("/"),
		async({resolve}) {
			import("../tabs/" + key + ".svelte").then((module) => {
				// resolve with component
				resolve({component: module.default});
			});
		},
	}));
let pageRoutes = Object.entries(pages).map(([key, {routeParams = []}]) => ({
	name: key,
	path: "/pages/" + key + "/" + routeParams.map((param) => ":" + param).join("/"),
	async({resolve}) {
		import("../pages/" + key + ".svelte").then((module) => {
			// resolve with component
			resolve({component: module.default});
		});
	},
}));

let modalRoutes = Object.entries(modals).map(([key, {routeParams = []}]) => ({
	name: key,
	path: "/modals/" + key + "/" + routeParams.map((param) => ":" + param).join("/"),
	popup: {
		componentUrl: "../modals/" + key + ".svelte",
	},
}));

var routes = [
	...tabRoutes,
	...pageRoutes,
	...modalRoutes,
	{
		path: `/Home/${tabs["Home"].routeParams ? tabs["Home"].routeParams.map((param) => ":" + param).join("/") : ""}`,
		component: Home,
	},
	{
		path: "(.*)",
		component: NotFoundPage,
	},
];

export default routes;
