import * as localForage from "localforage";

import * as axios from "axios";

export class Snippet extends NeoSDK {
	constructor() {
		super({});
	}

	async getAll() {
		return await this.getNodesByLabel({label: "Snippet"});
	}
}

class NeoSDK {
	constructor({url = "https://fullrav.herokuapp.com", token = "AIzaSyBhQRUK8k48eGrNNlj4iOk7MM78-sCh_nQ"}) {
		this.url = url;
		this.token = token;
	}
	//================================================================================
	async getAllNodes() {
		try {
			return (await axios.request({url: `/neo/all-nodes`, method: "GET", baseURL: this.url})).data;
		} catch (e) {
			console.log(e.message);
			throw new Error(e);
		}
	}
	//================================================================================
	async getNodesByLabel({label, groupBy}) {
		try {
			return (await axios.request({url: `/neo/label`, method: "GET", baseURL: this.url, params: {name : label, groupBy : groupBy}})).data;
		} catch (e) {
			console.log(e.message);
			throw new Error(e);
		}
	}
	//================================================================================
}
