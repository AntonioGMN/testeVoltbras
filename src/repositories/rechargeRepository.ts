import db from "../dataBase.js";

export async function findLastByStationId(stationId: number) {
	const recharge = await db.recharges.findFirst({
		where: { stationId },
		orderBy: { id: "desc" },
	});
	return recharge;
}

export async function findLastByUserId(userId: number) {
	const recharge = await db.recharges.findFirst({
		where: { userId },
		orderBy: { id: "desc" },
	});
	return recharge;
}

export async function create(stationId: number, end: Date, userId: number) {
	const recharge = await db.recharges.create({
		data: { stationId, end, userId },
	});
	return recharge;
}
