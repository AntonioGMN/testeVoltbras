import * as rechargeDataBase from "../repositories/rechargeRepository.js";
import * as erro from "../utils/erro.js";
import dayjs from "dayjs";

export async function verifyStationAvailable(stationId: number) {
	const stationLastRecharge = await rechargeDataBase.findLastByStationId(
		stationId
	);
	if (stationLastRecharge)
		if (!dayjs().isAfter(stationLastRecharge.end))
			throw erro.forbidden("This station is already doing a recharge");
}

export async function verifyUserAvailable(userId: number) {
	const userLastRecharge = await rechargeDataBase.findLastByUserId(userId);
	if (userLastRecharge)
		if (!dayjs().isAfter(userLastRecharge.end))
			throw erro.forbidden("This user is already doing a recharge");
}
