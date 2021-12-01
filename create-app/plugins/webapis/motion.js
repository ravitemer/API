let onSuccessfulMotion = undefined;
let onSuccessfulOrientation = undefined;

function Motion(f7) {
	//Motion.success = undefined;
	function handleMotionEvent(event) {}
	function addListeners(callbacks) {
		if ("devicemotion" in callbacks) {
			window.addEventListener("devicemotion", onSuccessfulMotion, true);
		}
		if ("deviceorientation" in callbacks) {
			window.addEventListener("deviceorientation", onSuccessfulOrientation, true);
		}
	}
	this.stop = function (events = ["devicemotion", "deviceorientation"]) {
		if (events.includes("devicemotion")) {
			window.removeEventListener("devicemotion", onSuccessfulMotion, true);
			onSuccessfulMotion = undefined;
		}
		if (events.includes("deviceorientation")) {
			window.removeEventListener("deviceorientation", onSuccessfulOrientation, true);
			onSuccessfulOrientation = undefined;
		}
	};
	this.on = async function (callbacks, reject) {
		if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
			try {
				const response = await DeviceOrientationEvent.requestPermission();
				if (response === "granted") {
					if ("devicemotion" in callbacks && !onSuccessfulMotion) {
						onSuccessfulMotion = callbacks.devicemotion;
					}
					if ("deviceorientation" in callbacks && !onSuccessfulOrientation) {
						onSuccessfulOrientation = callbacks.deviceorientation;
					}
					addListeners(callbacks);
				} else {
					reject(new Error("Permission denied"));
				}
			} catch (err) {
				reject(err);
			}
		} else {
			addListeners(callbacks);
		}
	}; /*function (success, error) {
		if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
			DeviceOrientationEvent.requestPermission()
				.then((response) => {
					if (response === "granted") {
						window.addEventListener("devicemotion", handleMotionEvent, true);
					} else {
						error({message: "Permission not granted"});
					}
				})
				.catch((err) => error(err.message));
		} else {
			success();
		}
	};*/
}

export const OrientationPlugin = {
	name: "orientation",
	create() {
		const f7 = this;
		f7.motion = new Motion(f7);
	},
};
