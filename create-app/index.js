const fs = require("fs");

let {files, folders, api, tabs, pages, modals, styles, appName, userName, passWord, settingsTab, avoid} = require("./filedata");
const {createTab} = require("./createPage");
const ROOT_FOLDER = "src";

//================================================================================

let variables = {
	js: {
		"utils.js": {
			styles: JSON.stringify(styles, null, 2),
		},
		"defaults.js": {
			tabs: JSON.stringify(tabs, null, 2),
			pages: JSON.stringify(pages, null, 2),
			modals: JSON.stringify(modals, null, 2),
			appName: JSON.stringify(appName, null, 2),
			userName: JSON.stringify(userName, null, 2),
			passWord: JSON.stringify(passWord, null, 2),
			notionDatabases: JSON.stringify(api.notion.databases, null, 2),
			faunaDatabases: JSON.stringify(api.fauna.databases, null, 2),
		},
		"routes.js": {
			firstTab: Object.keys(tabs)[0],
		},
		"store.js": {
			activeTab: Object.keys(tabs)[0],
		},
	},
	root: {
		"index.html": {
			appName: appName,
		},
		"manifest.json": {
			appName: appName,
		},
	},
};
//================================================================================
createRootFolder();
//createTemplateFilesAndFolders();
createFolder(folders);
createTabs(tabs);
createPages(pages);

function createTabs(tabs) {
	if (!fs.existsSync(`../src/${ROOT_FOLDER}/tabs`)) {
		fs.mkdirSync(`../src/${ROOT_FOLDER}/tabs`);
		console.log(`Created Tabs folder`);
	}
	console.log("Writing Tabs");
	for (let tabName of Object.keys(tabs)) {
		let tabPath = `${ROOT_FOLDER}/tabs/${tabName}.svelte`;
		if (!avoid.includes(tabPath)) {
			createTab(tabName, `../src/${tabPath}`, tabs[tabName]);
		}
	}
}
function createPages(pages) {
	if (!fs.existsSync(`../src/${ROOT_FOLDER}/pages`)) {
		fs.mkdirSync(`../src/${ROOT_FOLDER}/pages`);
		console.log(`Created Pages folder`);
	}
	console.log("Writing Pages");
	for (let pageName of Object.keys(pages)) {
		let pagePath = `${ROOT_FOLDER}/pages/${pageName}.svelte`;
		if (!avoid.includes(pagePath)) {
			createTab(pageName, `../src/${pagePath}`, pages[pageName]);
		}
	}
}

function createFolder(obj, path = "", variablesForthisFolder = variables) {
	//let files = Object.keys(obj).filter(name => name.includes("."))
	let folders = Object.keys(obj).filter((name) => !name.includes("."));
	let rootPath = `../src/${ROOT_FOLDER}` + path;
	for (let folder of folders) {
		if (folder !== "root" && !fs.existsSync(`${rootPath}/${folder}`)) {
			fs.mkdirSync(`${rootPath}/${folder}`);
			console.log(`Created ${folder} folder`);
		}
		createFiles(`${rootPath}/${folder}`, obj[folder], folder, variablesForthisFolder[folder] || {});
		createFolder(obj[folder], (path = `/${folder}`), variablesForthisFolder[folder]);
	}
}

function createFiles(path, thisFolderObj, folder, variables) {
	let thisFolderFiles = Object.keys(thisFolderObj).filter((name) => name.includes("."));
	console.log(path);
	//console.log(thisFolderFiles)
	//console.log(thisFolderObj)
	//console.log(variables)
	for (let file of thisFolderFiles) {
		let fileContent = thisFolderObj[file];
		if (variables[file]) {
			for (let variable of Object.keys(variables[file])) {
				let v = "\\$\\$\\{\\{" + variable + "\\}\\}";
				let re = new RegExp(v, "gm");
				//console.log("🥇" + variables[file][variable]);
				thisFolderObj[file] = thisFolderObj[file].replace(re, variables[file][variable]);
			}
		}
		let filePath = folder === "root" ? `../src/${ROOT_FOLDER}/${file}` : `${path}/${file}`;
		if (!avoid.includes(filePath.slice(7))) {
			fs.writeFileSync(`${filePath}`, thisFolderObj[file]);
			console.log(`Created ${file} in ${folder} folder`);
		}
	}
}

function createTemplateFilesAndFolders() {
	console.log("Creating Folders");
	for (let folder of Object.keys(folders)) {
		if (folder !== "root") {
			if (!fs.existsSync(`../src/${ROOT_FOLDER}/${folder}`)) {
				fs.mkdirSync(`../src/${ROOT_FOLDER}/${folder}`);
				console.log(`Created ${folder} folder`);
			}
		}

		let thisFolderObj = folders[folder];
		let thisFolderFiles = Object.keys(thisFolderObj);
		for (let file of thisFolderFiles) {
			let fileContent = thisFolderObj[file];
			if (variables[folder] && variables[folder][file]) {
				for (let variable of Object.keys(variables[folder][file])) {
					let v = "\\$\\$\\{\\{" + variable + "\\}\\}";
					let re = new RegExp(v, "gm");
					thisFolderObj[file] = thisFolderObj[file].replace(re, variables[folder][file][variable]);
				}
			}
			let filePath = folder === "root" ? `${ROOT_FOLDER}/${file}` : `${ROOT_FOLDER}/${folder}/${file}`;
			if (!avoid.includes(filePath)) {
				fs.writeFileSync(`../src/${filePath}`, thisFolderObj[file]);
				console.log(`Created ${file} in ${folder} folder`);
			}
		}
	}
}

function createRootFolder() {
	if (!fs.existsSync(`../src/${ROOT_FOLDER}`)) {
		fs.mkdirSync(`../src/${ROOT_FOLDER}`);
	}
}
