import getPlanets from "../dataBase.js";
import { prisma } from "../dataBase.js";

interface planet {
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
	},

	Mutation: {
		async installStation(_: any, args: planet) {
			const response = await prisma.stations.create({
				data: { planet: args.name },
			});
			console.log(response);
			return args;
		},
	},
};

export default resolvers;
