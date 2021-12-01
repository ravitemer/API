<script>
	import {f7, Page, Navbar, NavLeft, Preloader, Block, Link, NavRight, List, ListItem, BlockTitle, NavTitleLarge} from "framework7-svelte";
	import {onMount} from "svelte";

	import * as localForage from "localforage";
	import {debugMode, notion_code_store, notion_links_store, notion_codeRaw_store} from "../js/store";
	import {notion} from "../js/defaults";
	import {image, initialize} from "svelte-cloudinary";
	initialize({cloud_name: "aceoet"});

	let data = {};
	export let f7router;
	let loading = false;
	let LinkCategories = [];

	async function load() {
		try {
			const data = await dataFetch(true);
			return data;
		} catch (err) {
			loading = false;
			f7.emit("error", err.message);
			throw new Error(err.message);
		}
	}

	async function loadNew(done) {
		try {
			const data = await dataFetch(false);
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
		const [rows, schema, linksRows, linksSchema] = await Promise.all([
			notion.code.database.getPages({cache, storeName: "$notion_code_store.rows"}),
			notion.code.database.info({cache, storeName: "$notion_code_store.schema"}),
			notion.links.database.getPages({cache, storeName: "$notion_links_store.rows"}),
			notion.links.database.info({cache, storeName: "$notion_links_store.schema"}),
		]);
		$notion_code_store.rows = rows;
		$notion_code_store.schema = schema;
		$notion_code_store = $notion_code_store;
		await extractRaw($notion_code_store, cache);
		await localForage.setItem("$notion_code_store", $notion_code_store);

		$notion_links_store.rows = linksRows;
		$notion_links_store.schema = linksSchema;
		$notion_links_store = $notion_links_store;
		await localForage.setItem("$notion_links_store", $notion_links_store);
		LinkCategories = $notion_links_store.schema.properties ? ($notion_links_store.schema.properties["Category"] ? $notion_links_store.schema.properties["Category"].value : []) : [];
		loading = false;
		data = rows;
		return data;
	}

	async function extractRaw(code, cache = true) {
		let rawPages = Object.entries(code.rows)
			.filter((x) => x[1].properties["Tags"].value.includes("Raw"))
			.map((x) => ({
				pageName: x[1].properties["Name"].value,
				pageId: x[0],
			}));
		let final = {};
		for (let {pageName, pageId} of rawPages) {
			notion.code.page.id = pageId;
			const data = await notion.code.page.info({cache, storeName: `$notion_codeRaw_store@${pageId}`});
			let codeBlocks = data.children.filter((b) => b.type === "code");
			final[pageName] = codeBlocks.map((b) => ({language: b.rawValue.language, value: b.value}));
		}
		$notion_codeRaw_store = final;
		localForage.setItem("$notion_codeRaw_store", $notion_codeRaw_store);
	}
	/*$: images = JSON.parse($notion_codeRaw_store["Images"] ? ($notion_codeRaw_store["Images"][0] ? $notion_codeRaw_store["Images"][0].value : `[]`) : `[]`);*/
	onMount(async () => {
		try {
			load();
		} catch (err) {
			f7.emit("error", err.message);
		}
	});
</script>

<Page name={"Copilot"} ptr onPtrRefresh={loadNew}>
	<Navbar noHairline sliding={"false"}>
		<NavLeft>
			<span class="ml-2 logo {loading ? 'animate-pulse' : ''}">Copilot</span>
		</NavLeft>

		<NavRight>
			<Link>
				<i style="font-size : 22px; " class="f7-icons text-sm if-not-md">plus</i>
				<i style="font-size : 22px; " class="material-icons text-sm md-only">plus </i>
			</Link>
		</NavRight>
	</Navbar>
	<BlockTitle class=" ">Links</BlockTitle>
	<div class="flex overflow-x-scroll w-full p-4 space-x-4">
		{#each LinkCategories as categoryName, i (i)}
			<div
				on:click={() =>
					f7router.navigate("/pages/linksDetail/", {
						props: {title: categoryName, pages: Object.values($notion_links_store.rows).filter((p) => p.properties["Category"].value.includes(categoryName))},
					})}
				class="flex flex-shrink-0 flex-col space-y-2 space-x-4"
			>
				<!--img class="rounded-md h-32 w-32" src={images[categoryName] ? images[categoryName].url : images["default"].url} alt={categoryName} /-->
				<img use:image={{src: `Images/${categoryName}`, bind: true}} class="rounded-md h-32 w-32" alt="background" />
				<div class="font-medium font-serif">{categoryName}</div>
			</div>
		{/each}
	</div>
	<List>
		{#each Object.entries($notion_code_store.rows) as [key, value], i (i)}
			<ListItem href="/pages/test/" title={value.properties["Name"].value} after={value.properties["Tags"].value.join(" , ")} />
		{/each}
	</List>
</Page>
