import { RESTDataSource } from "apollo-datasource-rest";

class PlanetsApi extends RESTDataSource {
	name: String;
	mass: number;
	hasStation: Boolean;

	constructor() {
		super();
		this.baseURL =
			"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_masse,pl_bmassj+from+ps+where+pl_bmassj > 10&format=json";
	}

	async getPlanets() {
		const { data } = await this.get("");
		console.log(data);
		return data;
	}
}

export default PlanetsApi;
