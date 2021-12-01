<script>
	import {Block, Navbar, Page, List, BlockTitle, ListItem, f7} from "framework7-svelte";
	import {onMount} from "svelte";

	import {Blogger} from "../api";

	let items = [];
	let blogger = new Blogger({});

	let showLoader = true;
	let error;

	let token;
	let cache = true;
	let allowInfinite = true;
	let showPreloader = false;
	async function load() {
		try {
			let data = await blogger.getLatestPosts({
				max: 20,
				cache: cache,
				next: token,
			});
			items = data && data.items;
			token = data && data.nextPageToken;
			showLoader = false;
			return data;
		} catch (err) {
			showLoader = false;
			f7.emit("error", err.message);
		}
	}
	async function loadNew(done) {
		cache = false;
		await load();
		done();
	}
	onMount(async () => {
		await load();
	});
	async function loadMore() {
		if (!allowInfinite) return;
		showPreloader = true;
		allowInfinite = false;
		if (!token) {
			showPreloader = false;
			return;
		}
		let newData = await blogger.getLatestPosts({
			max: 20,
			next: token,
		});
		token = newData.nextPageToken;
		items = [...items, ...newData.items];
		allowInfinite = true;
	}
</script>

<Page name={"Blogger"}>
	<Navbar title={"Blogger"} large />

	<Block>
		<p>
			Ad ut dolorem in eligendi quae. Quas in officiis et natus. Tenetur mollitia consequatur totam non repellendus quia. Et dolor et ipsam quia alias temporibus et. Ea voluptas non quo neque
			officiis. In dolor delectus aut quos voluptatibus temporibus. Sed voluptatem incidunt et alias. Qui nemo impedit incidunt ipsa. Id et eligendi eligendi sunt.
		</p>
		<p>Tenetur minima velit nesciunt omnis. Maiores consequatur dolores eos nobis iste quia.Ratione nulla commodi eligendi.</p>
	</Block>
	<List mediumInset>
		{#each items as item, index (index)}
			<ListItem link={`/pages/blogDetail/${item.id}/${item.title}`} title={item.title} footer={item.updated && new Date(item.updated).toLocaleDateString()}>
				<!--div slot="after-title">
					{#if $bookmarkedKeys.includes(item.id + "#bookmark")}
						<i style="font-size : 15px; " class="f7-icons color-yellow size-22 if-not-md">bookmark_fill</i>
						<i style="font-size : 15px; " class="material-icons size-22 md-only"> bookmark_fill</i>
					{/if}
				</div-->
			</ListItem>
		{/each}
	</List>
	<!--MyList {items}/-->
</Page>
