export const darkMode = {
	name: "darkMode",
	params: {
		darkMode: "#242424",
	},
	create: function () {
		const f7 = this;
		f7.darkMode = {
			color: f7.params.darkMode,
			enable: function () {
				f7.dialog.alert(this.color);
			},
		};
	},
	clicks: {
		a: function ($el, data) {
			console.log(this, $el);
		},
	},
	on: {},
};
