import getPlanets from "../dataBase.js";
import { prisma } from "../dataBase.js";

interface createStationDate {
	stationName: string;
	name: string;
	mass: number;
	hasStation: boolean;
}

const resolvers = {
	Query: {
		suitablePlanets: () => {
			const planets = getPlanets();
			return planets;
		},
		stations: () => {
			const stations = prisma.stations.findMany();
			return stations;
		},
	},

	Mutation: {
		async installStation(_: any, args: createStationDate) {
			const response = prisma.stations.create({
				data: { name: args.stationName, planet: args.name },
			});
			return response;
		},
	},
};

export default resolvers;
