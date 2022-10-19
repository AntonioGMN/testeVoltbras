import db from "../dataBase.js";
import axios from "axios";
import dateScalar from "../typesDefs/date.js";
import { GraphQLError } from "graphql";
import dayjs from "dayjs";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dayjs.locale("br");

const resolvers = {
	date: dateScalar,

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

			return response;
		},

		async signUp(_: any, { data }) {
			const { email, password } = data;

			const findedUser = await db.user.findFirst({
				where: {
					email: email,
				},
			});

			if (findedUser) {
				throw new GraphQLError(
					"There is already a registered user with this email",
					{
						extensions: {
							code: "BAD_USER_INPUT",
							http: { status: 401 },
						},
					}
				);
			}

			const hashPassword = bcrypt.hashSync(password, 10);

			const createdUser = await db.user.create({
				data: {
					...data,
					password: hashPassword,
				},
			});

			return createdUser;
		},

		async login(_: any, { data }) {
			const { email, password } = data;
			console.log(password);

			const findedUser = await db.user.findFirst({
				where: {
					email: email,
				},
			});
			if (!findedUser) {
				throw new GraphQLError("Not found a user com this email", {
					extensions: {
						code: "BAD_USER_INPUT",
						http: { status: 401 },
					},
				});
			}

			const isPasswordValid = bcrypt.compareSync(password, findedUser.password);
			console.log(password + " = " + findedUser.password + " " + isPasswordValid);

			if (!isPasswordValid) {
				throw new GraphQLError(
					"There is already a registered user with this email",
					{
						extensions: {
							code: "BAD_USER_INPUT",
							http: { status: 401 },
						},
					}
				);
			}

			const token = jwt.sign({ user: findedUser }, process.env.JWT_SECRET);
			return { token };
		},

		async recharge(_: any, { data }, context) {
			const rechargeEnd = dayjs(data.date).toDate();
			const token = context.token;
			let userId;

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
				userId = response.user.id;
			} catch {
				throw new GraphQLError("Invalid Token", {
					extensions: {
						code: "BAD_USER_INPUT",
						http: { status: 401 },
					},
				});
			}

			if (dayjs().isAfter(rechargeEnd)) {
				throw new GraphQLError(
					"Date is invalid. You need to pass a date greater than the current date",
					{
						extensions: {
							code: "BAD_USER_INPUT",
							http: { status: 401 },
						},
					}
				);
			}

			const station = await db.stations.findFirst({
				where: { name: data.stationName },
			});

			if (!station)
				throw new GraphQLError("not found station", {
					extensions: {
						code: "BAD_USER_INPUT",
						http: { status: 401 },
					},
				});

			const stationLastRecharge = await db.recharges.findFirst({
				where: { stationId: station.id },
				orderBy: { id: "desc" },
			});

			if (stationLastRecharge) {
				if (!dayjs().isAfter(stationLastRecharge.end)) {
					throw new GraphQLError("This station is already doing a recharge", {
						extensions: {
							code: "BAD_REQUEST",
							http: { status: 400 },
						},
					});
				}
			}

			const userLastRecharge = await db.recharges.findFirst({
				where: { userId },
				orderBy: { id: "desc" },
			});

			if (userLastRecharge) {
				if (!dayjs().isAfter(userLastRecharge.end)) {
					throw new GraphQLError("This user is already doing a recharge", {
						extensions: {
							code: "BAD_REQUEST",
							http: { status: 400 },
						},
					});
				}
			}

			console.log(rechargeEnd);

			const newRecharge = await db.recharges.create({
				data: {
					stationId: station.id,
					end: rechargeEnd,
					userId,
				},
			});

			return newRecharge;
		},
	},
};

export default resolvers;
