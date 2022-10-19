import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import typeDefs from "./typesDefs/index.js";
import resolvers from "./modules/resolvers.js";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

const { url } = await startStandaloneServer(server, {
	context: async ({ req }) => {
		const token = req.headers.authorization || undefined;

		return { token };
	},
	listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
