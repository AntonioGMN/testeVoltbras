import pkg from "@prisma/client";
import axios from "axios";

const { PrismaClient } = pkg;
export const prisma = new PrismaClient();

async function getPlanets() {
	try {
		const { data: planets } = await axios.get(
			"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_masse,pl_bmassj+from+ps+where+pl_bmassj > 10&format=json"
		);
		const planetsSetPros = await planets.map((p) => {
			return { name: p.pl_name, mass: p.pl_masse, hasStation: false };
		});
		return planetsSetPros;
	} catch (e) {
		console.log(e);
		console.log("erro");
	}
}

export default getPlanets;
