import db from "../dataBase.js";

export async function upsert(name: string, mass: number) {
	await db.planets.upsert({
		where: { name: name },
		update: {},
		create: {
			name: name,
			mass: mass,
		},
	});
}

export async function findByName(name: string) {
	const planet = await db.planets.findFirst({
		where: {
			name,
		},
	});
	return planet;
}

export async function updateHasStationTrue(planteId: number) {
	await db.planets.update({
		where: {
			id: planteId,
		},
		data: {
			hasStation: true,
		},
	});
	return;
}
