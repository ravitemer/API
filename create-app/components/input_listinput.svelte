<script>
	import {ListInput} from "framework7-svelte";
	import {createEventDispatcher} from "svelte";
	export let value;

	export let label;
	export let media;
	export let type;
	export let readonly;
	export let calendarParams;
	export let rawType;
	let updated = false;
	export let updateOver = false;
	let dispatch = createEventDispatcher();
	function onChange() {
		let temp = value;
		updated = true;
		let dates = [];
		if (rawType === "date" && Array.isArray(value)) {
			for (let d of value) {
				let thatDate = new Date(d);
				let year = thatDate.getFullYear();
				let month = thatDate.getMonth() + 1 < 10 ? `0${thatDate.getMonth() + 1}` : thatDate.getMonth() + 1;
				let date = thatDate.getDate() < 10 ? `0${thatDate.getDate()}` : thatDate.getDate();
				dates.push(`${year}-${month}-${date}`);
			}
			temp = dates.join("||");
		}

		dispatch("change", {
			code: `${label} => ${rawType} => ${temp}`,
			inputLabel: label,
		});
	}
</script>

<ListInput {calendarParams} inputStyle={"text-align : right"} {onChange} {type} bind:value {readonly} resizeable class=" ">
	<div slot="media" class={updated && !updateOver ? "text-green-400" : "text-gray-400"}>
		<i style="font-size:18px;" class="f7-icons if-not-md"> {media}</i>
		<i style="font-size:18px;" class="material-icons md-only">{media}</i>
	</div>
	<div slot="label" class=" ">
		{label}
	</div>
</ListInput>
