import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import typeDefs from "./typesDefs/index.js";
import resolvers from "./modules/resolvers.js";
import planetApi from "./dataSource.js";

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

const { url } = await startStandaloneServer(server, {
	context: async () => ({
		dataSources: await planetApi,
	}),
	listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
