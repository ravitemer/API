<script>
	import {f7, Page, Navbar, NavTitle, Preloader, Block, Link, Subnavbar, Searchbar, List, ListItem} from "framework7-svelte";
	import {onMount} from "svelte";

	import * as localForage from "localforage";

	let data = {};
	let loading = false;
	export let pages, title;
	let searchBarValue = "";
	import {image, initialize} from "svelte-cloudinary";
	initialize({cloud_name: "aceoet"});

	async function load() {
		try {
			loading = true;
			data = {};

			loading = false;
			return data;
		} catch (err) {
			loading = false;
			f7.emit("error", err.message);
			throw new Error(err.message);
		}
	}

	async function onSearchBarChange(e) {
		//searchBarValue = e.detail.value
	}
	function onCardClick() {}

	onMount(async () => {
		try {
			load();
		} catch (err) {
			f7.emit("error", err.message);
		}
	});
</script>

<Page name={"linksDetail"} withSubnavbar>
	<Navbar backLink="Back" noHairline sliding={"false"}>
		<NavTitle>{title}</NavTitle>

		<Subnavbar>
			<Searchbar bind:value={searchBarValue} on:change={onSearchBarChange} customSearch />
		</Subnavbar>
	</Navbar>

	<!--background: url({page.cover.url}) no-repeat center bottom; background-size: cover;-->
	{#each pages as page, i (i)}
		<a
			href={page.properties.URL.value}
			style="height : 150px; background :url({page.cover.url}) no-repeat center bottom; background-size : cover;"
			class="bg-color-red block block-strong inset external"
		>
			<div class="p-4">
				<div class="flex items-center h-12 text-xl font-bold text-color-white display-block">
					{page.properties.Name.value}
				</div>
			</div>
		</a>
	{/each}
</Page>
