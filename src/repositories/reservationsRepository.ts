import db from "../dataBase.js";

export async function create(
	stationId: number,
	userId: number,
	start: Date,
	end: Date
) {
	const reservation = await db.reservations.create({
		data: { stationId, userId, start, end },
	});
	return reservation;
}

export async function getAllByStationId(stationId: number) {
	const reservations = await db.reservations.findMany({
		where: { stationId },
	});
	return reservations;
}

export async function findById(id: number) {
	const reservation = await db.reservations.findFirst({
		where: { id },
	});
	return reservation;
}
