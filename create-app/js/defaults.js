import {Notion,FaunaGQL} from "../api";

export let appName = $${{appName}}
  export let userName = $${{userName}}
  export let passWord = $${{passWord}} 
      export let tabs = $${{tabs}}
      export let pages = $${{pages}}
export let modals = $${{modals}}
let notionDatabases = $${{notionDatabases}}
let faunaDatabases = $${{faunaDatabases}}
export const notion = Object.entries(notionDatabases).reduce((obj, [key, value]) => {
	let x = new Notion();
	x.database.id = value;
	obj[key] = x;
	return obj;
}, {});

export const fauna = Object.entries(faunaDatabases).reduce((obj, [key, value]) => {
	let x = new FaunaGQL({uri:"https://graphql.fauna.com/graphql",secret:value});
	obj[key] = x;
	return obj;
}, {});
