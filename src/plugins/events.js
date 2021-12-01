export const customEvents = {
	name: "customEvents",
	params: {},
	on: {
		online: function () {
			this.toast.show({
				text: "Online",
				position: "top",
				cssClass: "bg-green-400",
				destroyOnClose: true,
				closeTimeout: 2000,
			});
		},
		offline: function () {
			this.toast.show({
				text: "Offline",
				position: "top",
				cssClass: "bg-red-400",
				destroyOnClose: true,
				closeButton: true,
			});
		},
		//==================================================================
		error: function (text) {
			this.toast.show({
				text,
				position: "top",
				cssClass: "text-yellow-400 bg-red-400",
				destroyOnClose: true,
				closeButton: true,
			});
		},
		success: function (text) {
			this.toast.show({
				text,
				position: "top",
				cssClass: "text-pink-400 bg-green-400",
				destroyOnClose: true,
				closeTimeout: 2000,
			});
		},
		info: function (text, showIn = "toast") {
			if (showIn === "toast") {
				this.toast.show({
					text,
					position: "top",
					cssClass: "text-green-400",
					destroyOnClose: true,
					closeTimeout: 2000,
				});
			} else if (showIn === "sheet") {
				const sheet = this.sheet.create({
					content: `
  		   <div class="sheet-modal sheet-modal-push my-sheet-swipe-to-step" style="height:auto;">
    <div class="sheet-modal-inner">
      <div class="sheet-modal-swipe-step">
        <div class="display-flex padding justify-content-space-between align-items-center">
          <div style="font-size: 18px"><b>Total:</b></div>
          <div style="font-size: 22px"><b>$500</b></div>
        </div>
        <div class="padding-horizontal padding-bottom">
          <a class="button button-large button-fill">Make Payment</a>
          <div class="margin-top text-align-center">Swipe up for more details</div>
        </div>
      </div>
      <div class="block-title block-title-medium margin-top">Your order:</div>
      <div class="list no-hairlines">
        <ul>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">Item 1</div>
              <div class="item-after text-color-black"><b>$200</b></div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">Item 2</div>
              <div class="item-after text-color-black"><b>$180</b></div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">Delivery</div>
              <div class="item-after text-color-black"><b>$120</b></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div> 
		    `,
					on: {
						opened: function (sheet) {
							this.emit("error", "opened");
						},
						closed: function (sheet) {
							this.emit("error", "destroyed");
							sheet.destroy();
						},
					},
					swipeToClose: true,
					swipeToStep: true,
					backdrop: true,
				});
				sheet.open();
			} else if (showIn === "popup") {
				const popup = this.popup.create({
					content: `
  		 <div class="popup">
  <div class="view">
    <div class="page">
      <div class="navbar">
        <div class="navbar-bg"></div>
        <div class="navbar-inner">
          <div class="title">${"Popup"}</div>
          <div class="right">
            <!-- Link to close popup -->
            <a class="link popup-close">Close</a>
          </div>
        </div>
      </div>
      <div class="page-content">
      <div class="p-4 text-lg">
      ${text}
      </div>
      </div>
    </div>
  </div>
</div>
		    `,
					on: {
						opened: function (popup) {
							this.emit("error", "opened");
						},
						closed: function (popup) {
							this.emit("error", "destroyed");
							popup.destroy();
						},
					},
					swipeToClose: true,
					push: true,
					backdrop: true,
				});
				popup.open();
			}
		},

		//==========================================================
	},
};
