function Sound() {
	this.play = function (url) {
		let audio = new Audio(url);
		audio.play();
		/*audio.addEventListener("canplaythrough", (event) => {
			audio.play();
		});*/
	};
}

export const AudioPlugin = {
	name: "audio",
	create() {
		const f7 = this;
		f7.audio = new Sound();
	},
};
