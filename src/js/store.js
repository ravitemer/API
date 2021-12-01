import {writable, derived} from "svelte/store";
import * as localForage from "localforage";

export const debugMode = writable(false);
export const activeTab = writable("Collections");
export const previousTab = writable("");
