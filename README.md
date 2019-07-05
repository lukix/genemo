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
const result = Genemo.runEvolution(options);
```
`options` is an object which specifies genetic operators (functions) used in a genetic algorithm.
The table below describes all properties you need to pass with `options` object.
All options are required, but for most of them you can use an existing function from the library.
Meaning of types *Rng*, *Population*, *EvaluatedPopulation* and *Individual* is described later in this document.

| Property                    | Signature                                          | Description                                                |
|-----------------------------|----------------------------------------------------|------------------------------------------------------------|
| `generateInitialPopulation` | `(Rng) => Population`                                 | Generates initial population of individuals (chromosomes). |
| `selection`                 | `(EvaluatedPopulation, Rng) => EvaluatedPopulation`     | Selects individuals for breeding.                          |
| `reproduce`                 | `(EvaluatedPopulation, Rng) => Population`              | Creates new population from the selected individuals.      |
| `fitness`                   | `(Individual) => number`                           | Evaluates an individual (chromosome).                      |
| `stopCondition`             | `({ evaluatedPopulation, generation }, Rng) => boolean` | Returning `true` terminates the algorithm.                  |
| `succession`                | `({ prevPopulation, childrenPopulation }, Rng) => EvaluatedPopulation` | **Optional**. Creates a new population based on previous (evaluated) population and current (also evaluated) children population (result of `reproduce` function).                  |
| `iterationCallback`         | `({ evaluatedPopulation, generation, debugData }) => undefined` | **Optional**. Callback, which is called in every iteration/generation.                 |
| `random`                | `() => number` | **Optional**. Custom random number generator. Should return values between 0 and 1 (inclusive of 0, but not 1). If not provided, `Math.random` will be used.                 |

`Genemo.runEvolution` returns an object `{ evaluatedPopulation: EvaluatedPopulation, generation: number }`, which contains information about a population (along with fitness values) from the last generation and a number of the last generation.

If you need more control over execution of the algorithm, you can use *generator* `Genemo.getGenerationsIterator`.

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
const { evaluatedPopulation, generation } = Genemo.runEvolution({
  generateInitialPopulation: Genemo.generateInitialPopulation({
    generateIndividual, // Here, provide a function which generates an individual
    size: 500,
  }),
  selection: Genemo.selection.roulette(),
  reproduce: Genemo.reproduce({
    crossover: Genemo.crossover.singlePoint,
    mutate: Genemo.mutation.transformRandomGene(Genemo.mutation.flipBit),
    mutationProbability: 0.01,
  }),
  fitness: fitnessFunction, // You need to provide your own fitness function
  stopCondition: Genemo.stopCondition({ minFitness: 50, maxGenerations: 1000 }),
});
```

### Browser example
Example of using Genemo in browser environment without blocking browser's main thread can be seen in [genemo-web-demo](https://github.com/lukix/genemo-web-demo) repository.

### Asynchronous execution
To run the program in a non-blocking way you can use `Genemo.runEvolutionAsync` instead of `Genemo.runEvolution`. Both of these functions take the same parameters,
but with one significant difference: each function passed to `runEvolutionAsync` (`selection`, `reproduce`, `fitness`, etc.) can return a `Promise` (synchronous functions work as well). Note that `Genemo.runEvolutionAsync` runs each generation asynchronously, so if a single generation takes too long to complete, it will still block the main thread noticeably.
```javascript
Genemo.runEvolutionAsync(options).then(result => {
  // ...
});
```

## Predefined operators/functions
### General
- **`Genemo.generateInitialPopulation({ generateIndividual, size })`**

    Returns a function with a signature matching that of `generateInitialPopulation` property of `Genemo.runEvolution` options object. Parameter `generateIndividual` should be a function which takes one parameter (random number generator) and returns a random individual.

- **`Genemo.reproduce({ crossover, mutate, mutationProbability })`**

    Returns a function with a signature matching that of `reproduce` property of `Genemo.runEvolution` options object.

    `crossover` - `([Individual, Individual], Rng) => [Individual, Individual]` - takes a pair of parents and a random number generator and returns a pair of children.

    `mutate` - `(Individual, Rng) => Individual` - maps an individual to a new individual modified by mutation.

    `mutationProbability` - `number` - mutation probability for a single individual. Defaults to `0.01`.

- **`Genemo.reproduceAsync({ crossover, mutate, mutationProbability })`**

    Same as `Genemo.reproduce`, but this one returns a Promise (works with `runEvolutionAsync`, but not with `runEvolution`). It runs all crossovers with `Promise.all` and then all mutations with another `Promise.all`.

- **`Genemo.stopCondition({ minFitness, maxFitness, maxGenerations })`**

    Returns a function with a signature matching that of `stopCondition` property of `Genemo.runEvolution` options object. Use `minFitness` for maximization problems and `maxFitness` for minimization.

- **`Genemo.logIterationData({ include, customLogger })`**

    Returns a function with a signature matching that of `iterationCallback` property of `Genemo.runEvolution` options object. `customLogger` is optional - its default value is a `console.log` function. `include` is an object, which specifies values that should be included in each log:
    ```
    {
      generationNumber = false,
      minFitness = false,
      maxFitness = false,
      avgFitness = false,
      debugDataKeys = []
    }
    ```
    `debugDataKeys` should be an array of strings. It specifies which values from `debugData` object should be logged. `debugData` object contains information about performance of each element of the running genetic algorithm. Available keys: `lastIteration`, `selection`, `reproduce`, `fitness`, `succession`, `stopCondition`, `iterationCallback`.

### Selection
- **`Genemo.selection.roulette({ minimizeFitness })`**

    Returns a function that can be used as a `selection` parameter for `Genemo.runEvolution`.
    `minimizeFitness` is a boolean value indicating if we are aiming at minimizing or maximizing fitness. Defaults to `false`.

- **`Genemo.selection.rank({ minimizeFitness })`**

    Returns a function that can be used as a `selection` parameter for `Genemo.runEvolution`.
    `minimizeFitness` is a boolean value indicating if we are aiming at minimizing or maximizing fitness.

- **`Genemo.selection.tournament({ size, minimizeFitness })`**

    Returns a function that can be used as a `selection` parameter for `Genemo.runEvolution`.
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

### Mutation
- **`Genemo.mutation.transformRandomGene(transformFunc)`**

    Returns a function that can be used as a `mutation` parameter for `Genemo.runEvolution`.
    `transformFunc(gene, random)` is a function, which takes a single gene and a random number generator and returns a new gene.

- **`Genemo.mutation.flipBit`**

    Function that can be used as an argument for `Genemo.mutation.transformRandomGene`.

- **`Genemo.mutation.swapTwoGenes`**

    Swaps places of two randomly chosen genes (array elements).
    This function can be used as an argument for `Genemo.mutation.transformRandomGene`.

### Elitism
- **`Genemo.elitism({ keepFactor, minimizeFitness })`**

    Returns a function that can be used as a `succession` parameter for `Genemo.runEvolution`.
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
