# GeneMO - Genetic Algorithm Library
[![Build Status](https://travis-ci.org/lukix/genemo.svg?branch=master)](https://travis-ci.org/lukix/genemo) [![Coverage Status](https://coveralls.io/repos/github/lukix/genemo/badge.svg?branch=master)](https://coveralls.io/github/lukix/genemo?branch=master) [![npm version](https://badge.fury.io/js/genemo.svg)](https://badge.fury.io/js/genemo) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

Simple to use genetic algorithm library with many predefined operators. Supports both NodeJS and web browsers.

#### Table of Contents
[Installation](#installation)<br />
[Example Usage](#example-usage)<br />
[Getting Started](#getting-started)<br />
[API Reference](#api-reference)<br />
[How To Contribute](#how-to-contribute)<br />

## Installation
```bash
npm i genemo
```

## Example Usage
Full examples with comments can be found in the `./examples` directory. Here is a shorter version:
```javascript
Genemo.run({
  generateInitialPopulation: Genemo.generateInitialPopulation({
    generateIndividual, // Here, provide a function which generates an individual
    size: 200,
  }),
  selection: Genemo.selection.roulette(),
  reproduce: Genemo.reproduce({
    crossover: Genemo.crossover.singlePoint,
    mutate: Genemo.mutation.transformRandomGene(Genemo.mutation.flipBit),
    mutationProbability: 0.02,
  }),
  evaluatePopulation: Genemo.evaluatePopulation({ fitnessFunction }), // You need to provide your own fitness function
  stopCondition: Genemo.stopCondition({ maxIterations: 100 }),
}).then(({ evaluatedPopulation, iteration }) => {
  // ...
});
```

Example of using GeneMO in the browser environment without blocking browser's main thread can be found in [genemo-web-demo](https://github.com/lukix/genemo-web-demo) repository.

## Getting Started
To start a genetic algorithm use `Genemo.run` function:
```javascript
Genemo.run(options).then(result => {
  // ...
});
```
`options` is an object which specifies genetic operators (functions) used in a genetic algorithm.
All the properties you can pass in the `options` object are described below.
Meaning of types *Rng*, *Population*, *EvaluatedPopulation* and *Individual* is described later in this document.

- **`generateInitialPopulation`** - Generates initial population of individuals (chromosomes).<br />
**Type**: `(Rng) => Population`<br />
**Required**: Yes<br />
**Available values**: [`Genemo.generateInitialPopulation()`]()

- **`selection`** - Selects individuals for breeding.<br />
**Type**: `(EvaluatedPopulation, Rng) => EvaluatedPopulation`<br />
**Required**: Yes<br />
**Available values**: [`Genemo.selection.tournament()`](), [`Genemo.selection.rank()`](), [`Genemo.selection.roulette()`]()

- **`reproduce`** - Creates new population from the selected individuals.<br />
**Type**: `(EvaluatedPopulation, Rng, collectLog) => Population`<br />
**Required**: Yes<br />
**Available values**: [`Genemo.reproduce()`]()

- **`evaluatePopulation`** - Maps an array of individuals to an array of fitness values.<br />
**Type**: `(Population, Rng) => Array<number>`<br />
**Required**: Yes<br />
**Available values**: [`Genemo.evaluatePopulation()`]()

- **`stopCondition`** - Returning `true` terminates the algorithm.<br />
**Type**: `({ evaluatedPopulation, iteration }, Rng) => boolean`<br />
**Required**: Yes<br />
**Available values**: [`Genemo.stopCondition()`]()

- **`succession`** -  Creates a new population based on previous (evaluated) population and current (also evaluated) children population (result of `reproduce` function).<br />
**Type**: `({ prevPopulation, childrenPopulation }, Rng) => EvaluatedPopulation`<br />
**Required**: No<br />
**Default:** `({ childrenPopulation }) => childrenPopulation`<br />
**Available values**: [`Genemo.elitism()`]()

- **`iterationCallback`** - Callback, which is called in every iteration.<br />
**Type**: `({ evaluatedPopulation, iteration, logs }) => undefined`<br />
**Required**: No<br />
**Default:** `() => {}`<br />
**Available values**: [`Genemo.logIterationData()`]()

- **`random`** - Custom random number generator. Should return values between 0 and 1 (inclusive of 0, but not 1).<br />
**Type**: `() => number`<br />
**Required**: No<br />
**Default:** `Math.random`<br />

- **`maxBlockingTime`** - Time in milliseconds, after which the next iteration is called asynchronously (as a macrotask).<br />
**Type**: `number`<br />
**Required**: No<br />
**Default:** `Infinity`<br />

- **`collectLogs`** - Indicates if the logs about performance should be collected.<br />
**Type**: `boolean`<br />
**Required**: No<br />
**Default:** `true`<br />

`Genemo.run` returns a promise, which resolves to an object `{ evaluatedPopulation: EvaluatedPopulation, iteration: number }`, which contains information about the population (along with fitness values) from the last iteration and the last iteration number.

### Types
When reading this documentation, you will encounter the following types:

| Type                  | Translates to                                       | Description                                                    |
|-----------------------|-----------------------------------------------------|----------------------------------------------------------------|
| `Individual`          | `Any`                                               | Represents a single individual/chromosome.                     |
| `Population`          | `Array<Individual>`                                 | Array of individuals makes a population.                       |
| `EvaluatedPopulation` | `Array<{ fitness: number, indvidual: Individual }>` | Array of objects containing an `individual` and its `fitness`. |
| `Rng` | `() => number` | Function, which returns random values between 0 and 1 (inclusive of 0, but not 1). |

### Asynchronous execution
Each function passed to `Genemo.run` (`selection`, `reproduce`, `fitness`, etc.) can return a `Promise` (synchronous functions work as well).
From time to time `Genemo.run` runs next iteration asynchronously to avoid blocking browser's main thread.
However, if a single iteration takes too long to complete, it will still block the main thread.
To control the frequency of asynchronous iteration executions, use `maxBlockingTime` option.
```javascript
Genemo.run(options).then(result => {
  // ...
});
```

## API Reference

GeneMO exports a `Genemo` object with properties listed in the hierarchy below.<br />
Full description of each property can be found in [API.md](./API.md).

- `Genemo`
  - `run`
  - `generateInitialPopulation`
  - `evaluatePopulation`
  - `reproduce`
  - `stopCondition`
  - `logIterationData`
  - `randomSequenceOf`
  - `randomPermutationOf`
  - `selection`
    - `roulette`
    - `rank`
    - `tournament`
  - `crossover`
    - `singlePoint`
    - `twoPoint`
    - `kPoint`
    - `orderOne`
    - `PMX`
    - `uniform`
  - `mutation`
    - `transformRandomGene`
    - `flipBit`
    - `swapTwoGenes`
  -  `elitism`

## How To Contribute
Just do it! If you want to reassure yourself that your code will be merged,
you can contact me on Twitter ([@lukaszjenczmyk](https://twitter.com/lukaszjenczmyk)) before starting the work.
If you would like to contribute to this project, but you don't know what to work on, feel free to contact me as well.
Linter and tests are configured to run on the CI (and locally with [Husky](https://github.com/typicode/husky)). I appreciate your help :heart:
