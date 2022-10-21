import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	extensionsToTreatAsEsm: [".ts"],
	globals: {
		"ts-jest": {
			useESM: true,
		},
	},

	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
};

export default config;

// export default {
// 	preset: "ts-jest",
// 	testEnvironment: "ts-node",
// 	extensionsToTreatAsEsm: [".ts"],
// 	globals: {
// 		"ts-jest": {
// 			useESM: true,
// 		},
// 	},
// 	moduleNameMapper: {
// 		"^(\\.{1,2}/.*)\\.js$": "$1",
// 	},
// };
