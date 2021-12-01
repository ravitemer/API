function Clipboard() {
	this.copy = async function (text) {
		await navigator.clipboard.writeText(text);
		return text;
	};
	this.paste = async function () {
		return await navigator.clipboard.readText();
	};
}
export const ClipboardPlugin = {
	name: "clipboard",
	create() {
		const f7 = this;
		f7.clipboard = new Clipboard();
	},
};
