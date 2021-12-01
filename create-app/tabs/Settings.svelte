<script context="module">
	import {stylesheet} from "../js/utils.js";
	//let stylesheet;
	let globalTheme = "light";
	let globalBarsStyle = "empty";
	let globalCustomColor = "";
	let globalCustomProperties = "";
</script>

<script>
	import {onMount} from "svelte";
	import * as localForage from "localforage";
	import {debugMode} from "../js/store";
	import * as eruda from "eruda";
	let erudaEnabled = false;
	import {f7, Navbar, Page, BlockTitle, Button, Row, Col, Block, List, ListItem, Toggle, ListInput, Checkbox} from "framework7-svelte";
	let theme = globalTheme;
	let barsStyle = globalBarsStyle;
	let customColor = globalCustomColor;
	let customProperties = globalCustomProperties;
	const colors = ["red", "blue", "teal", "deeppurple", "pink", "orange", "purple", "deeporange"]; //"gray", "black", "lime", "lightblue", "yellow", green
	let themeColor = f7.$("html").css("--f7-theme-color").trim();
	let timeout;
	async function clearCache() {
		f7.preloader.show();
		await localForage.clear();
		f7.preloader.hide();
	}
	function generateStylesheet() {
		let styles = "";
		if (customColor) {
			const colorThemeProperties = f7.utils.colorThemeCSSProperties(customColor);
			if (Object.keys(colorThemeProperties).length) {
				styles += `
/* Custom color theme */
:root {
  ${Object.keys(colorThemeProperties)
		.map((key) => `${key}: ${colorThemeProperties[key]};`)
		.join("\n  ")}
}`;
			}
		}
		if (barsStyle === "fill") {
			const colorThemeRgb = f7
				.$("html")
				.css("--f7-theme-color-rgb")
				.trim()
				.split(",")
				.map((c) => c.trim());
			styles += `
/* Invert navigation bars to fill style */
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
	let styles;

	onMount(async () => {
		/*if (!stylesheet) {
			stylesheet = document.createElement("style");
			document.head.appendChild(stylesheet);
		}*/
		styles = await localForage.getItem("styles");

		if (!styles) return;
		theme = styles.layoutTheme;
		//themeColor = styles.colorTheme;
		barsStyle = styles.barsStyle;
		customColor = styles.customColor;
	});
	async function setLayoutTheme(newTheme) {
		const htmlEl = f7.$("html");
		globalTheme = newTheme;
		htmlEl.removeClass("theme-dark theme-light").addClass(`theme-${globalTheme}`);
		theme = globalTheme;
		let styles = await localForage.getItem("styles");
		styles.layoutTheme = newTheme;
		await localForage.setItem("styles", styles);
	}

	async function setColorTheme(color) {
		const htmlEl = f7.$("html");
		const currentColorClass = htmlEl[0].className.match(/color-theme-([a-z]*)/);
		if (currentColorClass) htmlEl.removeClass(currentColorClass[0]);
		htmlEl.addClass(`color-theme-${color}`);
		// eslint-disable-next-line
		unsetCustomColor();
		themeColor = htmlEl.css(`--f7-color-${color}`).trim();
		let styles = await localForage.getItem("styles");
		styles.colorTheme = color;
		await localForage.setItem("styles", styles);
	}
	function setBarsStyle(newBarsStyle) {
		globalBarsStyle = newBarsStyle;
		barsStyle = globalBarsStyle;
		globalCustomProperties = generateStylesheet();
		stylesheet.innerHTML = globalCustomProperties;

		customProperties = globalCustomProperties;
		localForage.getItem("styles").then((styles) => {
			styles.barsStyle = newBarsStyle;
			localForage.setItem("styles", styles);
		});
	}
	async function unsetCustomColor() {
		globalCustomColor = "";
		customColor = "";
		globalCustomProperties = generateStylesheet();
		stylesheet.innerHTML = globalCustomProperties;
		customProperties = globalCustomProperties;

		let styles = await localForage.getItem("styles");
		styles.customColor = "";
		await localForage.setItem("styles", styles);
	}
	async function setCustomColor(color) {
		if (themeColor === color) return;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			globalCustomColor = color;
			customColor = globalCustomColor;
			globalCustomProperties = generateStylesheet();
			stylesheet.innerHTML = globalCustomProperties;
			customProperties = globalCustomProperties;
		}, 300);
	}
</script>

<Page name={"Settings"}>
	<Navbar large title="Settings" />
	<Block strong>
		<Row>
			<Col width="50" class="bg-color-white demo-theme-picker" onClick={() => setLayoutTheme("light")}>
				{#if theme === "light"}
					<Checkbox checked disabled />
				{/if}
			</Col>
			<Col width="50" class="bg-color-black demo-theme-picker" onClick={() => setLayoutTheme("dark")}>
				{#if theme === "dark"}
					<Checkbox checked disabled />
				{/if}
			</Col>
		</Row>
	</Block>
	<Block strong>
		<Row>
			<Col width="50" class="demo-bars-picker demo-bars-picker-empty" onClick={() => setBarsStyle("empty")}>
				<div class="demo-navbar" />
				{#if barsStyle === "empty"}
					<Checkbox checked disabled />
				{/if}
			</Col>
			<Col width="50" class="demo-bars-picker demo-bars-picker-fill" onClick={() => setBarsStyle("fill")}>
				<div class="demo-navbar" />
				{#if barsStyle === "fill"}
					<Checkbox checked disabled />
				{/if}
			</Col>
		</Row>
	</Block>

	<BlockTitle medium>Theme</BlockTitle>
	<Block strong>
		<Row>
			{#each colors as color, index}
				<Col width="33" medium="25" large="20" key={index}>
					<Button fill round small class="demo-color-picker-button" {color} onClick={() => setColorTheme(color)}>
						{color}
					</Button>
				</Col>
			{/each}

			<Col width="33" medium="25" large="20" />
			<Col width="33" medium="25" large="20" />
			<Col width="33" medium="25" large="20" />
		</Row>
	</Block>

	<BlockTitle medium>Developer's</BlockTitle>
	<List>
		<!--ListItem smartSelect smartSelectParams={{openIn: "popover"}}>
			<div style="color:gray; " slot="media" class=" ">
				<i style="font-size:18px;" class="f7-icons if-not-md"> {"search"}</i>
				<i style="font-size:18px;" class="material-icons md-only">{"search"}</i>
			</div>
			<div slot="title" class=" ">
				{"Effect"}
			</div>
			<select on:change={(e) => swiperEffect.set(e.target.value)} value={$swiperEffect}>
				{#each ["cards", "coverflow", "fade", "flip"] as option, i (i)}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</ListItem-->
		<ListItem>
			<div style="color:gray;" slot="media" class=" ">
				<i style="font-size:18px;" class="f7-icons if-not-md"> {"alt"}</i>
				<i style="font-size:18px;" class="material-icons md-only">{"alt"}</i>
			</div>
			<span>{"Debug"}</span>
			<Toggle
				onToggleChange={() => {
					//f7.params.debugger ? f7.debugger.disable() : f7.debugger.enable();
					erudaEnabled = !erudaEnabled;
					try {
						if (erudaEnabled) eruda.init();
						else eruda.destroy();
					} catch (err) {
						f7.emit("error", err.message);
					}
				}}
				checked={$debugMode}
			/>
		</ListItem>
		<ListItem href="/pages/localforage/">
			<div style="color:gray;" slot="media" class=" ">
				<i style="font-size:18px;" class="f7-icons if-not-md"> {"briefcase"}</i>
				<i style="font-size:18px;" class="material-icons md-only">{"briefcase"}</i>
			</div>
			<span>{"Local Store"}</span>
		</ListItem>
	</List>

	<div class="list">
		<ul>
			<li><div on:click={clearCache} class="list-button color-red">Clear Cache</div></li>
		</ul>
	</div>
</Page>
