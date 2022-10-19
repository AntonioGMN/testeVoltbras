import db from "../dataBase.js";
import axios from "axios";
import dateScalar from "../typesDefs/date.js";
import { GraphQLError } from "graphql";
import dayjs from "dayjs";
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

		async recharge(_: any, { data }) {
			const rechargeEnd = dayjs(data.date).toDate();

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
				where: { userId: 1 },
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

			const newRecharge = await db.recharges.create({
				data: {
					stationId: station.id,
					end: rechargeEnd,
					userId: 1,
				},
			});

			return newRecharge;
		},
	},
};

export default resolvers;
