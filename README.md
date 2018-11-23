# GeneMO - Genetic Algorithm Library
[![Build Status](https://travis-ci.org/lukix/genemo.svg?branch=master)](https://travis-ci.org/lukix/genemo) [![Coverage Status](https://coveralls.io/repos/github/lukix/genemo/badge.svg?branch=master)](https://coveralls.io/github/lukix/genemo?branch=master) [![npm version](https://badge.fury.io/js/genemo.svg)](https://badge.fury.io/js/genemo)

Simple to use genetic algorithm library with many predefined operators.

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
| `stopCondition`             | `({ evaluatedPopulation, generation }, Rng) => boolean` | Returning `true` terminates an algorithm.                  |
| `succession`                | `({ prevPopulation, childrenPopulation }, Rng) => EvaluatedPopulation` | **Optional**. Creates a new population based on previous (evaluated) population and current (also evaluated) children population (result of `reproduce` function).                  |
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
## Predefined operators
### General
- **`Genemo.generateInitialPopulation({ generateIndividual, size })`**

    Returns a function with a signature matching that of `generateInitialPopulation` property of `Genemo.runEvolution` options object. Parameter `generateIndividual` should be a function which takes one parameter (random number generator) and returns a random individual.

- **`Genemo.reproduce({ crossover, mutate, mutationProbability })`**

    Returns a function with a signature matching that of `reproduce` property of `Genemo.runEvolution` options object.
    `crossover` - `([Individual, Individual], Rng) => [Individual, Individual]` - takes a pair of parents and a random number generator and returns a pair of children.
    `mutate` - `(Individual) => Individual` - maps an individual to a new individual modified by mutation.
    `mutationProbability` - `number` - mutation probability for a single individual. Defaults to `0.01`.

- **`Genemo.stopCondition({ minFitness, maxFitness, maxGenerations })`**

    Returns a function with a signature matching that of `stopCondition` property of `Genemo.runEvolution` options object. Use `minFitness` for maximization problems and `maxFitness` for minimization.

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
