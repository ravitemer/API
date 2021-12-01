import {Notion, FaunaGQL} from "../api";

export let appName = "API Tester";
export let userName = "ok";
export let passWord = "pass";
export let tabs = {
	Collections: {
		icon: "rectangle_fill_on_rectangle_angled_fill",
		ptr: true,
		navbar: {
			right: ["plus"],
			Subnavbar: {
				search: true,
			},
		},
		body: {
			list: {},
		},
	},
	Settings: {
		icon: "gear",
		isTemplate: true,
	},
};
export let pages = {
	404: {
		isTemplate: true,
	},
	blogDetail: {
		isTemplate: true,
	},
	localforage: {
		isTemplate: true,
	},
};
export let modals = {};
let notionDatabases = {
	progress: "0cf23ad4-53a5-49a1-b190-863417c994bd",
	tweets: "b793d408d4294bb69ab5b7d639eb9530",
	plab: "992d73c7afdb4385a3be6d182fc3c718",
	mind: "cebe11e3af424716898f0c425fe3a9db",
	clinic: "edd8d44f4f8e4a899916fb4077b04f52",
	clinicServices: "7e4009f6084748bd92ae07969066c6b9",
	code: "9b3a2cdcea5c4798b19139dcbc5e1e7a",
	links: "eca8c64b5aaf4f5d89dbdef99ba62132",
	proto: " ",
};
let faunaDatabases = {
	test: "fnAEW9iFtfACSd11ls5y_8Ag51ZHJHkA_wi2zGPc",
};
export const notion = Object.entries(notionDatabases).reduce((obj, [key, value]) => {
	let x = new Notion();
	x.database.id = value;
	obj[key] = x;
	return obj;
}, {});

export const fauna = Object.entries(faunaDatabases).reduce((obj, [key, value]) => {
	let x = new FaunaGQL({uri: "https://graphql.fauna.com/graphql", secret: value});
	obj[key] = x;
	return obj;
}, {});
