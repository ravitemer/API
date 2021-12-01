const synth = window.speechSynthesis;

function SpeechSynthesis() {
	let voices = [];
	function getVoices() {
		voices = synth.getVoices();
	}
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = getVoices();
	}
	this.pause = function () {
		synth.pause();
	};
	this.resume = function () {
		synth.resume();
	};
	this.cancel = function () {
		synth.cancel();
	};
	this.speak = function ({text, voice, rate, pitch, lang, volume}, success, error) {
		if (synth.speaking) {
			error(new Error("Please wait until spoken"));
			return;
		}
		let utterThis = new SpeechSynthesisUtterance(text);
		utterThis.onend = function (event) {
			success();
			return;
		};
		utterThis.onerror = function (event) {
			error(new Error(event));
			return;
		};
		if (voice) utterThis.voice = voice;
		utterThis.pitch = pitch || 1;
		utterThis.rate = rate || 1;
		if (lang) utterThis.lang = lang;
		utterThis.volume = volume || 1;
		synth.speak(utterThis);
	};
	this.voices = function () {
		getVoices();
		return voices;
	};
	this.langs = function () {
		let array = this.voices();
		let unique = {};
		let group = {};
		for (let obj of array) {
			unique[obj["lang"].slice(0, 2)] = {};
		}
		for (let key in unique) {
			group[key] = array.filter((obj) => obj["lang"].slice(0, 2) == key);
		}
		return group;
	};
	this.Class = synth;
}
export const SpeechSynthesisPlugin = {
	name: "speech",
	create() {
		const f7 = this;
		f7.speech = new SpeechSynthesis();
	},
};
