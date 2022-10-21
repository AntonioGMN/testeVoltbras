import * as erro from "../utils/erro.js";
import dayjs from "dayjs";

export async function validateIsAfet(start: Date | any, end: Date) {
	if (!start) {
		if (dayjs().isAfter(end))
			throw erro.forbidden(
				"Date is invalid. You need to pass a date greater than the current date"
			);
	}

	if (dayjs(start).isAfter(end))
		throw erro.forbidden(
			"Date is invalid. You need to pass a date end greater than the date start"
		);

	return;
}
