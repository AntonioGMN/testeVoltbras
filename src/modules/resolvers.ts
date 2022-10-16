import getPlanets from "../dataBase.js";

const resolvers = {
	Query: {
		suitablePlanets: () => {
			const planets = getPlanets();
			return planets;
		},
	},

	Mutation: {
		installStation(_: any, args) {
			console.log(args);
		},
	},
};

export default resolvers;
