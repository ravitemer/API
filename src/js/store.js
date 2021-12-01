import {writable, derived} from "svelte/store";
import * as localForage from "localforage";

export const debugMode = writable(false);
export const activeTab = writable("Copilot");
export const previousTab = writable("");

export const notion_code_store = writable({schema: {properties: {}}, rows: {}}, (set) => {
	localForage.getItem("$notion_code_store").then((data) => data && set(data));
});

export const notion_links_store = writable({schema: {properties: {}}, rows: {}}, (set) => {
	localForage.getItem("$notion_links_store").then((data) => data && set(data));
});

export const notion_codeRaw_store = writable({"f7-icons": []}, (set) => {
	localForage.getItem("$notion_codeRaw_store").then((data) => data && set(data));
});
