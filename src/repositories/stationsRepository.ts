import db from "../dataBase.js";

export async function getAll() {
	const stations = await db.stations.findMany();
	return stations;
}

export async function create(name: string, planet: string, planetId: number) {
	const createdStation = await db.stations.create({
		data: { name, planet, planetId },
	});
	return createdStation;
}

export async function findByName(name: string) {
	const station = await db.stations.findFirst({
		where: { name },
	});
	return station;
}

export async function findLast(stationId: number) {
	const station = await db.recharges.findFirst({
		where: { stationId },
		orderBy: { id: "desc" },
	});
	return station;
}
