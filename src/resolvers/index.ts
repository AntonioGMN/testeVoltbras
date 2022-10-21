import db from "../dataBase.js";
import dateScalar from "../typesDefs/dateScalar.js";
import dayjs from "dayjs";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as planetsDataBase from "../repositories/planetsReponsitory.js";
import * as stationsDataBase from "../repositories/stationsRepository.js";
import * as userDataBase from "../repositories/userRepository.js";
import * as rechargeDataBase from "../repositories/rechargeRepository.js";
import * as reservationsDataBase from "../repositories/reservationsRepository.js";

import * as stationService from "../service/stationService.js";
import * as dateService from "../service/dateService.js";
import * as rechargeService from "../service/rechargeService.js";
import * as reservationsService from "../service/reservationsService.js";

import * as erro from "../utils/erro.js";
import getPlanets from "../utils/getPlantes.js";
import validateTokenAndReturnUserId from "../utils/validateToken.js";
import formatSeconds from "../utils/formatSeconds.js";

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

		stationHistory: async (_: any, { stationName }, context) => {
			await validateTokenAndReturnUserId(context.token);

			const station = await stationsDataBase.findByName(stationName);
			if (!station) throw erro.notFound("Not foud station with this name");

			const recharges = await rechargeDataBase.getAllByStationId(station.id);

			const stationHistory = recharges.map((r) => {
				const end = dayjs(r.end).valueOf();
				const start = dayjs(r.start).valueOf();
				const durationOnSeconds = dayjs(end).diff(start, "s");
				const duration = formatSeconds(durationOnSeconds);

				return {
					user: r.user.name,
					start: r.start,
					duration,
				};
			});

			return stationHistory;
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
			const { name, email, password } = data;

			const findedUser = await userDataBase.findByEmail(email);
			if (findedUser)
				throw erro.notFound("There is already a registered user with this email");

			const hashPassword = bcrypt.hashSync(password, 10);
			const createdUser = await userDataBase.create(name, email, hashPassword);

			return createdUser;
		},

		async login(_: any, { data }) {
			const { email, password } = data;

			const findedUser = await userDataBase.findByEmail(email);
			if (!findedUser) throw erro.notFound("Not found a user com this email");

			const isPasswordValid = bcrypt.compareSync(password, findedUser.password);
			if (!isPasswordValid) throw erro.forbidden("Invalid password");

			const token = jwt.sign({ user: findedUser }, process.env.JWT_SECRET);
			return token;
		},

		async recharge(_: any, { data }, context) {
			const userId = validateTokenAndReturnUserId(context.token);
			const now = dayjs().toDate();
			const rechargeEnd = dayjs(data.date).toDate();

			if (data.reservationId) {
				const { stationId, end, start } = await reservationsDataBase.findById(
					data.reservationId
				);

				if (now.valueOf() < start.valueOf())
					throw erro.forbidden("Booking time is not valid yet");

				await rechargeService.verifyStationAvailable(stationId);
				await rechargeService.verifyUserAvailable(userId);
				await reservationsService.verifyTimeAvailable(now, rechargeEnd, stationId);

				const newRecharge = rechargeDataBase.create(stationId, end, userId);
				return newRecharge;
			}

			await dateService.validateIsAfet(_, rechargeEnd);

			const station = await stationService.findStationOrThowErro(data.stationName);
			await rechargeService.verifyStationAvailable(station.id);
			await rechargeService.verifyUserAvailable(userId);
			await reservationsService.verifyTimeAvailable(now, rechargeEnd, station.id);

			const newRecharge = rechargeDataBase.create(station.id, rechargeEnd, userId);
			return newRecharge;
		},

		async reservation(_: any, { data }, context) {
			const userId = validateTokenAndReturnUserId(context.token);
			const start = dayjs(data.start).toDate();
			const end = dayjs(data.end).toDate();

			await dateService.validateIsAfet(start, end);

			const station = await stationService.findStationOrThowErro(data.stationName);
			console.log(station);
			// await rechargeService.verifyStationAvailable(station.id);
			// await rechargeService.verifyUserAvailable(userId);

			await reservationsService.verifyTimeAvailable(start, end, station.id);

			const reservation = await reservationsDataBase.create(
				station.id,
				userId,
				start,
				end
			);
			return reservation;
		},
	},
};

export default resolvers;
