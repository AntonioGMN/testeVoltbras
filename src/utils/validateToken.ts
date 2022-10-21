import { unauthorized } from "./erro.js";
import jwt from "jsonwebtoken";

export default function validateTokenAndReturnUserId(token: string) {
	if (!token) throw unauthorized("Erro com authorization header");

	try {
		const secretKey = process.env.JWT_SECRET;
		const response = jwt.verify(token, secretKey);
		return response.user;
	} catch {
		throw unauthorized("Invalid token");
	}
}
