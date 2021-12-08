<script>
	import {f7, Page, Navbar, NavTitle, Preloader, Block, Link, NavRight, Subnavbar, Searchbar, List, ListItem} from "framework7-svelte";
	import {onMount} from "svelte";

	import * as localForage from "localforage";
	import {debugMode} from "../js/store";
	import {Snippet} from "../api";
	//import {getDate} from "../js/utils.js";

	let data = {};
	let loading = false;
	let snippet = new Snippet();
	let searchBarValue = "";

	async function load() {
		try {
			data = await dataFetch(true);
			return data;
		} catch (err) {
			loading = false;
			f7.emit("error", err.message);
			throw new Error(err.message);
		}
	}

	async function loadNew(done) {
		try {
			data = await dataFetch(false);
			done();
			return data;
		} catch (err) {
			done();
			loading = false;
			f7.emit("error", err.message);
			throw new Error(err.message);
		}
	}
	async function dataFetch(cache = true) {
		loading = true;
		const data = await snippet.getAll();
		loading = false;
		return data;
	}
	async function onSearchBarChange(e) {
		//searchBarValue = e.detail.value
	}

	onMount(async () => {
		try {
		} catch (err) {
			f7.emit("error", err.message);
		}
	});
</script>

<Page name={"Home"} ptr onPtrRefresh={loadNew} withSubnavbar>
	<Navbar noHairline sliding={"false"}>
		<NavTitle>Collections</NavTitle>

		<NavRight>
			<Link>
				<i style="font-size : 22px; " class="f7-icons text-sm if-not-md">plus</i>
				<i style="font-size : 22px; " class="material-icons text-sm md-only">plus </i>
			</Link>
		</NavRight>

		<Subnavbar>
			<Searchbar bind:value={searchBarValue} on:change={onSearchBarChange} customSearch />
		</Subnavbar>
	</Navbar>

	{#await load()}
		<Block>
			<div style="display:flex;justify-content:center;">
				<Preloader size={32} />
			</div>
		</Block>
	{:then value}
		value : {JSON.stringify(data, null, 2)}

		<!--List>
			{#each Object.entries(data) as [key, value], i (i)}
				<ListItem>
					{key}
				</ListItem>
			{/each}
		</List-->
	{:catch err}
		<p class="text-center p-8 text-xl text-red-500 font-semibold font-mono">{err}</p>
	{/await}
</Page>
