import { RESTDataSource } from "apollo-datasource-rest";

class GetPlanets extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = "https://exoplanetarchive.ipac.caltech.edu/TAP";
	}

	async getPl() {
		try {
			const query =
				"/sync?query=select+pl_name,pl_bmassj+from+ps+where+pl_bmassj > 10&format=json";
			const pro = await this.get(query);
			console.log(pro);
			return;
		} catch (e) {
			console.log(e);
			console.log("erros");
		}

		return;
	}
}

const planetApi = new GetPlanets();

export default planetApi;
