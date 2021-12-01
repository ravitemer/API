<script>
	import {onMount} from "svelte";
	import {
		f7,
		f7ready,
		App,
		Panel,
		Views,
		View,
		Popup,
		Page,
		Navbar,
		Toolbar,
		NavRight,
		Link,
		Block,
		//Preloader,
		//BlockTitle,
		LoginScreen,
		LoginScreenTitle,
		List,
		ListItem,
		ListInput,
		ListButton,
		BlockFooter,
	} from "framework7-svelte";

	import routes from "../js/routes";
	import {activeTab, previousTab, debugMode} from "../js/store.js";
	import {tabs, appName, userName, passWord} from "../js/defaults.js";
	import * as utils from "../js/utils.js";
	import * as localForage from "localforage";

	//================================================================================
	let panel;
	// Framework7 Parameters
	let f7params = {
		name: appName, // App name
		theme: "ios", // Automatic theme detection
		debugger: false,
		upscroller: {
			ignorePages: ["Settings"],
			position: "br",
			text: "Go Up",
		},
		//autoDarkTheme: true,
		routes: routes,
		touch: {
			tapHold: true, //enable tap hold events
		},
		on: {
			init: async () => {},
		},
		notification: {
			icon: `<i class="f7-icons">star_fill</i>`,
			title: appName,
			titleRightText: "now",
			closeTimeout: 2000,

			closeOnClick: true,
		},
		toast: {
			position: "top",
			destroyOnClose: true,
			//closeTimeout: 2000,
		},
		// Register service worker (only on production build)
		serviceWorker: process.env.NODE_ENV === "production" ? {path: "/service-worker.js"} : {},
	};
	// Login screen demo data
	let username = "";
	let password = "";
	function alertLoginData() {
		if (username === userName && password === passWord) {
			localForage.setItem("VITE_USERNAME", username);
			localForage.setItem("VITE_PASSWORD", password);
			f7.loginScreen.close();
		} else {
			f7.dialog.alert(`Invalid credentials`);
		}
	}
	//================================================================================
	function onTabLinkClick(tab) {
		$activeTab = tab;
		if ($previousTab !== $activeTab) {
			try {
				document.querySelectorAll(`#${tab}`)[0].f7View.router.back();
				return;
			} catch (err) {
				f7.emit("error", err.message);
				return;
			}
		}

		if ($previousTab === tab) {
			if (f7.$(`.page[data-name="${tab}"] .page-content`)[0]) f7.$(`.page[data-name="${tab}"] .page-content`).scrollTop(0, 300);
		}
		$previousTab = $activeTab;
	}

	//🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻🗻
	onMount(() => {
		f7ready(async () => {
			f7.utils = {...utils, ...f7.utils};
			let USERNAME = await localForage.getItem("VITE_USERNAME");
			let PASSWORD = await localForage.getItem("VITE_PASSWORD");
			if (USERNAME !== userName || PASSWORD !== passWord) {
				f7.loginScreen.open("#my-login-screen");
			}
			try {
			} catch (err) {
				f7.dialog.alert("Error at app : " + err.message);
			}
		});
	});
	$: w = 0;
</script>

<svelte:window bind:innerWidth={w} />

<App {...f7params}>
	<!-- Left panel with cover effect when hidden -->

	<Panel left bind:this={panel} cover visibleBreakpoint={768}>
		<View>
			<Page>
				<Navbar class={"mynavbar"} large transparent title={appName} />
				{#if w >= 768}
					<List strong mediumInset>
						{#each Object.entries(tabs) as [title,{icon="gear",routeValues=[]}], i (i)}
							<ListItem
								link={`/${title}/${routeValues.join("/")}`}
								animate={false}
								noChevron
								view=".view-main"
								{title}
								class={$activeTab === title ? "bg-color-primary" : ""}
								onClick={() => ($activeTab = title)}
							>
								<span slot="media">
									<i style="font-size : 22px; " class="f7-icons color-yellow if-not-md">{icon}</i>
									<i style="font-size : 22px; " class="material-icons md-only">{icon}</i>
								</span>
							</ListItem>
						{/each}
					</List>
				{:else}
					Dynamic small content goes here
				{/if}
			</Page>
		</View>
	</Panel>

	<!-- Your main view, should have "view-main" class -->

	<Views tabs={!(w >= 768)} labels={false} class="safe-areas">
		{#if !(w >= 768)}
			<Toolbar id="tool" tabbar bottom>
				{#each Object.entries(tabs) as [title,{icon="gear"}], i (i)}
					<Link onClick={() => onTabLinkClick(title)} tabLink="#{title}" tabLinkActive={i === 0}>
						<i style="font-size : 22px; " class="f7-icons color-gray  size-22 if-not-md">{icon}</i>
						<i style="font-size : 22px; " class="material-icons size-22 md-only">{icon} </i>
					</Link>
				{/each}
			</Toolbar>
			{#each Object.entries(tabs) as [title,{icon="gear",routeValues=[]}], i (i)}
				<View onTabShow={() => ($activeTab = title)} stackPages id={title} class="safe-areas" name={title} tab url={`/${title}/${routeValues.join("/")}`} main={i === 0} tabActive={i === 0} />
			{/each}
		{:else}
			{#each Object.entries(tabs).slice(0, 1) as [title,{icon="gear",routeValues=[]}], i (i)}
				<View stackPages id={title} class="safe-areas" name={title} url={`/${title}/${routeValues.join("/")}`} main />
			{/each}
		{/if}
	</Views>

	<!-- Popup -->
	<Popup id="my-popup">
		<View>
			<Page>
				<Navbar title="Popup">
					<NavRight>
						<Link popupClose>Close</Link>
					</NavRight>
				</Navbar>
				<Block>
					<p>Popup content goes here.</p>
				</Block>
			</Page>
		</View>
	</Popup>
	<!--Calder popup-->

	<LoginScreen id="my-login-screen">
		<View>
			<Page loginScreen>
				<LoginScreenTitle>Login</LoginScreenTitle>

				<List form>
					<ListInput type="text" name="username" placeholder="Your username" bind:value={username} />
					<ListInput type="password" name="password" placeholder="Your password" bind:value={password} />
				</List>
				<List>
					<ListButton title="Sign In" onClick={() => alertLoginData()} />
				</List>
				<BlockFooter>
					This is a personal website. <br />
				</BlockFooter>
			</Page>
		</View>
	</LoginScreen>
</App>

<style>
	@media (min-width: 768px) {
		:global(.panel) {
			width: 310px;
		}
		:global(.list.medium-inset) {
			overflow: hidden;
		}
	}
</style>
