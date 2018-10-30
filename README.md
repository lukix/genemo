# GMO - Genetic Algorithm Library
Simple to use genetic algorithm library with many predefined operators.

## Installation
```bash
npm install --save gmo-genetic-algorithm
```

## Getting Started
To start a genetic algorithm use this function:
```javascript
const result = GMO.runEvolution(options);
```
`options` is an object which specifies genetic operators (functions) used in a genetic algorithm.
The table below describes all properties you need to pass with `options` object.
All options are required, but for most of them you can use an existing function from the library.
Meaning of types *Population*, *EvaluatedPopulation*, *Individual* is described later in this document.

| Property                    | Signature                                          | Description                                                |
|-----------------------------|----------------------------------------------------|------------------------------------------------------------|
| `generateInitialPopulation` | `() => Population`                                 | Generates initial population of individuals (chromosomes). |
| `selection`                 | `(EvaluatedPopulation) => EvaluatedPopulation`     | Selects individuals for breeding.                          |
| `reproduce`                 | `(EvaluatedPopulation) => Population`              | Creates new population from the selected individuals.      |
| `fitness`                   | `(Individual) => number`                           | Evaluates an individual (chromosome).                      |
| `stopCondition`             | `({ evaluatedPopulation, generation }) => boolean` | Returning `true` terminates an algorithm.                  |

`GMO.runEvolution` returns an object `{ evaluatedPopulation: EvaluatedPopulation, generation: number }`, which contains information about a population (along with fitness values) from the last generation and a number of the last generation.

If you need more control over execution of the algorithm, you can use *generator* `GMO.getGenerationsIterator`.

### Types
When reading this documentation, you will encounter three special types:

| Type                  | Translates to                                       | Description                                                    |
|-----------------------|-----------------------------------------------------|----------------------------------------------------------------|
| `Individual`          | `Any`                                               | Represents a single individual/chromosome.                     |
| `Population`          | `Array<Individual>`                                 | Array of individuals makes a population.                       |
| `EvaluatedPopulation` | `Array<{ fitness: number, indvidual: Individual }>` | Array of objects containing an `individual` and its `fitness`. |

### Example usage
Full examples with comments can be found in the `./examples` directory. Here is a shorter version:
```javascript
const { evaluatedPopulation, generation } = GMO.runEvolution({
  generateInitialPopulation: GMO.generateInitialPopulation({
    generateIndividual,
    size: 500,
  }),
  selection: GMO.selection.roulette,
  reproduce: GMO.reproduce({
    crossover: GMO.crossover.singlePoint,
    mutate: GMO.mutation.transformRandomGene(GMO.mutation.flipBit),
    mutationProbability: 0.01,
  }),
  fitness: fitnessFunction, // You need to provide your own fitness function
  stopCondition: GMO.stopCondition({ minFitness: 50, maxGenerations: 1000 }),
});
```
## Predefined operators
### General
- **`GMO.generateInitialPopulation({ generateIndividual, size })`**

    Returns a function with a signature matching that of `generateInitialPopulation` property of `GMO.runEvolution` options object.

- **`GMO.reproduce({ crossover, mutate, mutationProbability })`**

    Returns a function with a signature matching that of `reproduce` property of `GMO.runEvolution` options object.

- **`GMO.stopCondition({ minFitness, maxFitness, maxGenerations })`**

    Returns a function with a signature matching that of `stopCondition` property of `GMO.runEvolution` options object. Use `minFitness` for maximization problems and `maxFitness` for minimization.

### Selection
- **`GMO.selection.roulette`**

    Function that can be used as a `selection` parameter for `GMO.runEvolution`.
    **Currently, it works only for maximization problems and positive fitness values!**

- **`GMO.selection.tournament({ tournamentSize, minimalizeFitness })`**

    **Returns** a function that can be used as a `selection` parameter for `GMO.runEvolution`.
    `tournamentSize` is a number describing how many individuals take part in a tournament.
    `minimalizeFitness` is a boolean value indicating if we are aiming at minimalizing or maximalizing fitness.
### Crossover
- **`GMO.crossover.singlePoint`**

    Function that can be used as a `crossover` parameter for `GMO.reproduce`.

- **`GMO.crossover.twoPoint`**

    Function that can be used as a `crossover` parameter for `GMO.reproduce`.

- **`GMO.crossover.kPoint(k)`**

    **Returns** a function that can be used as a `crossover` parameter for `GMO.reproduce`.

- **`GMO.crossover.orderOne`**

    **Returns** a function that can be used as a `crossover` parameter for `GMO.reproduce`.

- **`GMO.crossover.PMX`**

    Partially-mapped crossover.
    **Returns** a function that can be used as a `crossover` parameter for `GMO.reproduce`.

### Mutation
- **`GMO.mutation.transformRandomGene(transformFunc)`**

    Returns a function that can be used as a `mutation` parameter for `GMO.runEvolution`.

- **`GMO.mutation.flipBit`**

    Function that can be used as an argument for `GMO.mutation.transformRandomGene`.

- **`GMO.mutation.swapTwoGenes`**

    Swaps places of two randomly chosen genes (array elements).
    This function can be used as an argument for `GMO.mutation.transformRandomGene`.
