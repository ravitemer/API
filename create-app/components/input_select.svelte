<script>
	import {ListItem} from "framework7-svelte";
	import {createEventDispatcher} from "svelte";
	export let value;

	export let label;
	export let media;
	export let rawType;
	export let type;
	//export let readonly;
	export let options = ["Test"];

	let dispatch = createEventDispatcher();
	function onChange() {
		setTimeout(() => {
			dispatch("change", {
				code: `${label} => ${rawType} => ${value}`,
				inputLabel: label,
			});
		}, 10);
	} //smartSelect smartSelectParams={{openIn: 'popup'}}
</script>

<ListItem smartSelect smartSelectParams={{openIn: "popover"}}>
	<div style="color:gray; " slot="media" class=" ">
		<i style="font-size:18px;" class="f7-icons if-not-md"> {media}</i>
		<i style="font-size:18px;" class="material-icons md-only">{media}</i>
	</div>
	<div slot="title" class=" ">
		{label}
	</div>
	<select on:change={() => onChange()} name={label} bind:value>
		{#each options as option, i (i)}
			<option value={option}>{option}</option>
		{/each}
	</select>
</ListItem>
