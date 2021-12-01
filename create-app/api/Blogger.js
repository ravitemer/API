import * as localForage from "localforage";
import {request} from "framework7";

export class Blogger {
	constructor({blogId = "8005913307053669259", token = "AIzaSyBhQRUK8k48eGrNNlj4iOk7MM78-sCh_nQ"}) {
		this.blogId = blogId;
		this.token = token;
	}
	//================================================================================
	async getLatestPosts({cache = true, fields = "nextPageToken,items(id,title,updated)", max = 20, next = ""}) {
		try {
			if (cache) {
				if (!next) {
					const data = await localForage.getItem("latestPosts");
					if (data) {
						return data;
					} else {
						let url = next
							? `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&maxResults=${max}&pageToken=${next}&fields=${fields}&orderBy=updated`
							: `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&maxResults=${max}&fields=${fields}&orderBy=updated`;
						const res = await (await request.json(url)).data;
						localForage.setItem("latestPosts", res);
						return res;
					}
				} else {
					let url = next
						? `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&maxResults=${max}&pageToken=${next}&fields=${fields}&orderBy=updated`
						: `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&maxResults=${max}&fields=${fields}&orderBy=updated`;
					const res = await (await request.json(url)).data;
					return res;
				}
			} else {
				let url = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&maxResults=${max}&fields=${fields}&orderBy=updated`;
				const res = await (await request.json(url)).data;
				await localForage.setItem("latestPosts", res);
				for (let key of (await localForage.keys()).filter((key) => key.endsWith("#post"))) {
					await localForage.removeItem(key);
				}
				return res;
			}
		} catch (e) {
			console.log(e.message);
			throw new Error(e);
		}
	}
	//================================================================================
	async getPost({cache = true, id = "6716794359792034084", fields = "title,content,updated,author(displayName)"}) {
		try {
			if (cache) {
				const data = await localForage.getItem(id + "#post");
				if (data) {
					return data;
				} else {
					let postUrl = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/${id}?key=${this.token}&fields=${fields}`;
					const res = await (await fetch(postUrl)).json();
					localForage.setItem(id + "#post", res);
					return res;
				}
			} else {
				let postUrl = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/${id}?key=${this.token}&fields=${fields}`;
				const res = await (await fetch(postUrl)).json();
				localForage.setItem(id + "#post", res);
				return res;
			}
		} catch (e) {
			console.log(e);
			throw new Error("Something went wrong while getting post");
		}
	}
	//================================================================================
	async getSubjectPosts({cache = true, subjects = "Anatomy", fields = "nextPageToken,items(updated,id,title)", max = 20, next = ""}) {
		try {
			if (cache) {
				if (!next) {
					const data = await localForage.getItem(subjects + "#sub");
					if (data) {
						return data;
					} else {
						let url = next
							? `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&labels=${subjects}&maxResults=${max}&pageToken=${next}&fields=${fields}&orderBy=updated`
							: `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&labels=${subjects}&maxResults=${max}&fields=${fields}&orderBy=updated`;
						const res = await (await request.json(url)).data;
						localForage.setItem(subjects + "#sub", res);
						return res;
					}
				} else {
					let url = next
						? `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&labels=${subjects}&maxResults=${max}&pageToken=${next}&fields=${fields}&orderBy=updated`
						: `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&labels=${subjects}&maxResults=${max}&fields=${fields}&orderBy=updated`;
					const res = await (await request.json(url)).data;
					return res;
				}
			} else {
				let url = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/?key=${this.token}&labels=${subjects}&maxResults=${max}&fields=${fields}&orderBy=updated`;
				const res = await (await request.json(url)).data;
				localForage.setItem(subjects + "#sub", res);
				return res;
			}
		} catch (e) {
			console.log(e);
		}
	}
	//================================================================================
	async getLabels({cache = true, blogspot = "www.medicowesome.com"}) {
		if (cache) {
			const data = await localForage.getItem("labels");
			if (data) {
				return data;
			} else {
				const cats = await (await fetch(`https://snippetsss.herokuapp.com/medicowesome/categories?blogspot=${blogspot}`)).json();
				localForage.setItem("labels", cats);
				return cats;
			}
		} else {
			const cats = await (await fetch(`https://snippetsss.herokuapp.com/medicowesome/categories?blogspot=${blogspot}`)).json();
			localForage.setItem("labels", cats);
			return cats;
		}
	}
	//================================================================================
	async search({query = "Covid", cache = true, next = "", max = 50, fields = "nextPageToken,items(id,title,updated)"}) {
		try {
			if (cache) {
				if (!next) {
					const data = await localForage.getItem(query + "#query");
					if (data) {
						return data;
					} else {
						let url = next
							? `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/search?key=${this.token}&q=${query}&maxResults=${max}&fields=${fields}&pageToken=${next}`
							: `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/search?key=${this.token}&q=${query}&maxResults=${max}&fields=${fields}`;
						const res = await (await request.json(url)).data;
						await localForage.setItem(query + "#query", res);
						return res;
					}
				} else {
					let url = next
						? `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/search?key=${this.token}&q=${query}&maxResults=${max}&fields=${fields}&pageToken=${next}`
						: `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/search?key=${this.token}&q=${query}&maxResults=${max}&fields=${fields}`;
					const res = await (await request.json(url)).data;

					return res;
				}
			} else {
				let url = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/search?key=${this.token}&q=${query}&maxResults=${max}&fields=${fields}`;
				const res = await (await request.json(url)).data;
				await localForage.setItem(query + "#query", res);
				return res;
			}
		} catch (e) {
			console.log(e);
		}
	}
}
