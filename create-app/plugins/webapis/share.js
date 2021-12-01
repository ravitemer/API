export const SharePlugin = {
	name: "share",
	create() {
		const f7 = this;
		f7.share = async function ({title, url, text}, success, error) {
			if (navigator.share) {
				try {
					await navigator.share({
						//files,
						title,
						text,
						url,
					});
					success && success();
				} catch (err) {
					if (error) {
						error(err);
					} else {
						throw err;
					}
				}
			} else {
				let e = new Error("Can't share the data");
				if (error) {
					error(e);
				} else {
					throw e;
				}
			}
		};
	},
};
