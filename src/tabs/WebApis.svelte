<script>
	import {f7, Page, Navbar, Block, BlockTitle, Button, Link, NavLeft} from "framework7-svelte";
	import {onMount} from "svelte";

	import * as localForage from "localforage";
	import {debugMode} from "../js/store";
	//import {notion} from "../js/defaults";
	//import {getDate} from "../js/utils.js";

	let data = {};
	let count = 0;
	let motionData = {};
	let orientationData = {};
	let value = "";
	let selectedIndex = 0;
	let voiceLang = "en";
	let voice = f7.speech.langs()[voiceLang][0];
	function handleMotionData(event) {
		let x = {};
		x.xAG = Math.floor(event.accelerationIncludingGravity.x);
		x.yAG = Math.floor(event.accelerationIncludingGravity.y);
		x.zAG = Math.floor(event.accelerationIncludingGravity.z);
		x.xA = Math.floor(event.acceleration.x);
		x.yA = Math.floor(event.acceleration.y);
		x.zA = Math.floor(event.acceleration.z);
		x.alpha = Math.floor(event.rotationRate.alpha);
		x.beta = Math.floor(event.rotationRate.beta);
		x.gamma = Math.floor(event.rotationRate.gamma);
		x.interval = Math.floor(event.interval);
		motionData = x;
	}
	function handleOrientationData(event) {
		let x = {};
		x.alpha = Math.floor(event.alpha);
		x.beta = Math.floor(event.beta);
		x.gamma = Math.floor(event.gamma);
		x.absolute = Math.floor(event.absolute);
		orientationData = x;
	}
	onMount(async () => {
		try {
		} catch (err) {
			f7.emit("error", err.message);
		}
	});
</script>

<Page name={"WebApis"}>
	<Navbar noHairline sliding={"false"}>
		<NavLeft>
			<span class="ml-2 logo">WebApis</span>
		</NavLeft>
	</Navbar>
	<BlockTitle class=" ">Speech Api</BlockTitle>
	<input bind:value class="p-2 outline-none bg-transparent m-2 block text-lg" />
	<Block strong class="space-y-8">
		<select bind:value={voiceLang} name="voicesLangs" class="">
			{#each Object.entries(f7.speech.langs()) as [langName, {name, lang}], i (i)}
				<option value={langName} class=" ">{`${langName}`}</option>
			{:else}
				<option value={"No Voices"} class=" ">{`No Voices`}</option>
			{/each}
		</select>
		<select bind:value={voice} name="voices" class="">
			{#each f7.speech.langs()[voiceLang] || [] as v, i (i)}
				<option value={v} class=" ">{`${v.name} : ${v.lang}`}</option>
			{:else}
				<option value={"No Voices"} class=" ">{`No Voices`}</option>
			{/each}
		</select>
		<Button
			onClick={() => {
				try {
					f7.speech.speak(
						{text: value, voice: voice},
						() => {},
						(e) => f7.emit("error", e.message)
					);
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
		>
			Speak
		</Button>
		<Button
			onClick={() => {
				try {
					f7.speech.pause();
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
		>
			Pause
		</Button>
		<Button
			onClick={() => {
				try {
					f7.speech.resume();
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
		>
			Resume
		</Button>
		<div class="flex justify-around overflow-scroll">
			<p class=" ">Pending : {f7.speech.Class.pending}</p>
			<p class=" ">Paused : {f7.speech.Class.paused}</p>
			<p class=" ">Speaking : {f7.speech.Class.speaking}</p>
		</div>
	</Block>
	<BlockTitle class=" ">Audio Api</BlockTitle>
	<Block strong class="space-y-8">
		<audio controls src="https://s9.naasongs.download/tejx139kje6nwp/Radhe%20Shyam%20-%20(2021)/%5BiSongs.info%5D%2001%20-%20Radhe%20Shyam%20First%20Glimpse.mp3" class="block mx-auto">
			Not supported</audio
		>
		<Button
			onClick={() => {
				try {
					f7.audio.play("https://s9.naasongs.download/tejx139kje6nwp/Radhe%20Shyam%20-%20(2021)/%5BiSongs.info%5D%2001%20-%20Radhe%20Shyam%20First%20Glimpse.mp3");
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
		>
			Play
		</Button>
	</Block>
	<BlockTitle class=" ">Share Api</BlockTitle>
	<Block strong class="space-y-8">
		<Button
			onClick={() => {
				try {
					f7.share({text: JSON.stringify(orientationData)}, () => f7.emit("success", "Shared successfully"));
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
		>
			Share
		</Button>
	</Block>
	<BlockTitle class=" ">Motion Sensors...</BlockTitle>
	<Block strong class="space-y-8">
		<div class="motion text-lg p-4 font-medium">
			{#each Object.entries(motionData) as [k, v], i (i)}
				<p class="">
					<span class="text-lg font-bold"> {k} : </span>
					<span class="text-md font-medium">{v}</span>
				</p>
			{/each}
		</div>
		<Button
			fill
			onClick={() => {
				try {
					f7.motion.on({devicemotion: handleMotionData}, (e) => f7.emit("error", e.message));
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
			class=" ">Request</Button
		>
		<Button
			fill
			onClick={() => {
				try {
					f7.motion.stop(["devicemotion"]);
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
			class=" ">Stop</Button
		>
	</Block>
	<BlockTitle class=" ">Orientation</BlockTitle>
	<Block strong class="space-y-8">
		<div class="orientation text-lg p-4 font-medium">
			{#each Object.entries(orientationData) as [k, v], i (i)}
				<p class="">
					<span class="text-lg font-bold"> {k} : </span>
					<span class="text-md font-medium">{v}</span>
				</p>
			{/each}
		</div>
		<Button
			fill
			onClick={() => {
				try {
					f7.motion.on({deviceorientation: handleOrientationData}, (e) => f7.emit("error", e.message));
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
			class=" ">Request</Button
		>
		<Button
			fill
			onClick={() => {
				try {
					f7.motion.stop(["deviceorientation"]);
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
			class=" ">Stop</Button
		>
	</Block>

	<BlockTitle class=" ">Geolocation</BlockTitle>
	<Block strong class="space-y-8">
		<Button
			fill
			onClick={() => {
				try {
					f7.geolocation.getCurrentPosition((pos) => {
						f7.emit("info", JSON.stringify(pos, null, 2), "popup");
					});
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
			class=" ">Current Location</Button
		>
		<Button
			fill
			onClick={() => {
				try {
					f7.geolocation.watchPosition((pos) => {
						f7.emit("success", JSON.stringify(pos, null, 2), "popup");
						++count;
						if (count === 3) {
							f7.geolocation.clear();
						}
					});
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
			class=" ">Watch Location {count}</Button
		>
		<Button
			fill
			onClick={() => {
				try {
					f7.geolocation.clear();
				} catch (err) {
					f7.emit("error", err.message);
				}
			}}
			class=" ">Stop Watching</Button
		>
	</Block>
</Page>
