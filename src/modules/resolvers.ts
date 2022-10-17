import db from "../dataBase.js";
import axios from "axios";
const resolvers = {
	Query: {
		suitablePlanets: async () => {
			try {
				const t =
					"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_bmassj+from+ps+where+pl_bmassj > 10&format=json";
				const { data: planets } = await axios.get(t);

				for (const p of planets) {
					await db.planets.upsert({
						where: { name: p.pl_name },
						update: {},
						create: {
							name: p.pl_name,
							mass: p.pl_bmassj,
						},
					});
				}
			} catch (e) {
				console.log(e);
			}

			const suitablePlanets = await db.planets.findMany();
			return suitablePlanets;
		},

		stations: () => {
			const stations = db.stations.findMany();
			return stations;
		},
	},

	Mutation: {
		async installStation(_: any, { data }) {
			const planet = await db.planets.findFirst({
				where: {
					name: data.planet,
				},
			});

			console.log(planet);

			const response = db.stations.create({
				data: { name: data.name, planet: data.planet, planetId: planet.id },
			});

			const r = await db.planets.update({
				where: {
					id: planet.id,
				},
				data: {
					hasStation: true,
				},
			});

			console.log(r);

			return response;
		},
	},
};

export default resolvers;
