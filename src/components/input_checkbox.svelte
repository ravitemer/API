<script>
	import {Toggle, ListItem} from "framework7-svelte";
	import {createEventDispatcher} from "svelte";
	export let value;
	export let label;
	export let media;
	export let type;
	export let readonly;
	let dispatch = createEventDispatcher();
	function onToggleChange() {
		value = !value;
		dispatch("change", {
			value,
			type,
		});
	}
</script>

<ListItem>
	<div style="color:gray;" slot="media" class=" ">
		<i style="font-size:18px;" class="f7-icons if-not-md"> {media}</i>
		<i style="font-size:18px;" class="material-icons md-only">{media}</i>
	</div>
	<span>{label}</span>
	<Toggle {onToggleChange} disabled={readonly} checked={value} />
</ListItem>
