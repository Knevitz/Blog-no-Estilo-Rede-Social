import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/src/config/", "/src/tests/"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  setupFiles: ["dotenv/config"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globalSetup: "./src/tests/setup.ts",
  globalTeardown: "./src/tests/teardown.ts",
};

export default config;
