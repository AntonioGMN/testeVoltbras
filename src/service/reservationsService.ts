import * as reservationsRepository from "../repositories/reservationsRepository.js";
import dayjs from "dayjs";
import * as erro from "../utils/erro.js";

export async function verifyTimeAvailable(
	start: Date,
	end: Date,
	stationId: number
) {
	const reservations = await reservationsRepository.getAllByStationId(stationId);

	const invalid = await reservations.some((r) => {
		const rangeInit = dayjs(r.start).valueOf();
		const rangeEnd = dayjs(r.end).valueOf();

		const condition1 =
			rangeInit <= dayjs(start).valueOf() && dayjs(start).valueOf() <= rangeEnd;
		const condition2 =
			rangeInit <= dayjs(end).valueOf() && dayjs(end).valueOf() <= rangeEnd;

		return condition1 || condition2;
	});

	if (invalid)
		throw erro.forbidden("Date is invalid.This time period is not available");
	return;
}
