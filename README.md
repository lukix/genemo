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
Meaning of types *Rng*, *Population*, *EvaluatedPopulation* and *Individual* is described later in this document.

| Property                    | Signature                                          | Description                                                |
|-----------------------------|----------------------------------------------------|------------------------------------------------------------|
| `generateInitialPopulation` | `(Rng) => Population`                                 | Generates initial population of individuals (chromosomes). |
| `selection`                 | `(EvaluatedPopulation, Rng) => EvaluatedPopulation`     | Selects individuals for breeding.                          |
| `reproduce`                 | `(EvaluatedPopulation, Rng) => Population`              | Creates new population from the selected individuals.      |
| `fitness`                   | `(Individual) => number`                           | Evaluates an individual (chromosome).                      |
| `stopCondition`             | `({ evaluatedPopulation, generation }, Rng) => boolean` | Returning `true` terminates an algorithm.                  |
| `succession`                | `({ prevPopulation, childrenPopulation }, Rng) => EvaluatedPopulation` | **Optional**. Creates a new population based on previous (evaluated) population and current (also evaluated) children population (result of `reproduce` function).                  |
| `random`                | `() => number` | **Optional**. Custom random number generator. Should return values between 0 and 1. If not provided, `Math.random` will be used.                 |

`GMO.runEvolution` returns an object `{ evaluatedPopulation: EvaluatedPopulation, generation: number }`, which contains information about a population (along with fitness values) from the last generation and a number of the last generation.

If you need more control over execution of the algorithm, you can use *generator* `GMO.getGenerationsIterator`.

### Types
When reading this documentation, you will encounter the following types:

| Type                  | Translates to                                       | Description                                                    |
|-----------------------|-----------------------------------------------------|----------------------------------------------------------------|
| `Individual`          | `Any`                                               | Represents a single individual/chromosome.                     |
| `Population`          | `Array<Individual>`                                 | Array of individuals makes a population.                       |
| `EvaluatedPopulation` | `Array<{ fitness: number, indvidual: Individual }>` | Array of objects containing an `individual` and its `fitness`. |
| `Rng` | `() => number` | Function, which returns random values between 0 and 1. |

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
    `transformFunc(gene, random)` is a function, which takes a single gene and a random number generator and returns a new gene.

- **`GMO.mutation.flipBit`**

    Function that can be used as an argument for `GMO.mutation.transformRandomGene`.

- **`GMO.mutation.swapTwoGenes`**

    Swaps places of two randomly chosen genes (array elements).
    This function can be used as an argument for `GMO.mutation.transformRandomGene`.

### Elitism
- **`GMO.elitism({ keepFactor, minimalizeFitness })`**

    Returns a function that can be used as a `succession` parameter for `GMO.runEvolution`.
    `keepFactor` is a number from 0 to 1 describing what part of best individuals should be kept unchanged.
    `minimalizeFitness` is a boolean value indicating if we are aiming at minimalizing or maximalizing fitness.
