module.exports = {
	appName: "Copilot",
	userName: "ok",
	passWord: "pass",
	styles: {
		layoutTheme: "dark",
		colorTheme: "pink",
		barsStyle: "empty",
		customColor: "",
	},
	//================================================================================
	tabs: {
		Copilot: {
			icon: "logo_github",
			ptr: true,
			navbar: {
				right: ["plus"],
			},

			body: {
				fab: null /*[
				/*{
					title: "Card",
					icon: "airplane",
				},
				{
					title: "Text",
					icon: "paragraph",
				},
			],*/,
				list: {},
			},
		},
		Icons: {
			icon: "paintbrush_fill",
			ptr: false,
			navbar: {
				Subnavbar: {
					search: true,
				},
			},

			body: {
				fab: null /*[
				/*{
					title: "Card",
					icon: "airplane",
				},
				{
					title: "Text",
					icon: "paragraph",
				},
			],*/,
				list: {},
			},
		},
		WebApis: {
			icon: "command",
			navbar: {
				logo: true,
			},
			body: {
				list: {},
			},
		},
		Test: {
			icon: "infinite",
			navbar: {
				right: ["arrow_down", "ellipsis"],
			},
		},
	},
	settingsTab: {
		icon: "gear",
		isTemplate: true,
	},
	blogTab: {
		icon: "doc_richtext",
		isTemplate: true,
	},
	//================================================================================
	pages: {
		test: {
			icon: "cool",
		},
		blogDetail: {
			routeParams: ["id", "title"],
		},
		linksDetail: {
			ptr: false,
			navbar: {
				Subnavbar: {
					search: true,
				},
			},

			body: {
				fab: null /*[
				/*{
					title: "Card",
					icon: "airplane",
				},
				{
					title: "Text",
					icon: "paragraph",
				},
			],*/,
				list: {},
			},
		},
	},
	//================================================================================
	modals: {},
	//================================================================================
	api: {
		notion: {
			databases: {
				progress: "0cf23ad4-53a5-49a1-b190-863417c994bd",
				tweets: "b793d408d4294bb69ab5b7d639eb9530",
				plab: "992d73c7afdb4385a3be6d182fc3c718",
				mind: "cebe11e3af424716898f0c425fe3a9db",
				clinic: "edd8d44f4f8e4a899916fb4077b04f52",
				clinicServices: "7e4009f6084748bd92ae07969066c6b9",
				code: "9b3a2cdcea5c4798b19139dcbc5e1e7a",
				links: "eca8c64b5aaf4f5d89dbdef99ba62132",
				proto: " ",
			},
		},
		//========================================================
		fauna: {
			databases: {
				test: "fnAEW9iFtfACSd11ls5y_8Ag51ZHJHkA_wi2zGPc",
			},
		},
		//=======================================================
	},
	//================================================================================
	avoid: ["src/pages/linksDetail.svelte", "src/tabs/Icons.svelte", "src/tabs/Copilot.svelte", "src/js/store.js", "src/tabs/Test.svelte", "src/tabs/WebApis.svelte"],
};

/** Tab 
{    
    icon = "gear",
    ptr = false,
    navbar = {left : null, right : null, title : null ,Subnavbar : {
            segmented : ["pdfs",],
            search : false
            }
          }
    
    
    
    routeParams = [],
    routeValues = [], // Should be filled for tabs
    isTemplate =false,
}
*/
