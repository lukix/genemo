# API Reference

## Types
To make this API reference more concise and readable, a few "types" has been introduced.
Those "types" are just aliases for some plain JavaScript structures.

| Type                  | Translates to                                       | Description                                                    |
|-----------------------|-----------------------------------------------------|----------------------------------------------------------------|
| `Individual`          | `Any`                                               | Represents a single individual/chromosome.                     |
| `Population`          | `Array<Individual>`                                 | Array of individuals makes a population.                       |
| `EvaluatedPopulation` | `Array<{ fitness: number, indvidual: Individual }>` | Array of objects containing an `individual` and its `fitness`. |
| `Rng` | `() => number` | Function, which returns random values between 0 and 1 (inclusive of 0, but not 1). |

## Available Properties/Functions

### **`Genemo.run(options)`**
Runs a genetic algorithm.
Returns a promise, which resolves to an object:
```js
{
  evaluatedPopulation: EvaluatedPopulation,
  iteration: number,
  logs: object
}
```
`Genemo.run` takes a single argument - `options`. It is an object with the following properties:

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

### **`Genemo.generateInitialPopulation({ generateIndividual, size })`**
Returned function is applicable to: `Genemo.run`'s `generateInitialPopulation` parameter.<br />
Takes an object with the following properties:

- **`generateIndividual`** - Function which takes a random number generator as an argument and returns a random individual.<br />
  **Type**: `(Rng) => Individual`<br />

- **`size`** - Number of individuals in the population.<br />
  **Type**: `number`<br />

### **`Genemo.evaluatePopulation({ fitnessFunction })`**
Returned function is applicable to: `Genemo.run`'s `evaluatePopulation` parameter.<br />
Takes an object with the following properties:

- **`fitnessFunction`** - Function which takes an individual as a parameter and returns its fitness.<br />
  **Type**: `(Individual) => number`<br />

### **`Genemo.reproduce({ crossover, mutate, mutationProbability })`**
Returned function is applicable to: `Genemo.run`'s `reproduce` parameter.<br />
Takes an object with the following properties:

- **`crossover`** - Function which takes a pair of parents and a random number generator and returns a pair of children.<br />
  **Type**: `([Individual, Individual], Rng) => [Individual, Individual]`<br />

- **`mutate`** - Function which maps an individual to a new individual modified by mutation<br />
  **Type**: `(Individual, Rng) => Individual`<br />

- **`mutationProbability`** - Mutation probability for a single individual.<br />
  **Type**: `number`<br />
  **Default value**: `0.01`<br />

### **`Genemo.stopCondition({ minFitness, maxFitness, maxIterations })`**
Returned function is applicable to: `Genemo.run`'s `stopCondition` parameter.<br />
Takes an object with the following properties:

- **`minFitness`** - stop when one of the individuals has fitness higher or equal `minFitness`<br />
  **Type**: `number`<br />
  **Optional**<br />

- **`maxFitness`** - stop when one of the individuals has fitness lower or equal `minFitness`.<br />
  **Type**: `number`<br />
  **Optional**<br />

- **`maxIterations`** - stop after `maxIterations` iterations.<br />
  **Type**: `number`<br />
  **Optional**<br />

Returns a function with a signature matching that of `stopCondition` property of `Genemo.run` options object. Use `minFitness` for maximization problems and `maxFitness` for minimization.

### **`Genemo.logIterationData({ include, customLogger })`**
Returned function is applicable to: `Genemo.run`'s `iterationCallback` parameter.<br />
Takes an object with the following properties:

- **`include`** - stop when one of the individuals has fitness higher or equal `minFitness`<br />
  **Type**: `object`<br />
  **Properties** (all optional):
    - `iteration`
    - `minFitness`
    - `maxFitness`
    - `avgFitness`
    - `logsKeys`

- **`customLogger`** - logs provided string value<br />
  **Type**: `(string) => undefined`<br />
  **Optional**<br />
  **Default value**: `console.log`
 <!-- `include` is an object, which specifies values that should be included in each log:
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
-->

### **`Genemo.selection.roulette({ minimizeFitness })`**
Returned function is applicable to: `Genemo.run`'s `selection` parameter.<br />
Takes an object with the following properties:

- **`minimizeFitness`** - if true, selection's purpose will be to minimize fitness.<br />
  **Type**: `boolean`<br />
  **Optional**<br />
  **Default value**: `false`<br />

### **`Genemo.selection.rank({ minimizeFitness })`**
Returned function is applicable to: `Genemo.run`'s `selection` parameter.<br />
Takes an object with the following properties:

- **`minimizeFitness`** - if true, selection's purpose will be to minimize fitness.<br />
  **Type**: `boolean`<br />
  **Optional**<br />
  **Default value**: `false`<br />

### **`Genemo.selection.tournament({ size, minimizeFitness })`**
Returned function is applicable to: `Genemo.run`'s `selection` parameter.<br />
Takes an object with the following properties:

- **`size`** - tournament size<br />
  **Type**: `number`<br />

- **`minimizeFitness`** - if true, selection's purpose will be to minimize fitness.<br />
  **Type**: `boolean`<br />
  **Optional**<br />
  **Default value**: `false`<br />

### **`Genemo.crossover.singlePoint`**
Function that can be used as a `crossover` parameter for `Genemo.reproduce`.

### **`Genemo.crossover.twoPoint`**
Function that can be used as a `crossover` parameter for `Genemo.reproduce`.

### **`Genemo.crossover.kPoint(k)`**
**Returns** a function that can be used as a `crossover` parameter for `Genemo.reproduce`.

### **`Genemo.crossover.orderOne`**
**Returns** a function that can be used as a `crossover` parameter for `Genemo.reproduce`.

### **`Genemo.crossover.PMX`**
Partially-mapped crossover.
**Returns** a function that can be used as a `crossover` parameter for `Genemo.reproduce`.

### **`Genemo.crossover.uniform`**
Uniform crossover.
Function that can be used as a `crossover` parameter for `Genemo.reproduce`.
Offsprings are created by selecting each gene from one of the parents with equal probability.

### **`Genemo.mutation.transformRandomGene(transformFunc)`**
Returns a function that can be used as a `mutation` parameter for `Genemo.run`.
`transformFunc(gene, random)` is a function, which takes a single gene and a random number generator and returns a new gene.

### **`Genemo.mutation.flipBit`**
Function that can be used as an argument for `Genemo.mutation.transformRandomGene`.

### **`Genemo.mutation.swapTwoGenes`**
Swaps places of two randomly chosen genes (array elements).
This function can be used as an argument for `Genemo.mutation.transformRandomGene`.

### **`Genemo.elitism({ keepFactor, minimizeFitness })`**
Returns a function that can be used as a `succession` parameter for `Genemo.run`.
`keepFactor` is a number from 0 to 1 describing what part of best individuals should be kept unchanged.
`minimizeFitness` is a boolean value indicating if we are aiming at minimizing or maximizing fitness.

### **`Genemo.randomSequenceOf(valuesSet, length)`**
Returns a function which takes a random number generator and returns an array of random elements from `valuesSet` of length equal to `length`. Returned function can be used as a `generateIndividual` parameter for `Genemo.generateInitialPopulation`.

### **`Genemo.randomPermutationOf(valuesSet)`**
Returns a function which takes a random number generator and returns a random permutation of elements from `valuesSet`. Returned function can be used as a `generateIndividual` parameter for `Genemo.generateInitialPopulation`.
