function Geolocation() {
	this.watchID = undefined;
	this.getCurrentPosition = function (
		success,
		error = (err) => {
			throw new Error(err);
		},
		options = {}
	) {
		const supported = "geolocation" in navigator;
		if (supported) {
			try {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						success({
							timestamp: pos.timestamp,
							latitude: pos.coords.latitude,
							longitude: pos.coords.longitude,
							altitude: pos.coords.altitude,
							accuracy: pos.coords.accuracy,
							altitudeAccuracy: pos.coords.altitudeAccuracy,
							heading: pos.coords.heading,
							speed: pos.coords.speed,
						});
					},
					error,
					options
				);
			} catch (err) {
				throw new Error(err.message);
			}
		} else {
			throw new Error("Enable geolocation picker in experimental features");
		}
	};
	//==================================================
	this.watchPosition = function (
		success,
		error = (err) => {
			throw new Error(err);
		},
		options = {} /* {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
};*/
	) {
		const supported = "geolocation" in navigator;
		if (supported) {
			try {
				if (!this.watchID) {
					this.watchID = navigator.geolocation.watchPosition(
						(pos) => {
							success({
								timestamp: pos.timestamp,
								latitude: pos.coords.latitude,
								longitude: pos.coords.longitude,
								altitude: pos.coords.altitude,
								accuracy: pos.coords.accuracy,
								altitudeAccuracy: pos.coords.altitudeAccuracy,
								heading: pos.coords.heading,
								speed: pos.coords.speed,
							});

							//navigator.geolocation.clearWatch(watchID);
						},
						error,
						options
					);
				}
			} catch (err) {
				throw new Error(err.message);
			}
		} else {
			throw new Error("Enable geolocation picker in experimental features");
		}
	};
	//=========================================================
	this.clear = function () {
		navigator.geolocation.clearWatch(this.watchID);
		this.watchID = null;
	};
}

export const GeolocationPlugin = {
	name: "geolocation",
	create() {
		const f7 = this;
		f7.geolocation = new Geolocation();
	},
};
