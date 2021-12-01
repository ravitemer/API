<script>
	import {f7, Page, Navbar, NavTitle, Preloader, Block, Link, NavTitleLarge} from "framework7-svelte";
	import {onMount} from "svelte";

	import * as localForage from "localforage";
	import {debugMode} from "../js/store";
	//import {notion} from "../js/defaults";
	//import {getDate} from "../js/utils.js";

	let data = {};
	let loading = false;

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

	onMount(async () => {
		try {
		} catch (err) {
			f7.emit("error", err.message);
		}
	});
</script>

<Page name={"test"}>
	{#await load()}
		<Block>
			<div style="display:flex;justify-content:center;">
				<Preloader size={32} />
			</div>
		</Block>
	{:then value}
		{#if $debugMode}
			value : {JSON.stringify(value, null, 2)}
		{/if}
	{:catch err}
		<p class="text-center p-8 text-xl text-red-500 font-semibold font-mono">{err}</p>
	{/await}
</Page>
