import t7 from "template7";
import Swiper, {Pagination} from "swiper";
import $$ from "dom7";
// import Swiper and modules styles
import "swiper/css";
//import 'swiper/css/navigation';
import "swiper/css/pagination";
import "./screen.css";

// configure Swiper to use modules
Swiper.use([Pagination]);

let css = `

.swiper-slide {
  -webkit-transform: translateZ(0);
-webkit-backface-visibility: hidden;
}
`;
function Screen(options = {}) {
	var screen, swiper, stylesheet;
	if (!options) options = {};
	let {
		/*includeLogin,
		loginTemplate = `
		 <div style="height:100%;width:100%;" class="swiper-slide ">
               <div style="height:100%;width:100%;" class="swiper-col bg-red-400">
                   
                </div> 
            </div> 
		`,*/
		template = `
  <div style="background:#fff;z-index:100000;width:100vw;height:100vh;" class="welcomescreen-container absolute top-0 left-0">
   <div style="height:100%;width:100%;" class="swiper-container">
   <div style="height:100%;width:100%;" class="swiper-wrapper ">
        <!-- Slide -->
        {{#each slides}}
            <div style="height:100%;width:100%;" class="swiper-slide bg-{{bgColor}}">
              <div style="height:100%;width:100%;" class="swiper-col">
                  {{#if image }}<img alt="{{image.alt}}"  class="slide-image" src="{{image.src}}"/>{{/if}}
                  <div class="slide-text">
                {{#if heading }}
                    <div class="slide-heading">
                        {{heading}}
                    </div>
                {{/if}}
                {{#if subheading }}
                    <div class="slide-subheading">
                        {{subheading}}
                    </div>
                {{/if}}
                 {{#if @last}}
                    <div class="closescreen button button-round button-fill button-large mx-auto w-3/4">Get started</div>
                {{/if}}
                </div>
              
              </div>
            </div>
        {{else}}
            <div style="display:flex;justify-content:center;align-items:center;" class="bg-green-200 swiper-slide">No Slides</div>
        {{/each}}
    </div>
               <div class="swiper-pagination"></div>
               <!--div class="slide-skip">Skip</div-->
   </div>
  </div>
  `,
		slides = [
			{
				heading: "Tester",
				subheading: "Reiciendis et voluptatem aut qui illum voluptas. Et rerum a voluptatum illo distinctio tempora sunt. Sunt aspernatur dolor doloribus ex sequi a magnam nulla.",
				bgColor: "red-400",
				image: {
					src: "icons/1.svg",
					alt: "bhbnn",
				},
			},
			{
				heading: "Progress",
				subheading: "Explicabo ipsam quia id corrupti harum rerum reprehenderit. Dicta non ab ut quos. Doloremque cupiditate dolor ut voluptates et hic dolores architecto.",
				bgColor: "green-400",
				image: {
					src: "icons/2.svg",
				},
			},
			{
				heading: "Success",
				subheading: " Odio neque expedita eligendi eos temporibus. Ad sed dolor earum vel eos numquam quam rem. Dolores culpa aliquam culpa qui. Ad tempora quia explicabo quis dolorem adipisci.",
				bgColor: "yellow-400",
				image: {
					src: "icons/3.svg",
				},
			},
			{
				heading: "Success",
				subheading: " Odio neque expedita eligendi eos temporibus. Ad sed dolor earum vel eos numquam quam rem. Dolores culpa aliquam culpa qui. Ad tempora quia explicabo quis dolorem adipisci.",
				bgColor: "blue-400",
				image: {
					src: "icons/4.svg",
				},
			},
		],
	} = options;
	function initSwiper() {
		swiper = new Swiper(".swiper-container", {
			direction: "horizontal",
			pagination: {
				el: ".swiper-pagination",
				/*clickable: true,
				renderBullet: function (index, className) {
					return `<span class="dot swiper-pagination-bullet"></span>`;
				},*/
			},
			/*loop: options.loop,
        pagination: options.pagination
          ? { el: '.swiper-pagination' }
          : undefined,
        parallax: options.parallax,
        speed: options.parallaxSpeed,*/
		});
	}
	function compiledHtml(template, params) {
		return t7.compile(template)(params);
	}
	this.check = function () {
		//this.emit("info", "Screen plugin is active with 3 functions", "popup");
	};
	this.open = function () {
		screen = $$(compiledHtml(template, {slides}));
		screen[0].f7Welcomescreen = this;
		stylesheet = document.createElement("style");
		stylesheet.innerHTML = css;
		document.body.appendChild(stylesheet);
		$$("body").append(screen);
		initSwiper();
	};
	this.close = function () {
		if (screen) screen.remove();
		screen = undefined;
	};
}

export const screen = {
	name: "welcomescreen",
	params: {
		welcomescreen: {
			template: undefined,
			slides: undefined,
			//includeLogin: true,
			//loginTemplate: undefined,
		},
	},
	create: function () {
		const f7 = this;
		const options = f7.params.welcomescreen;
		f7.welcomescreen = new Screen(options);
	},
	static: {
		Screen: Screen,
	},

	on: {
		init: function () {
			const f7 = this;
			const $$ = f7.$;

			$$(document).on("click", ".closescreen", function (e) {
				e.preventDefault();
				var welcomescreen = $$(this).parents(".welcomescreen-container");
				if (welcomescreen.length > 0 && welcomescreen[0].f7Welcomescreen) {
					welcomescreen[0].f7Welcomescreen.close();
				}
			});
		},
	},
};
