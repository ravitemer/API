<script>
	import {f7, Page, Navbar, NavLeft, Preloader, Block, Link, Subnavbar, Searchbar, List, ListItem} from "framework7-svelte";
	import {onMount} from "svelte";

	import * as localForage from "localforage";
	import {debugMode, notion_code_store, notion_codeRaw_store} from "../js/store";
	//import {notion} from "../js/defaults";
	//import {copy} from "../js/utils.js";

	let data = {};
	$: icons = JSON.parse($notion_codeRaw_store["f7-icons"] ? ($notion_codeRaw_store["f7-icons"][0] ? $notion_codeRaw_store["f7-icons"][0].value : `["airplane"]`) : `["noicon"]`);
	let filteredIcons = [];
	let loading = false;
	$: if (icons) {
		filteredIcons = icons;
	}

	let searchBarValue = "";
	let color = "white";

	async function load() {
		try {
			loading = true;
			data = "default data";

			loading = false;
			return data;
		} catch (err) {
			loading = false;
			f7.emit("error", err.message);
			throw new Error(err.message);
		}
	}

	async function onSearchBarChange(e) {
		searchBarValue = e.target.value;
		filteredIcons = icons.filter((name) => name.includes(searchBarValue.trim().toLowerCase()));
	}

	onMount(async () => {
		try {
		} catch (err) {
			f7.emit("error", err.message);
		}
	});
</script>

<Page name={"Icons"} withSubnavbar>
	<Navbar noHairline sliding={"false"}>
		<NavLeft>
			<span class="ml-2 logo {loading ? 'animate-pulse' : ''}">Icons</span>
		</NavLeft>

		<Subnavbar>
			<Searchbar noHairline clearButton disableButton={false} onInput={onSearchBarChange} customSearch />
			<!--bind:value={searchBarValue} on:searchbarClear={() => (filteredIcons = icons)}-->
		</Subnavbar>
	</Navbar>
	<div class="grid py-8 px-4 place-items-center grid-cols-3 overflow-hidden md:grid-cols-5 gap-8">
		<!--grid py-8 place-items-center grid-cols-3 overflow-hidden md:grid-cols-5 gap-8-->
		{#each filteredIcons as icon, i (i)}
			<div class="flex justify-center items-center flex-col">
				<!--flex justify-center items-center flex-col-->
				<div
					on:click={() => {
						try {
							f7.clipboard.copy(icon).then((x) => f7.emit("success", icon));
						} catch (err) {
							f7.emit("error", err.message);
						}
					}}
					class=" "
				>
					<i class="text-color-primary f7-icons">{icon}</i>
				</div>

				<p class="text-xs break-all text-center mt-2">{icon}</p>
			</div>
		{/each}
	</div>
</Page>
