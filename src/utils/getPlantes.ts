import axios from "axios";

export default async function getPlanets() {
	try {
		const t =
			"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_bmassj+from+ps+where+pl_bmassj > 10&format=json";
		const { data: planets } = await axios.get(t);
		return planets;
	} catch (e) {
		console.log(e);
	}
}
