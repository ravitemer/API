
    <script>
    import { f7,Page,Navbar,NavTitle,Preloader,Block,Link,NavRight,List,ListItem,NavTitleLarge } from "framework7-svelte";
import {onMount} from "svelte";
    
     import * as localForage from "localforage";
     import {debugMode} from "../js/store";
	//import {notion} from "../js/defaults";
	//import {getDate} from "../js/utils.js";
			
    
	 let data = {}
	 let loading = false
	 
    
    
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
      
    onMount(async () => {
	  try{
	

    
	}catch (err){
	f7.emit("error",err.message)
}
	})
    </script>
    <Page name={"Home"}  ptr onPtrRefresh={loadNew}   >
        <Navbar  noHairline large sliding={"false"}>
	
	  <NavTitle>Home</NavTitle> 
	  
	    <NavRight>
	        
	          <Link>
				<i style="font-size : 22px; " class="f7-icons text-sm if-not-md">plus</i>
				<i style="font-size : 22px; " class="material-icons text-sm md-only">plus </i>
			</Link>
			
		</NavRight>
	    
	  <NavTitleLarge>Home</NavTitleLarge> 
	  
	</Navbar>
        
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
          
  <List>
      {#each Object.entries(data) as [key,value],i (i)}
          <ListItem>
              {key}
          </ListItem>
      {/each}
  </List>
  
      {:catch err}
          <p class="text-center p-8 text-xl text-red-500 font-semibold font-mono">{err}</p>
      {/await}
	   
	
    </Page>
    