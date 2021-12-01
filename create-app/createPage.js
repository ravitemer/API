const fs = require("fs");
const prettier = require("prettier");
let segmentedContent = `<Segmented strong tag="p">
				{#each segmentButtons as {title, action, color}, i (i)}
					<Button active={activeSegment === title} onClick={(e) => action(title)}>
						<span class="mr-2"> {title} </span>
					</Button>
				{/each}
			</Segmented>`;
let searchContent = `<Searchbar
        bind:value={searchBarValue}
        on:change={onSearchBarChange}
        customSearch
      />`;

let pageBodySnippets = {
	list: {
		components: ["List", "ListItem"],
		content: `
  <List>
      {#each Object.entries(data) as [key,value],i (i)}
          <ListItem>
              {key}
          </ListItem>
      {/each}
  </List>
  `,
	},
};
function componentsAfterPageLoad(body, components) {
	let content = "";
	for (let [key, value] of Object.entries(body).filter(([k, v]) => v !== null)) {
		if (pageBodySnippets[key]) components.push(pageBodySnippets[key].components);
		if (pageBodySnippets[key]) content += pageBodySnippets[key].content;
	}
	return content;
}

function createTab(tabName, pathPrepend, tabConfig = {}) {
	let {
		components = ["f7", "Page", "Navbar", "NavTitle", "Preloader", "Block", "Link"],
		routeParams = [],
		routeValues = [],
		ptr = false,
		isTemplate = false,
		navbar = null /*{
			left: null,
			right: null,
			title: null,
			logo : null,
			Subnavbar: null,
		},*/,
		body = {
			fab: null,
			list: null,
		},
	} = tabConfig;
	let imports = ``;
	let exportedVariables =
		routeParams.length > 0
			? `
	export let f7route
	const {${routeParams.toString()}} = f7route.params
	
	 let data = {} 
	 let loading = false;`
			: `
	 let data = {}
	 let loading = false
	 `;
	let computedVariables = ``;
	let customFunctions = ``;
	let onMount = `onMount(async () => {
	  try{
	

    `;
	let pageProps = `name={"${tabName}"} ` + ` ${ptr ? "ptr onPtrRefresh={loadNew}" : ""} ` + ` ${navbar && navbar.Subnavbar ? "withSubnavbar" : ""} `;

	let navbarInner = "";

	customFunctions += `
	async function load(){
            try {
              loading = true
              data = "default data"
              
              loading = false
              return data
		} catch (err) {
		     loading = false
			f7.emit("error",err.message)
			throw new Error(err.message)
		}
          }
	`;
	if (ptr) {
		customFunctions += `
          async function loadNew(done){
            try {
              loading = true
              data = "default data"
              
             
              done()
              loading = false
		} catch (err) {
		  
			done()
			loading = false
			f7.emit("error",err.message)
			throw new Error(err.message)
		}
           
          }
      `;
	}
	if (navbar) {
		if (navbar.logo) {
			components.push(["NavLeft"]);
			navbarInner += `
	    <NavLeft>
			<span class="ml-2 logo {loading ? 'animate-pulse' : ''}">${tabName}</span>
		</NavLeft>
		`;
		} else if (navbar.left && navbar.left.length > 0) {
			components.push(["NavLeft"]);
			navbarInner += `
	    <NavLeft>
	        ${navbar.left.reduce((content, icon) => {
						content += `
	          <Link>
				<i style="font-size : 22px; " class="f7-icons text-sm if-not-md">${icon}</i>
				<i style="font-size : 22px; " class="material-icons text-sm md-only">${icon} </i>
			</Link>
			`;
						return content;
					}, "")}
		</NavLeft>
	    `;
		}
		navbarInner += navbar.logo
			? ""
			: `
	  <NavTitle>${navbar ? (navbar.title ? navbar.title : tabName) : ""}</NavTitle> 
	  `;
		if (navbar.right && navbar.right.length > 0) {
			components.push(["NavRight"]);
			navbarInner += `
	    <NavRight>
	        ${navbar.right.reduce((content, icon) => {
						content += `
	          <Link>
				<i style="font-size : 22px; " class="f7-icons text-sm if-not-md">${icon}</i>
				<i style="font-size : 22px; " class="material-icons text-sm md-only">${icon} </i>
			</Link>
			`;
						return content;
					}, "")}
		</NavRight>
	    `;
		}

		if (navbar.Subnavbar) {
			components.push("Subnavbar");
			if (navbar.Subnavbar.search) {
				components.push("Searchbar");
				exportedVariables += `\n let searchBarValue = ""`;
				customFunctions += `
        async function onSearchBarChange(e){ 
          //searchBarValue = e.detail.value
        }
        `;
			} else if (navbar.Subnavbar.segmented.length > 0) {
				components = [...components, "Button", "Segmented"];
				let segments = navbar.Subnavbar.segmented.reduce((combinedString, segment) => {
					return (combinedString += `{
			title: "${segment}",
			color: "primary",
			action: (segment) => {
				activeSegment = segment;
			}
		},`);
				}, "");

				exportedVariables += `
        let activeSegment
        let segmentButtons = [${segments}]
        `;
				computedVariables += `
        $ : if (activeSegment) {
          localForage.setItem("@${tabName}#activeSegment", activeSegment);
        }
        `;
				onMount += `
        activeSegment = (await localForage.getItem("@${tabName}#activeSegment")) ||  segmentButtons[0].title;
        `;
			}
			navbarInner += `
        <Subnavbar>
            ${navbar.Subnavbar.search ? searchContent : segmentedContent}
        </Subnavbar>
    `;
		}
	}

	let pageContent = ``;
	if (body.fab) {
		if (body.fab.length === 0) {
			components.push(["Icon", "Fab"]);
			pageContent += `
      <Fab href="🥇">
		<Icon ios="f7:plus" aurora="f7:plus" md="material:add" />
		<Icon ios="f7:xmark" aurora="f7:xmark" md="material:close" />
	</Fab> 
	`;
		} else if (body.fab.length > 0) {
			components.push(["Icon", "Fab", "FabButtons", "FabButton"]);
			exportedVariables += `
	  let fabTitles = ${JSON.stringify(body.fab)}
	  $ : fabButtons = fabTitles.map(b => ({href:"🥇",onClick:() => {}, icon : b.icon, title : b.title}))
	  `;
			pageContent += `
	<Fab href="">
		<Icon ios="f7:plus" aurora="f7:plus" md="material:add" />
		<Icon ios="f7:xmark" aurora="f7:xmark" md="material:close" />
	  <FabButtons class=" ">
	        {#each fabButtons as {href,onClick,icon,title},i (i)}
	            <FabButton {href} {onClick} class=" ">
				<Icon ios="f7:{icon}" aurora="f7:{icon}" md="material:{icon}" />
			</FabButton>
	        {/each}
		</FabButtons>
	</Fab> 
	  `;
		}
	}

	pageContent += `
	{#await load()}
	    <Block>
			<div style="display:flex;justify-content:center;">
				<Preloader size={32} />
			</div>
		</Block>
      {:then value}
          {#if  $debugMode}
       value : {JSON.stringify(value,null,2)}
          {/if}
          ${componentsAfterPageLoad(body, components)}
      {:catch err}
          <p class="text-center p-8 text-xl text-red-500 font-semibold font-mono">{err}</p>
      {/await}
	   
	`;
	if (!(navbar && navbar.Subnavbar)) {
		components.push("NavTitleLarge");
		navbarInner += `
	  <NavTitleLarge>${navbar ? (navbar.title ? navbar.title : tabName) : ""}</NavTitleLarge> 
	  `;
	}

	let importedF7Components = `import { ${Array.from(new Set(components)).toString()} } from "framework7-svelte";` + `\nimport {onMount} from "svelte";`;
	let navbarContent = navbar
		? `<Navbar  noHairline ${navbar && navbar.Subnavbar ? "" : "large"} sliding={"false"}>
	${navbarInner}
	</Navbar>`
		: "";
	onMount += `
	}catch (err){
	f7.emit("error",err.message)
}
	})`;
	imports += `
     import * as localForage from "localforage";
     import {debugMode} from "../js/store";
	//import {notion} from "../js/defaults";
	//import {getDate} from "../js/utils.js";
			`;
	let tabContent = `
    <script>
    ${importedF7Components}
    ${imports}
    ${exportedVariables}
    ${computedVariables}
    ${customFunctions}
    ${onMount}
    </script>
    <Page ${pageProps}>
        ${navbar ? navbarContent : ""}
        ${pageContent}
    </Page>
    `;
	if (isTemplate) {
		//fs.writeFileSync(`${pathPrepend}/${tabName}.svelte`, tabContent)
	} else {
		const formatted = fs.writeFileSync(`${pathPrepend}`, tabContent);
	}
	console.log(`Wrote ${tabName} tab`);
}
module.exports = {
	createTab,
};
