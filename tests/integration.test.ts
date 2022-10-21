//import server from "../src/index";
import { ApolloServer } from "@apollo/server";
import typeDefs from "../src/typesDefs";
import resolvers from "../src/resolvers";
import request from "supertest";

//import server from "../src/index.js";
describe("e2e demo", () => {
	it("retorna olá com o nome fornecido", async () => {
		// console.log("asga");

		const testServer = new ApolloServer({
			typeDefs,
			resolvers,
		});

		const response = await testServer.executeOperation({
			query: "query seila ($data) { signUp(data: $data) }",
			variables: { data: { email: "toto2@gmail.com", password: "123" } },
		});

		console.log(response);
		console.log(response.body.singleResult);

		// Note the use of Node's assert rather than Jest's expect; if using
		// TypeScript, `assert`` will appropriately narrow the type of `body`
		// and `expect` will not.

		//assert(body.kind === "single");
		//expect(response.body.singleResult.errors).toBeUndefined();
		//expect(response.body.singleResult.data?.hello).toBe("Hello world!");

		expect(2).toEqual(2);
	});
});
