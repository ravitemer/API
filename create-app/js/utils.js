import {f7} from "framework7-svelte";
import $$ from "dom7";
import * as localForage from "localforage";

import checkbox from "../components/input_checkbox.svelte";
import select from "../components/input_select.svelte";
import listinput from "../components/input_listinput.svelte";

export let stylesheet = document.createElement("style");
//================================================================================

export async function copy(text){
  await navigator.clipboard.writeText(text);
  return text
}

export async function paste(){
  return (await navigator.clipboard.readText())
}

//================================================================================
export function getDate(value) {
	let thatDate = value; //new Date(value);
	let year = thatDate.getFullYear();
	let month = thatDate.getMonth() + 1 < 10 ? `0${thatDate.getMonth() + 1}` : thatDate.getMonth() + 1;
	let date = thatDate.getDate() < 10 ? `0${thatDate.getDate()}` : thatDate.getDate();
	return `${year}-${month}-${date}`;
}
//================================================================================

export function group(array,property){
  let unique = {}   
  let group = {}
  for (let obj of array) {
			unique[obj[property]] = {};
		}
  for (let key in unique) {
			group[key] = array.filter((obj) => obj[property] == key);
		}
		return group;
}

export function groupBy(pages, property) {
		let groupedObj = {};
		let uniqueObj = {};
		for (let page of pages) {
			uniqueObj[page.properties[property].value] = {};
		}
		for (let key in uniqueObj) {
			groupedObj[key] = pages.filter((page) => page.properties[property].value == key);
		}
		return groupedObj;
	}

//================================================================================
let propsMap = {
	checkbox,
	select,
	multi_select: select,
};

export function getInput(type) {
	if (["checkbox", "select", "multi_select"].includes(type)) {
		return propsMap[type];
	} else if (["files", "people", "rollup", "formula", "created_time", "last_edited_time", "last_edited_by", "created_by", "relation"].includes(type)) {
		return undefined;
	} else {
		return listinput;
	}
}
//================================================================================


export const inputs = {
		title: {type: "text", media: "textbox"},
		rich_text: {type: "textarea", media: "text_quote"},

		url: {type: "url", media: "link"},
		phone_number: {type: "tel", media: "phone_fill"},

		multi_select: {type: "select", media: "list_dash"},
		date: {type: "datepicker", media: "calendar_today"},

		number: {type: "number", media: "number"},

		rollup: {type: "text", media: "search"},

		select: {type: "select", media: "chevron_down_square_fill"},

		files: {type: "file", media: "photo_on_rectangle"},

		people: {type: "select", media: "person_2_fill"},
		relation: {type: "select", media: "arrow_up_right"},
		checkbox: {type: "checkbox", media: "checkmark_rectangle"},
		email: {type: "email", media: "at"},
		formula: {type: "text", media: "sum"},
		undefined: {type: "textarea", media: "noicon"},
	};
//================================================================================
function generateStylesheet(customColor = "", barsStyle = "empty") {
	let styles = "";
	let customColorRgb = null;
	if (customColor) {
		const colorThemeProperties = f7.utils.colorThemeCSSProperties(customColor);
		customColorRgb = colorThemeProperties["--f7-theme-color-rgb"];
		if (Object.keys(colorThemeProperties).length) {
			styles += `

:root {
  ${Object.keys(colorThemeProperties)
		.map((key) => `${key}: ${colorThemeProperties[key]};`)
		.join("\n  ")}
}`;
		}
	}
	if (barsStyle === "fill") {
		const colorThemeRgb = (customColorRgb ? customColorRgb : $$("html").css("--f7-theme-color-rgb"))
			.trim()
			.split(",")
			.map((c) => c.trim());
		styles += `

:root,
:root.theme-dark,
:root .theme-dark {
  --f7-bars-bg-color: var(--f7-theme-color);
  --f7-bars-bg-color-rgb: var(--f7-theme-color-rgb);
  --f7-bars-translucent-opacity: 0.9;
  --f7-bars-text-color: #fff;
  --f7-bars-link-color: #fff;
  --f7-navbar-subtitle-text-color: rgba(255,255,255,0.85);
  --f7-bars-border-color: transparent;
  --f7-tabbar-link-active-color: #fff;
  --f7-tabbar-link-inactive-color: rgba(255,255,255,0.54);
  --f7-sheet-border-color: transparent;
  --f7-tabbar-link-active-border-color: #fff;
}
.appbar,
.navbar,
.toolbar,
.subnavbar,
.calendar-header,
.calendar-footer {
  --f7-touch-ripple-color: var(--f7-touch-ripple-white);
  --f7-link-highlight-color: var(--f7-link-highlight-white);
  --f7-link-touch-ripple-color: var(--f7-touch-ripple-white);
  --f7-button-text-color: #fff;
  --f7-button-pressed-bg-color: rgba(255,255,255,0.1);
}
.navbar-large-transparent {
  --f7-navbar-large-title-text-color: #000;
  --r: ${colorThemeRgb[0]};
  --g: ${colorThemeRgb[1]};
  --b: ${colorThemeRgb[2]};
  --progress: var(--f7-navbar-large-collapse-progress);
  --f7-bars-link-color: rgb(
    calc(var(--r) + (255 - var(--r)) * var(--progress)),
    calc(var(--g) + (255 - var(--g)) * var(--progress)),
    calc(var(--b) + (255 - var(--b)) * var(--progress))
  );
}
.theme-dark .navbar-large-transparent {
  --f7-navbar-large-title-text-color: #fff;
}
      `;
	}
	return styles.trim();
}
function loadStyles({layoutTheme, colorTheme, customColor, barsStyle}) {
	const htmlEl = $$("html");
	let dontAllowCustomColor = false;

	document.head.appendChild(stylesheet);

	//bars (fill or empty) and customColor
	if (customColor || barsStyle !== "empty") {
		stylesheet.innerHTML = generateStylesheet(dontAllowCustomColor ? "" : dontAllowCustomColor, barsStyle);
	}

	//color theme red or blue etc...
	if (colorTheme) {
		const currentColorClass = htmlEl[0].className.match(/color-theme-([a-z]*)/);
		if (currentColorClass) htmlEl.removeClass(currentColorClass[0]);
		htmlEl.addClass(`color-theme-${colorTheme}`);
		dontAllowCustomColor = true;
	}

	//layout dark or light
	if (layoutTheme) {
		htmlEl.removeClass("theme-dark theme-light").addClass(`theme-${layoutTheme}`);
	}
}

export async function load() {
	//get stored object
	let styles = await localForage.getItem("styles");
	/*let pass = await localForage.getItem("password");
	if (pass !== process.env["password"]){
	  throw new Error("Password doesn't match")
	}*/
	// if already opened , load styles saved by the user
	if (styles) {
		loadStyles(styles);
	} else {
		// if first time , saved default styles and save them
		styles = $${{styles}}
		loadStyles(styles);
		await localForage.setItem("styles", styles);
	}
}

