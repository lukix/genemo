# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.0 - Not Released
- Migrated codebase to TypeScript and added typings.
- Removed run-time type checking.
- Fixed empty links in `API.md`.

## 1.3.0 - 2019-09-12
- Added `Genemo.reproduceBatch` function to make implementation of multithreading easier.
- Added an example of implementing multithreading for genetic algorithm.

## 1.2.2 - 2019-08-29
- Updated dependencies and README.
- Removed unnecessary package `babel-core` from dependencies.

## 1.2.1 - 2019-08-28
- Fixed vulnerability in dev dependencies caused by `eslint-utils` package.

## 1.2.0 - 2019-08-17
- Added `getLowestFitnessIndividual` and `getHighestFitnessIndividual` functions to `Genemo.run` result.

## 1.1.0 - 2019-08-02
- Added `Genemo.crossover.edgeRecombination` function.
- Added type checking to `elitism`, `evaluatePopulation`, `generateInitialPopulation`, `stopCondition` and all selection functions.

## 1.0.1 - 2019-07-27
- Fixed incorrect use of crossover and mutation functions in "Example Usage" section of README.

## 1.0.0 - 2019-07-26
- Replaced `runEvolution`, `runEvolutionAsync` and `getGenerationsIterator` with `Genemo.run`.
- Removed `Genemo.reproduceAsync` function.
- Replaced `fitness` option from runner with `evaluatePopulation` option.
- Added `maxBlockingTime` param to the runner function (`Genemo.run`).
- Added `Genemo.evaluatePopulation` function.
- Added passing `collectLog` function to `Genemo.reproduce` as the 3rd argument.
- Changed `Genemo.logIterationData` API.
- Renamed `debugData` key to `logs` in `iterationCallback`.
- Added `collectLogs` param to the runner function (`Genemo.run`).
- Changed all crossover and mutation functions to higher-order functions (for consistency).
- Remove default value for `minimizeFitness` properties.
- Add checking for not allowed props.

## 0.7.0 - 2019-07-18
- Added `maxBlockingTime` option to `Genemo.runEvolutionAsync`.
- Fixed `setImmediate` fallback code.

## 0.6.0 - 2019-07-12
- Added Uniform Crossover - `Genemo.crossover.uniform`.
- Fixed `Maximum call stack size exceeded` error when working with big populations (~130k individuals).

## 0.5.4 - 2019-07-06
- Added `.npmignore` file to reduce package size.
- Changed Travis config to deploy when git tag is added.

## 0.5.3 - 2019-07-05
- Added link to browser example to README.
- Added "How to contribute" section to README.
- Flattened the structure of CHANGELOG file to be more readable.
- Changed keywords in package.json.

## 0.5.2 - 2019-06-20
 - Add support for web browsers by removing `Joi` from dependencies.

## 0.5.1 - 2019-06-19
 - Fixed vulnerabilities in dependencies.
 - Fixed description of `Genemo.reproduce` - added missing `Rng` param to `mutate` callback.

## 0.5.0 - 2019-03-07
 - Added `iterationCallback` option to `Genemo.runEvolution` and `Genemo.runEvolutionAsync`.
 - Added `Genemo.logIterationData` function.

## 0.4.0 - 2019-02-27
 - Added `Genemo.runEvolutionAsync` function.
 - Added `Genemo.reproduceAsync` function.

## 0.3.3 - 2018-11-23
 - Added more detailed docs for `Genemo.reproduce` function.
 - Added license badge in README.

## 0.3.2 - 2018-11-18
 - Fixed duplicated mutation in `Genemo.reproduce` function.
 - Added more tests.
 - Added checking test coverage before pushing commits - required 100% coverage.
 - Added running tests with Travis CI.

## 0.3.1 - 2018-11-17
 - Fixed error in `Genemo.crossover.kPoint(k)` function.
 - Added tests for `Genemo.crossover.kPoint(k)` function.

## 0.3.0 - 2018-11-11
 - Added Rank Selection - `Genemo.selection.rank({ minimizeFitness })`.
 - Added keywords in `package.json`.
 - Added `CHANGELOG.md` file.
- Example 2 (Traveling Salesman Problem) is now using Rank Selection instead of Tournament Selection.

## 0.2.0 - 2018-11-10
First public release.
