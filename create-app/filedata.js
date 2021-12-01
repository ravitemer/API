const fs = require("fs");
const path = require("path");
const config = require("./config");
let APPNAME = config.appName;
let filesToInclude = [];
let foldersToInclude = ["css", "js", "components", "pages", "tabs", "api", "root", "plugins"];

let tabTemplates = [];
let pageTemplates = [];

function readFiles(path) {
	let filesPath = `../src/create-app` + path;
	const filesInDir = fs.readdirSync(filesPath).filter((filename) => !fs.lstatSync(`${filesPath}/${filename}`).isDirectory());
	let filesObj = {};
	for (let file of filesInDir) {
		filesObj[file] = fs.readFileSync(`${filesPath}/${file}`, "utf-8");
		if (path.includes("pages")) {
			pageTemplates.push(file);
		}
		if (path.includes("tabs")) {
			tabTemplates.push(file);
		}
		config.pages = {
			...config.pages,
			...pageTemplates.reduce((obj, filename) => {
				let page = filename.replace(".svelte", "");
				obj[page] = {
					isTemplate: true,
					...config.pages[page],
				};
				return obj;
			}, {}),
		};
		if (config.settingsTab) {
			config.tabs["Settings"] = config.settingsTab;
		}
		if (config.blogTab) {
			config.tabs["Blog"] = config.blogTab;
		}
	}
	return filesObj;
}

function readFolders(path = ``) {
	let rootPath = `../src/create-app` + path;
	const foldersInDir = fs.readdirSync(rootPath).filter((filename) => fs.lstatSync(`${rootPath}/${filename}`).isDirectory());
	const filesInDir = fs.readdirSync(rootPath).filter((filename) => !fs.lstatSync(`${rootPath}/${filename}`).isDirectory());
	console.log(rootPath + " : Folders :  " + foldersInDir);
	console.log(rootPath + " : Files :  " + filesInDir);
	let foldersObj = {};
	for (let folder of foldersInDir) {
		//foldersInDir
		console.log(`Reading from ${rootPath} => ${folder} Folder`);
		foldersObj[folder] = {...readFiles(`${path}/${folder}`, filesInDir), ...readFolders(`${path}/${folder}`)};
	}
	//console.log(foldersObj)
	return foldersObj;
	//console.log(foldersObj)
}

let filesAndFolders = {
	files: {},
	folders: readFolders(),
};

module.exports = {
	...filesAndFolders,
	...config,
};

//console.log(readFolders().tabs["new_folder"])
