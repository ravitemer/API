function Contacts() {
	this.select = async function (config = {}) {
		const supported = "contacts" in navigator && "ContactsManager" in window;
		if (supported) {
			const props = config.include || ["name", "email", "tel"]; //, "address", "icon"
			const opts = {multiple: config.multiple || false};

			try {
				const contacts = await navigator.contacts.select(props, opts);
				return contacts;
			} catch (err) {
				throw new Error(err.message);
			}
		} else {
			throw new Error("Enable contacts picker in experimental features");
		}
	};
}

export const ContactsPlugin = {
	name: "contacts",
	create() {
		const f7 = this;
		f7.contacts = new Contacts();
	},
};
