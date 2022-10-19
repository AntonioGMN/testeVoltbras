import db from "../dataBase.js";
import axios from "axios";
import dateScalar from "../typesDefs/date.js";
import dayjs from "dayjs";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as planetsDataBase from "../repositories/planetsReponsitory.js";
import * as stationsDataBase from "../repositories/stationsRepository.js";
import * as userDataBase from "../repositories/userRepository.js";
import * as rechargeDataBase from "../repositories/rechargeRepository.js";

import getPlanets from "../utils/getPlantes.js";
import * as erro from "../utils/erro.js";
import validateTokenAndReturnUserId from "../utils/validateToken.js";

dayjs.locale("br");

const resolvers = {
	date: dateScalar,

	Query: {
		suitablePlanets: async () => {
			const planets = await getPlanets();

			for (const p of planets) {
				await planetsDataBase.upsert(p.pl_name, p.pl_bmassj);
			}

			const suitablePlanets = await db.planets.findMany();
			return suitablePlanets;
		},

		stations: async () => {
			const stations = await stationsDataBase.getAll();
			return stations;
		},
	},

	Mutation: {
		async installStation(_: any, { data }) {
			const planet = await planetsDataBase.findByName(data.planet);

			const createdStation = await stationsDataBase.create(
				data.name,
				data.planet,
				planet.id
			);

			await planetsDataBase.updateHasStationTrue(planet.id);

			return createdStation;
		},

		async signUp(_: any, { data }) {
			const { email, password } = data;

			const findedUser = await userDataBase.findByEmail(email);
			if (findedUser)
				throw erro.notFound("There is already a registered user with this email");

			const hashPassword = bcrypt.hashSync(password, 10);
			const createdUser = await userDataBase.create(email, hashPassword);

			return createdUser;
		},

		async login(_: any, { data }) {
			const { email, password } = data;

			const findedUser = await userDataBase.findByEmail(email);
			if (!findedUser) throw erro.notFound("Not found a user com this email");

			const isPasswordValid = bcrypt.compareSync(password, findedUser.password);
			if (!isPasswordValid) throw erro.forbidden("Invalid password");

			const token = jwt.sign({ user: findedUser }, process.env.JWT_SECRET);
			return { token };
		},

		async recharge(_: any, { data }, context) {
			const rechargeEnd = dayjs(data.date).toDate();
			const token = context.token;
			const userId = validateTokenAndReturnUserId(token);

			if (dayjs().isAfter(rechargeEnd))
				throw erro.forbidden(
					"Date is invalid. You need to pass a date greater than the current date"
				);

			const station = await stationsDataBase.findByName(data.stationName);
			if (!station) throw erro.notFound("Not found station with this name");

			const stationLastRecharge = await rechargeDataBase.findLastByStationId(
				station.id
			);
			if (stationLastRecharge)
				if (!dayjs().isAfter(stationLastRecharge.end))
					throw erro.forbidden("This station is already doing a recharge");

			const userLastRecharge = await rechargeDataBase.findLastByUserId(userId);
			if (userLastRecharge)
				if (!dayjs().isAfter(userLastRecharge.end))
					throw erro.forbidden("This user is already doing a recharge");

			const newRecharge = rechargeDataBase.create(station.id, rechargeEnd, userId);
			return newRecharge;
		},
	},
};

export default resolvers;
