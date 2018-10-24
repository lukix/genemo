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
Full example with comments can be found in the `index.js` file in the root folder of the repository. Here is a shorter version:
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

- **`GMO.stopCondition({ minFitness, maxGenerations })`**
    Returns a function with a signature matching that of `stopCondition` property of `GMO.runEvolution` options object.

### Selection
- **`GMO.selection.roulette`**
    Function that can be used as a `selection` parameter for `GMO.runEvolution`.
### Crossover
- **`GMO.crossover.singlePoint`**
    Function that can be used as a `crossover` parameter for `GMO.reproduce`.

- **`GMO.crossover.twoPoint`**
    Function that can be used as a `crossover` parameter for `GMO.reproduce`.

- **`GMO.crossover.kPoint(k)`**
    **Returns** a function that can be used as a `crossover` parameter for `GMO.reproduce`.
### Mutation
- **`GMO.mutation.transformRandomGene(transformFunc)`**
    Returns a function that can be used as a `mutation` parameter for `GMO.runEvolution`.

- **`GMO.mutation.flipBit`**
    Function that can be used as an argument for `GMO.mutation.transformRandomGene`.
