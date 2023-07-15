import type { JestConfigWithTsJest } from "ts-jest"
import { pathsToModuleNameMapper } from "ts-jest"
import { compilerOptions } from "./tsconfig.json"

const jestConfig: JestConfigWithTsJest = {
  preset:           "ts-jest",
  roots:            ["<rootDir>"],
  modulePaths:      [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { useESM: true })
};

export default jestConfig;
