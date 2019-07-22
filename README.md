# GeneMO - Genetic Algorithm Library
[![Build Status](https://travis-ci.org/lukix/genemo.svg?branch=master)](https://travis-ci.org/lukix/genemo) [![Coverage Status](https://coveralls.io/repos/github/lukix/genemo/badge.svg?branch=master)](https://coveralls.io/github/lukix/genemo?branch=master) [![npm version](https://badge.fury.io/js/genemo.svg)](https://badge.fury.io/js/genemo) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

Simple to use genetic algorithm library with many predefined operators. Supports both NodeJS and web browsers.

## Installation
```bash
npm i genemo
```

## Getting Started
To start a genetic algorithm use this function:
```javascript
Genemo.run(options).then(result => {
  // ...
});
```
`options` is an object which specifies genetic operators (functions) used in a genetic algorithm.
The table below describes all properties you need to pass with `options` object.
All options are required, but for most of them you can use an existing function from the library.
Meaning of types *Rng*, *Population*, *EvaluatedPopulation* and *Individual* is described later in this document.

| Property                    | Signature                                          | Description                                                |
|-----------------------------|----------------------------------------------------|------------------------------------------------------------|
| `generateInitialPopulation` | `(Rng) => Population`                                 | Generates initial population of individuals (chromosomes). |
| `selection`                 | `(EvaluatedPopulation, Rng) => EvaluatedPopulation`   | Selects individuals for breeding.                          |
| `reproduce`                 | `(EvaluatedPopulation, Rng, collectLog) => Population`| Creates new population from the selected individuals.      |
| `evaluatePopulation`        | `(Population, Rng) => Array<number`>         | Maps an array of individuals to an array of fitness values.                      |
| `stopCondition`             | `({ evaluatedPopulation, iteration }, Rng) => boolean` | Returning `true` terminates the algorithm.                  |
| `succession`                | `({ prevPopulation, childrenPopulation }, Rng) => EvaluatedPopulation` | **Optional**. Creates a new population based on previous (evaluated) population and current (also evaluated) children population (result of `reproduce` function).                  |
| `iterationCallback`         | `({ evaluatedPopulation, iteration, logs }) => undefined` | **Optional**. Callback, which is called in every iteration.                 |
| `random`                | `() => number` | **Optional**. Custom random number generator. Should return values between 0 and 1 (inclusive of 0, but not 1). If not provided, `Math.random` will be used.                 |
| `maxBlockingTime`                | `number` | **Optional**. Time in milliseconds, after which the next iteration is called asynchronously (as a macrotask). Defaults to `Infinity`, which means that macrotasks are never used by default.               |
| `collectLogs`                | `boolean` | **Optional**. Indicates if the logs about performance should be collected. Default value is `true`.     |

`Genemo.run` returns a promise, which resolves to an object `{ evaluatedPopulation: EvaluatedPopulation, iteration: number }`, which contains information about the population (along with fitness values) from the last iteration and the last iteration number.

### Types
When reading this documentation, you will encounter the following types:

| Type                  | Translates to                                       | Description                                                    |
|-----------------------|-----------------------------------------------------|----------------------------------------------------------------|
| `Individual`          | `Any`                                               | Represents a single individual/chromosome.                     |
| `Population`          | `Array<Individual>`                                 | Array of individuals makes a population.                       |
| `EvaluatedPopulation` | `Array<{ fitness: number, indvidual: Individual }>` | Array of objects containing an `individual` and its `fitness`. |
| `Rng` | `() => number` | Function, which returns random values between 0 and 1 (inclusive of 0, but not 1). |

### Example usage
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

### Browser example
Example of using Genemo in browser environment without blocking browser's main thread can be seen in [genemo-web-demo](https://github.com/lukix/genemo-web-demo) repository.

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

## Predefined operators/functions
### General
- **`Genemo.generateInitialPopulation({ generateIndividual, size })`**

    Returns a function with a signature matching that of `generateInitialPopulation` property of `Genemo.run` options object. Parameter `generateIndividual` should be a function which takes one parameter (random number generator) and returns a random individual.

- **`Genemo.evaluatePopulation({ fitnessFunction })`**

    Returns a function with a signature matching that of `evaluatePopulation` property of `Genemo.run` options object. Parameter `fitnessFunction` should be a function which takes an individual as a parameter and returns its fitness (as a number).

- **`Genemo.reproduce({ crossover, mutate, mutationProbability })`**

    Returns a function with a signature matching that of `reproduce` property of `Genemo.run` options object.
    It runs all crossovers with `Promise.all` and then all mutations with another `Promise.all`.

    `crossover` - `([Individual, Individual], Rng) => [Individual, Individual]` - takes a pair of parents and a random number generator and returns a pair of children.

    `mutate` - `(Individual, Rng) => Individual` - maps an individual to a new individual modified by mutation.

    `mutationProbability` - `number` - mutation probability for a single individual. Defaults to `0.01`.

- **`Genemo.stopCondition({ minFitness, maxFitness, maxIterations })`**

    Returns a function with a signature matching that of `stopCondition` property of `Genemo.run` options object. Use `minFitness` for maximization problems and `maxFitness` for minimization.

- **`Genemo.logIterationData({ include, customLogger })`**

    Returns a function with a signature matching that of `iterationCallback` property of `Genemo.run` options object. `customLogger` is optional - its default value is a `console.log` function. `include` is an object, which specifies values that should be included in each log:
    ```
    {
      iteration = { show: false, formatter: iterationFormatter },
      minFitness = { show: false, formatter: fitnessFormatter },
      maxFitness = { show: false, formatter: fitnessFormatter },
      avgFitness = { show: false, formatter: fitnessFormatter },
      logsKeys = []
    }
    ```
    `logsKeys` should be an array of objects. Each object have a `key` property, which specifies which values from `logs` object should be logged.
    `fotmatter` is an optional property, which specifies a function for formating data `(key, value) => string`.

    Available keys from `Genemo.run`: `lastIteration`, `selection`, `reproduce`, `fitness`, `succession`, `stopCondition`, `iterationCallback`.

    Available keys from `Genemo.reproduce`: `reproduce.crossover`, `reproduce.mutation`.

### Selection
- **`Genemo.selection.roulette({ minimizeFitness })`**

    Returns a function that can be used as a `selection` parameter for `Genemo.run`.
    `minimizeFitness` is a boolean value indicating if we are aiming at minimizing or maximizing fitness. Defaults to `false`.

- **`Genemo.selection.rank({ minimizeFitness })`**

    Returns a function that can be used as a `selection` parameter for `Genemo.run`.
    `minimizeFitness` is a boolean value indicating if we are aiming at minimizing or maximizing fitness.

- **`Genemo.selection.tournament({ size, minimizeFitness })`**

    Returns a function that can be used as a `selection` parameter for `Genemo.run`.
    `size` is a number describing how many individuals take part in a tournament.
    `minimizeFitness` is a boolean value indicating if we are aiming at minimizing or maximizing fitness.

### Crossover
- **`Genemo.crossover.singlePoint`**

    Function that can be used as a `crossover` parameter for `Genemo.reproduce`.

- **`Genemo.crossover.twoPoint`**

    Function that can be used as a `crossover` parameter for `Genemo.reproduce`.

- **`Genemo.crossover.kPoint(k)`**

    **Returns** a function that can be used as a `crossover` parameter for `Genemo.reproduce`.

- **`Genemo.crossover.orderOne`**

    **Returns** a function that can be used as a `crossover` parameter for `Genemo.reproduce`.

- **`Genemo.crossover.PMX`**

    Partially-mapped crossover.
    **Returns** a function that can be used as a `crossover` parameter for `Genemo.reproduce`.

- **`Genemo.crossover.uniform`**

    Uniform crossover.
    Function that can be used as a `crossover` parameter for `Genemo.reproduce`.
    Offsprings are created by selecting each gene from one of the parents with equal probability.

### Mutation
- **`Genemo.mutation.transformRandomGene(transformFunc)`**

    Returns a function that can be used as a `mutation` parameter for `Genemo.run`.
    `transformFunc(gene, random)` is a function, which takes a single gene and a random number generator and returns a new gene.

- **`Genemo.mutation.flipBit`**

    Function that can be used as an argument for `Genemo.mutation.transformRandomGene`.

- **`Genemo.mutation.swapTwoGenes`**

    Swaps places of two randomly chosen genes (array elements).
    This function can be used as an argument for `Genemo.mutation.transformRandomGene`.

### Elitism
- **`Genemo.elitism({ keepFactor, minimizeFitness })`**

    Returns a function that can be used as a `succession` parameter for `Genemo.run`.
    `keepFactor` is a number from 0 to 1 describing what part of best individuals should be kept unchanged.
    `minimizeFitness` is a boolean value indicating if we are aiming at minimizing or maximizing fitness.

### Other useful functions
- **`Genemo.randomSequenceOf(valuesSet, length)`**

    Returns a function which takes a random number generator and returns an array of random elements from `valuesSet` of length equal to `length`. Returned function can be used as a `generateIndividual` parameter for `Genemo.generateInitialPopulation`.

- **`Genemo.randomPermutationOf(valuesSet)`**

    Returns a function which takes a random number generator and returns a random permutation of elements from `valuesSet`. Returned function can be used as a `generateIndividual` parameter for `Genemo.generateInitialPopulation`.

## How to contribute
Just do it! If you want to reassure yourself that your code will be merged,
you can contact me on Twitter ([@lukaszjenczmyk](https://twitter.com/lukaszjenczmyk)) before starting the work.
If you would like to contribute to this project, but you don't know what to work on, feel free to contact me as well.
Linter and tests are configured to run on the CI (and locally with [Husky](https://github.com/typicode/husky)). I appreciate your help :heart:
