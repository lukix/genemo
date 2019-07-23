# Predefined operators/functions
## General
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

## Selection
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

## Crossover
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

## Mutation
- **`Genemo.mutation.transformRandomGene(transformFunc)`**

    Returns a function that can be used as a `mutation` parameter for `Genemo.run`.
    `transformFunc(gene, random)` is a function, which takes a single gene and a random number generator and returns a new gene.

- **`Genemo.mutation.flipBit`**

    Function that can be used as an argument for `Genemo.mutation.transformRandomGene`.

- **`Genemo.mutation.swapTwoGenes`**

    Swaps places of two randomly chosen genes (array elements).
    This function can be used as an argument for `Genemo.mutation.transformRandomGene`.

## Elitism
- **`Genemo.elitism({ keepFactor, minimizeFitness })`**

    Returns a function that can be used as a `succession` parameter for `Genemo.run`.
    `keepFactor` is a number from 0 to 1 describing what part of best individuals should be kept unchanged.
    `minimizeFitness` is a boolean value indicating if we are aiming at minimizing or maximizing fitness.

## Other useful functions
- **`Genemo.randomSequenceOf(valuesSet, length)`**

    Returns a function which takes a random number generator and returns an array of random elements from `valuesSet` of length equal to `length`. Returned function can be used as a `generateIndividual` parameter for `Genemo.generateInitialPopulation`.

- **`Genemo.randomPermutationOf(valuesSet)`**

    Returns a function which takes a random number generator and returns a random permutation of elements from `valuesSet`. Returned function can be used as a `generateIndividual` parameter for `Genemo.generateInitialPopulation`.
