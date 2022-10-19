import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

function validateTokenAndGetUserId(token) {
	if (!token)
		throw new GraphQLError("Erro com authorization header", {
			extensions: {
				code: "BAD_USER_INPUT",
				http: { status: 401 },
			},
		});

	try {
		const secretKey = process.env.JWT_SECRET;
		const response = jwt.verify(token, secretKey);
		return response.user.id;
	} catch {
		throw new GraphQLError("Invalid Token", {
			extensions: {
				code: "BAD_USER_INPUT",
				http: { status: 401 },
			},
		});
	}
}
