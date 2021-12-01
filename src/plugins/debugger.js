//var debugEnabled = false;
export let debugPlugin = {
	name: "debugger",
	// extend app params with debugger params
	params: {
		debugger: false,
	},
	create: function () {
		var f7 = this;
		// extend app methods with debugger methods when app instance just created
		f7.debugger = {
			enable: function () {
				f7.params.debugger = true;
			},
			disable: function () {
				f7.params.debugger = false;
			},
		};
	},
	on: {
		init: function () {
			var f7 = this;
			if (f7.params.debugger) console.log("app init");
		},
	},
	clicks: {
		li: function ($el, data) {
			if (this.params.debugger) {
				this.emit("info", $el.html(), "sheet");
			}
		},
		p: function ($el, data) {
			if (this.params.debugger) {
				this.emit("info", $el.html());
			}
		},
	},
};
