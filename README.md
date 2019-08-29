# GeneMO - Genetic Algorithm Library
[![Build Status](https://travis-ci.org/lukix/genemo.svg?branch=master)](https://travis-ci.org/lukix/genemo) [![Coverage Status](https://coveralls.io/repos/github/lukix/genemo/badge.svg?branch=master)](https://coveralls.io/github/lukix/genemo?branch=master) [![npm version](https://badge.fury.io/js/genemo.svg)](https://badge.fury.io/js/genemo) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

Simple to use genetic algorithm library. It enables fast prototyping by providing a number of universal genetic operators (for selection, crossover, mutation, etc.) and easy customization. Supports both NodeJS and web browsers.

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
Full examples with comments can be found in the [`./examples`](./examples) directory. Here is a shorter version:
```javascript
const Genemo = require('genemo');

Genemo.run({
  generateInitialPopulation: Genemo.generateInitialPopulation({
    generateIndividual, // Here, provide a function which generates an individual
    size: 200,
  }),
  selection: Genemo.selection.roulette({ minimizeFitness: false }),
  reproduce: Genemo.reproduce({
    crossover: Genemo.crossover.singlePoint(),
    mutate: Genemo.mutation.transformRandomGene(Genemo.mutation.flipBit()),
    mutationProbability: 0.02,
  }),
  evaluatePopulation: Genemo.evaluatePopulation({ fitnessFunction }), // You need to provide your own fitness function
  stopCondition: Genemo.stopCondition({ maxIterations: 100 }),
}).then(({ evaluatedPopulation }) => {
  // ...
});
```

Example of using GeneMO in the browser environment without blocking browser's main thread can be found in [genemo-web-demo](https://github.com/lukix/genemo-web-demo) repository.

## Getting Started
A single most important element of GeneMO library is a [`Genemo.run`](./API.md#genemorunoptions) function.
It runs a genetic algorithm by executing a number of user-specified functions, like for example:
generation of initial population, selection, fitness function, etc.

By providing a rich collection of universal genetic operators, GeneMO lets you build an initial
version of your genetic algorithm very quickly. Then you can refine your program by gradually
replacing GeneMO's universal genetic operators with custom, problem specific operators.

Usually, it is enough to implement a custom function for generating random individual/solution
and a fitness function. Rest of the required functions can be taken from the GeneMO library.
However, keep in mind that problem specific operators usually give better results.

Read [API Reference](#api-reference) for detailed description of all the options required by [`Genemo.run`](./API.md#genemorunoptions).<br />
See [Example Usage](#example-usage) to quickly get familiar with basic usage of GeneMO.

```javascript
Genemo.run(options).then(result => {
  // ...
});
```

[`Genemo.run`](./API.md#genemorunoptions) returns a promise, which resolves to an object:
```
{ evaluatedPopulation: EvaluatedPopulation, iteration: number, logs: object }
```
It contains information about the population (along with fitness values) from the final iteration, number of iterations and an object with logs (mostly with performance data).

### Asynchronous execution
Each function passed to [`Genemo.run`](./API.md#genemorunoptions) (`selection`, `reproduce`, `fitness`, etc.) can return a `Promise` (synchronous functions work as well).
From time to time [`Genemo.run`](./API.md#genemorunoptions) runs next iteration asynchronously to avoid blocking browser's main thread.
However, if a single iteration takes too long to complete, it will still block the main thread.
To control the frequency of asynchronous iteration executions, use `maxBlockingTime` option.

## API Reference
GeneMO exports a `Genemo` object with properties listed in the hierarchy below.<br />
Full description of each property can be found in [API.md](./API.md).

- `Genemo`
  - [`run`](./API.md#genemorunoptions)
  - [`generateInitialPopulation`](./API.md#genemogenerateinitialpopulation-generateindividual-size-)
  - [`evaluatePopulation`](./API.md#genemoevaluatepopulation-fitnessfunction-)
  - [`reproduce`](./API.md#genemoreproduce-crossover-mutate-mutationprobability-)
  - [`stopCondition`](./API.md#genemostopcondition-minfitness-maxfitness-maxiterations-)
  - [`logIterationData`](./API.md#genemologiterationdata-include-customlogger-)
  - [`randomSequenceOf`](./API.md#genemorandomsequenceofvaluesset-length)
  - [`randomPermutationOf`](./API.md#genemorandompermutationofvaluesset)
  - [`elitism`](./API.md#genemoelitism-keepfactor-minimizefitness-)
  - `selection`
    - [`roulette`](./API.md#genemoselectionroulette-minimizefitness-)
    - [`rank`](./API.md#genemoselectionrank-minimizefitness-)
    - [`tournament`](./API.md#genemoselectiontournament-size-minimizefitness-)
  - `crossover`
    - [`singlePoint`](./API.md#genemocrossoversinglepoint)
    - [`twoPoint`](./API.md#genemocrossovertwopoint)
    - [`kPoint`](./API.md#genemocrossoverkpointk)
    - [`orderOne`](./API.md#genemocrossoverorderone)
    - [`PMX`](./API.md#genemocrossoverpmx)
    - [`uniform`](./API.md#genemocrossoveruniform)
    - [`edgeRecombination`](./API.md#genemocrossoveredgerecombination-hashgene-)
  - `mutation`
    - [`transformRandomGene`](./API.md#genemomutationtransformrandomgenetransformfunc)
    - [`flipBit`](./API.md#genemomutationflipbit)
    - [`swapTwoGenes`](./API.md#genemomutationswaptwogenes)

## How To Contribute
If you found a bug, you have a feature request, or you just have a question, please open a new issue on Github.
You can also contact me on Twitter ([@lukaszjenczmyk](https://twitter.com/lukaszjenczmyk)).
Linter and tests are configured to run on the CI (and locally with [Husky](https://github.com/typicode/husky)). I appreciate your input :heart:
