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

`Genemo.run` returns a promise, which resolves to an object `{ evaluatedPopulation: EvaluatedPopulation, iteration: number, logs: object }`, which contains information about the population (along with fitness values) from the last iteration, last iteration number and object with logs.

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
  - [`run`](./API.md#genemo-run-options)
  - [`generateInitialPopulation`](./API.md#genemo-generateinitialpopulation-generateindividual-size)
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
