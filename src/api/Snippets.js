import * as axios from "axios";
import * as localForage from "localforage";

export const Snippets = function () {
	this.getRoutes = async function (params = {}) {
		const {cache = true, storeName = "#dbinfo"} = params;
		let data = await localForage.getItem(storeName);
		if (data && cache === true) {
			return data;
		} else {
			data = (await axios.request({url: `/routes`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
			await localForage.setItem(storeName, data);
			return data;
		}
	};
};
