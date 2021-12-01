import * as axios from "axios";
import * as req from "graphql-request";
import * as localForage from "localforage";
import {getDate} from "../js/utils.js";

export const Notion = function () {
	this.block = {
		id: " ",
		info: async function (params = {}) {
			return (await axios.request({url: `/notion/block/${this.id}`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		getSubBlocks: async function (params = {}) {
			return (await axios.request({url: `/notion/block/${this.id}/subblocks`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		update: async function (params = {}) {
			return (await axios.request({url: `/notion/block/${this.id}`, method: "PATCH", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		del: async function (params = {}) {
			return (await axios.request({url: `/notion/block/${this.id}`, method: "DELETE", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
	};
	this.database = {
		id: " ",
		info: async function (params = {}) {
			const {cache = true, storeName = "#dbinfo"} = params;
			let data = await localForage.getItem(storeName);
			if (data && cache === true) {
				return data;
			} else {
				data = (await axios.request({url: `/notion/database/${this.id}`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
				await localForage.setItem(storeName, data);
				return data;
			}
		},
		list: async function (params = {}) {
			return (await axios.request({url: `/notion/database`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		addPages: async function (params = {}) {
			return (await axios.request({url: `/notion/database/${this.id}/pages`, method: "PUT", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		updatePages: async function (params = {}) {
			return (await axios.request({url: `/notion/database/${this.id}/pages/`, method: "PATCH", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		archivePages: async function (params = {}) {
			return (await axios.request({url: `/notion/database/${this.id}/pages`, method: "DELETE", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		getPages: async function (params = {}) {
			const {cache = true, storeName = "#pages"} = params;
			let data = await localForage.getItem(storeName);
			if (data && cache === true) {
				return data;
			} else {
				let data = (await axios.request({url: `/notion/database/${this.id}/pages`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
				const newData = data.reduce((res, page) => {
					res[page.id] = page;
					return res;
				}, {});
				await localForage.setItem(storeName, newData);
				return newData;
			}
		},
		findPages: async function (params = {}) {
			return (await axios.request({url: `/notion/database/${this.id}/pages`, method: "POST", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
	};
	this.page = {
		id: " ",
		info: async function (params = {cache: true}) {
			const {cache = true, storeName = `pageInfo${this.id}`} = params;
			let data = await localForage.getItem(storeName);
			if (params.cache === true && data) {
				return data;
			} else {
				data = (await axios.request({url: `/notion/page/${this.id}`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
				await localForage.setItem(storeName, data);
				return data;
			}
		},
		addBlocks: async function (params = {}) {
			return (await axios.request({url: `/notion/page/${this.id}/blocks`, method: "PUT", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		getBlocks: async function (params = {}) {
			return (await axios.request({url: `/notion/page/${this.id}/blocks`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		findBlocks: async function (params = {}) {
			return (await axios.request({url: `/notion/page/${this.id}/blocks`, method: "POST", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		archive: async function (params = {}) {
			return (await axios.request({url: `/notion/page/${this.id}`, method: "DELETE", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
		update: async function (params = {}) {
			try {
				return (await axios.request({url: `/notion/page/${this.id}`, method: "PATCH", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
			} catch (err) {
				throw new Error(err.message);
			}
		},
	};
	this.root = {
		getAdmin: async function (params = {}) {
			return (await axios.request({url: `/`, method: "GET", baseURL: "https://snippetsss.herokuapp.com", params: params.params, data: params.data})).data;
		},
	};
};

/*async function test() {
  try {
     notion.page.id = "aaa7c8a8-fffd-4e44-b0d6-9eaaebf8cbb6"
     
    let data = await notion.page
    console.log(JSON.stringify(data,null,2))
        //========================================Block========================================
    //NotionClass.block.id = "606919ed-4621-4121-ae84-3ffb4a343133"
    //let data = await NotionClass.block.info()
    //let data = await NotionClass.block.getSubBlocks({params : {asString : true}})
    //let data = await NotionClass.block.getSubBlocks({params : {asString : true}})
    //let data = await NotionClass.block.update({data : {content : ">> New toggle",children : ["#1 Updated"]}})
       //=====================================Page===========================================
    
    //NotionClass.page.id = "aaa7c8a8-fffd-4e44-b0d6-9eaaebf8cbb6"
    //let data = await NotionClass.page.archive()
    //let data = await NotionClass.database.info()
    //let data = await NotionClass.page.update({data : {children : ["#1 Updated"]}})
     //let data = await NotionClass.page.addBlocks({data : [">> This is a Toggle"]})
    //let data = await NotionClass.page.findBlocks({params : {where : "#1 => "}})
    //let data = await NotionClass.page.getBlocks()
    //let data = await NotionClass.page.info()
    //=====================================Database===========================================
     //NotionClass.database.id = "0cf23ad4-53a5-49a1-b190-863417c994bd"
     //let data = await NotionClass.database.findPages({params : {max : 2, where : "Name => T => IN => Huw"}})
     //let data = await NotionClass.database.addPages({data : []})
     //let data = await NotionClass.database.updatePages({params : {where : "Name => T => IN => Hell"}, data : {properties : ["Name => T=> Huw"]}})
     //let data = await NotionClass.database.archivePages({params : {where : "Name => T => IN => Huw"}})
     //let data = await NotionClass.database.getPages({params : {max : 2}})
     //let data = await NotionClass.database.list()
   } catch (err) {
     console.log(err)
   }
  }
test() */
