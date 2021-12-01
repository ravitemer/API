<script>
	import {Page, BlockTitle, Block, Navbar, BlockHeader, Preloader, NavRight} from "framework7-svelte";
	import {Blogger} from "../api";
	import * as localForage from "localforage";
	//import {onMount} from "svelte";

	export let f7route;
	const {id, title} = f7route.params;
</script>

<Page name="blogDetail">
	<Navbar backLink={"Back"} large {title} />

	{#await new Blogger({}).getPost({id: id})}
		<Block>
			<div style="display:flex;justify-content:center;">
				<Preloader size={32} />
			</div>
		</Block>
	{:then { title, content, updated, author: { displayName: name } }}
		<Block strong class=" ">
			<BlockTitle medium class=" ">{title}</BlockTitle>
			<BlockHeader class=" ">{name}</BlockHeader>
			<BlockHeader class=" ">{new Date(updated).toLocaleDateString()}</BlockHeader>

			<div style="margin-top:15px;font-size:1.1rem" class=" ">
				{@html content}
			</div>
		</Block>
	{:catch err}
		<BlockTitle class=" ">{err}</BlockTitle>
	{/await}
</Page>

<style>
	div :global(img) {
		max-width: 95%;
		object-fit: scale-down;
		margin-x: auto;
	}
</style>
