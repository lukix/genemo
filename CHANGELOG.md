# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.5.1 - 2019-06-19
### Fixed
 - Fixed vulnerabilities in dependencies.
 - Fixed description of `Genemo.reproduce` - added missing `Rng` param to `mutate` callback.

## 0.5.0 - 2019-03-07
### Added
 - Added `iterationCallback` option to `Genemo.runEvolution` and `Genemo.runEvolutionAsync`.
 - Added `Genemo.logIterationData` function.

## 0.4.0 - 2019-02-27
### Added
 - Added `Genemo.runEvolutionAsync` function.
 - Added `Genemo.reproduceAsync` function.

## 0.3.3 - 2018-11-23
### Added
 - More detailed docs for `Genemo.reproduce` function.
 - License badge in README.

## 0.3.2 - 2018-11-18
### Fixed
 - Fixed duplicated mutation in `Genemo.reproduce` function.

### Added
 - More tests.
 - Checking test coverage before pushing commits - required 100% coverage.
 - Running tests with Travis CI.

## 0.3.1 - 2018-11-17
### Fixed
 - Fixed error in `Genemo.crossover.kPoint(k)` function.

### Added
 - Tests for `Genemo.crossover.kPoint(k)` function.

## 0.3.0 - 2018-11-11
### Added
 - Rank Selection - `Genemo.selection.rank({ minimizeFitness })`.
 - Keywords in `package.json`.
 - `CHANGELOG.md` file.

### Changed
- Example 2 (Traveling Salesman Problem) is now using Rank Selection instead of Tournament Selection.

## 0.2.0 - 2018-11-10
First public release.
