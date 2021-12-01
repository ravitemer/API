<script>
	import {onMount} from "svelte";
	import hljs from "highlight.js/lib/core";

	import javascript from "highlight.js/lib/languages/javascript";
	import swift from "highlight.js/lib/languages/swift";
	import xml from "highlight.js/lib/languages/xml";
	import css from "highlight.js/lib/languages/css";
	import python from "highlight.js/lib/languages/python";
	import json from "highlight.js/lib/languages/json";
	import markdown from "highlight.js/lib/languages/markdown";
	import plaintext from "highlight.js/lib/languages/plaintext";

	export let language = "xml";
	let languages = [
		{name: "javascript", file: javascript},
		{name: "swift", file: swift},
		{name: "xml", file: xml},
		{name: "css", file: css},
		{name: "python", file: python},
		{name: "json", file: json},
		{name: "markdown", file: markdown},
		{name: "plaintext", file: plaintext},
	];
	export let code = `
//Cool
<p class="jj"></p>
function hello(){
  return \`hello\${2}\`
}
`;
	export let theme = "dark"; //light

	let stylesheet;
	let dark = `

pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}/*!
  Theme: a11y-dark
  Author: @ericwbailey
  Maintainer: @ericwbailey

  Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css
*/.hljs{background:#2b2b2b;color:#f8f8f2}.hljs-comment,.hljs-quote{color:#d4d0ab}.hljs-deletion,.hljs-name,.hljs-regexp,.hljs-selector-class,.hljs-selector-id,.hljs-tag,.hljs-template-variable,.hljs-variable{color:#ffa07a}.hljs-built_in,.hljs-link,.hljs-literal,.hljs-meta,.hljs-number,.hljs-params,.hljs-type{color:#f5ab35}.hljs-attribute{color:gold}.hljs-addition,.hljs-bullet,.hljs-string,.hljs-symbol{color:#abe338}.hljs-section,.hljs-title{color:#00e0e0}.hljs-keyword,.hljs-selector-tag{color:#dcc6e0}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}@media screen and (-ms-high-contrast:active){.hljs-addition,.hljs-attribute,.hljs-built_in,.hljs-bullet,.hljs-comment,.hljs-link,.hljs-literal,.hljs-meta,.hljs-number,.hljs-params,.hljs-quote,.hljs-string,.hljs-symbol,.hljs-type{color:highlight}.hljs-keyword,.hljs-selector-tag{font-weight:700}}

`;
	let light = `

pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}/*!
  Theme: a11y-light
  Author: @ericwbailey
  Maintainer: @ericwbailey

  Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css
*/.hljs{background:#f4f4f4;color:#545454}.hljs-comment,.hljs-quote{color:#696969}.hljs-deletion,.hljs-name,.hljs-regexp,.hljs-selector-class,.hljs-selector-id,.hljs-tag,.hljs-template-variable,.hljs-variable{color:#d91e18}.hljs-attribute,.hljs-built_in,.hljs-link,.hljs-literal,.hljs-meta,.hljs-number,.hljs-params,.hljs-type{color:#aa5d00}.hljs-addition,.hljs-bullet,.hljs-string,.hljs-symbol{color:green}.hljs-section,.hljs-title{color:#007faa}.hljs-keyword,.hljs-selector-tag{color:#7928a1}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}@media screen and (-ms-high-contrast:active){.hljs-addition,.hljs-attribute,.hljs-built_in,.hljs-bullet,.hljs-comment,.hljs-link,.hljs-literal,.hljs-meta,.hljs-number,.hljs-params,.hljs-quote,.hljs-string,.hljs-symbol,.hljs-type{color:highlight}.hljs-keyword,.hljs-selector-tag{font-weight:700}}

`;
	$: if (stylesheet && theme) {
		stylesheet.innerHTML = theme === "dark" ? dark : light;
	}
	$: index = languages.map((l) => l.name).indexOf(language);
	onMount(async () => {
		try {
			stylesheet = document.createElement("style");
			document.head.append(stylesheet);
			for (let l of languages) {
				hljs.registerLanguage(l.name, l.file);
			}

			//const lang = await import(`highlight.js/lib/languages/${language}`)
			//hljs.registerLanguage(language, lang.default);
			hljs.highlightAll();
		} catch (err) {
			console.log(err.message);
			throw new Error(err);
		}
	});
</script>

<div class="relative">
	<pre>
<code class="language-{language}">
{code}
</code>
</pre>
	<div
		on:click={() => {
			language = index === languages.length - 1 ? languages[0].name : languages[index + 1].name;
			setTimeout(() => hljs.highlightAll(), 10);
		}}
		class="absolute rounded-b text-color-primary shadow px-2 py-1 bg-gray-200 right-0 top-0"
	>
		{language}
	</div>
</div>
