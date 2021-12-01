<script>
	import {f7, Page, Link, Popup, SwipeoutActions, SwipeoutButton, NavRight, Block, List, ListItem, Navbar} from "framework7-svelte";
	//import {notion, debugMode, subjects, neoSubjects, neoFlashCards, flashCards} from "../js/store";
	import * as localForage from "localforage";
	import Code from "../components/Code.svelte";
	import {onMount} from "svelte";
	let keys = [];
	let data = `{}`;
	onMount(async () => {
		keys = await localForage.keys();
	});
	async function onClick(key) {
		data = await localForage.getItem(key);
		f7.popup.open(".localForageDetail");
	}
</script>

<Page>
	<Navbar backLink={"Back"} title={"Local Forage"}>
		<!--<NavRight>
			<Link popupOpen={".demo-popup-push"}>
				<i class="f7-icons if-not-md"> doc_append </i>
				<i class="material-icons md-only"> doc_append </i>
			</Link>
		</NavRight>-->
	</Navbar>
	<List>
		{#each keys as key, i (i)}
			<ListItem noChevron onClick={() => onClick(key)} swipeout onSwipeoutDeleted={() => localForage.removeItem(key)} title={key}>
				<SwipeoutActions right>
					<SwipeoutButton delete overswipe confirmText="Are you sure you want to delete this item?">Delete</SwipeoutButton>
				</SwipeoutActions>
			</ListItem>
		{/each}
	</List>
	<Popup class="localForageDetail" swipeToClose={"to-bottom"} push>
		<Page>
			<Navbar title={"Content"} />
			{#key data}
				<Code code={JSON.stringify(data, null, 2)} language={"json"} theme="dark" />
			{/key}
		</Page>
	</Popup>
</Page>
