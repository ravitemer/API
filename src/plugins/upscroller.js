let positions = {
	top: {
		initial: {
			left: "50%",
			transform: "translate(-50% , -100%)",
		},
	},
	br: {
		initial: {
			right: "10px",
			bottom: "0",
			transform: "translate(0, 100%)",
		},
	},
};

export const upscroller = {
	name: "upscroller",
	params: {
		upscroller: {
			text: "",
			bgColor: "var(--f7-theme-color)",
			textColor: "#fff",
			position: "top", //b,br,bl
			ignorePages: [],
		},
	},
	//================================================================================
	create: function () {
		const f7 = this;
		const css = `
    
 .upscroller{
      border-radius : 15px;
      padding : 5px 10px;
      background : ${f7.params.upscroller.bgColor};
      color : ${f7.params.upscroller.textColor};
      position : absolute;
      transition : transform 0.4s;
      z-index:50000;
    }
    `;
		const style = document.createElement("style");
		style.innerHTML = css;
		document.head.append(style);
	},
	//================================================================================
	on: {
		pageInit: function (page) {
			const f7 = this;
			if (this.params.upscroller.ignorePages.includes(page.name)) return;
			const upscroller = f7.$(`<div class="upscroller">👆${f7.params.upscroller.text}</div>`);
			upscroller.css(positions[f7.params.upscroller.position].initial);
			page.$el.prepend(upscroller);
			const pageContent = f7.$(".page-content", page.el);
			upscroller.on("click", function (e) {
				e.stopPropagation();
				e.preventDefault();
				pageContent.scrollTop(0, Math.round(pageContent.scrollTop() / 4));
			});
			pageContent.scroll(function (e) {
				var top = f7.$(e.target).scrollTop();
				let topMargin = 10;
				for (let n of page.navbarEl.querySelectorAll(".navbar-inner,.subnavbar")) {
					topMargin += n.clientHeight;
				}
				let bottomMargin = 10;
				for (let n of f7.$(".toolbar.tabbar.toolbar-bottom")) {
					bottomMargin += n.clientHeight;
				}
				if (top > 300) {
					upscroller.css({
						transform: f7.params.upscroller.position === "top" ? `translate(-50%,${topMargin}px)` : `translate(0,-${bottomMargin}px)`,
					});
				} else {
					upscroller.css(positions[f7.params.upscroller.position].initial);
				}
			});
			//================================================================================
		},
	},
};
