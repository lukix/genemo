# API Reference

## Types
To make this API reference more concise and readable, a few "types" have been introduced.
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
Returns a function which logs iteration data (mostly performance data).
Returned function is applicable to: `Genemo.run`'s `iterationCallback` parameter.<br />
Takes an object with the following properties:

- **`include`** - stop when one of the individuals has fitness higher or equal `minFitness`<br />
  **Type**: `object`<br />
  **Properties** (all optional):
    - `iteration`
      - Signature: `{ show: boolean, formatter: (key, value) => string }`
    - `minFitness`
      - Signature: `{ show: boolean, formatter: (key, value) => string }`
    - `maxFitness`
      - Signature: `{ show: boolean, formatter: (key, value) => string }`
    - `avgFitness`
      - Signature: `{ show: boolean, formatter: (key, value) => string }`
    - `logsKeys`
      - Signature: `Array<{ key: string, formatter: (key, value) => string }>`
      - Available keys for `Genemo.run`: `lastIteration`, `selection`, `reproduce`, `fitness`, `succession`, `stopCondition`, `iterationCallback`
      - Available keys for `Genemo.reproduce`: `reproduce.crossover`, `reproduce.mutation`

    Formatters are optional.

- **`customLogger`** - logs provided string value<br />
  **Type**: `(string) => undefined`<br />
  **Optional**<br />
  **Default value**: `console.log`

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

### **`Genemo.randomSequenceOf(valuesSet, length)`**
Returns a function which takes a random number generator and returns an array of random elements from `valuesSet` of length equal to `length`.<br />
Returned function is applicable to: `Genemo.generateInitialPopulation`'s `generateIndividual` parameter.

### **`Genemo.randomPermutationOf(valuesSet)`**
Returns a function which takes a random number generator and returns a random permutation of elements from `valuesSet`.<br />
Returned function is applicable to: `Genemo.generateInitialPopulation`'s `generateIndividual` parameter.

### **`Genemo.elitism({ keepFactor, minimizeFitness })`**
Succession strategy, which keeps best individuals regerdless of reproduce's outcome.
Returned function is applicable to: `Genemo.run`'s `succession` parameter.<br />
Takes an object with the following properties:

- **`keepFactor`** - tournament size<br />
  **Type**: `number`<br />

- **`minimizeFitness`** - if true, succession's purpose will be to minimize fitness.<br />
  **Type**: `boolean`<br />
  **Optional**<br />
  **Default value**: `false`<br />

### **`Genemo.crossover.singlePoint()`**
Single-point crossover.<br />
Returned function is applicable to: `Genemo.reproduce`'s `crossover` parameter.<br />

### **`Genemo.crossover.twoPoint()`**
Two-point crossover.<br />
Returned function is applicable to: `Genemo.reproduce`'s `crossover` parameter.<br />

### **`Genemo.crossover.kPoint(k)`**
K-point crossover.<br />
Returned function is applicable to: `Genemo.reproduce`'s `crossover` parameter.<br />
Takes one argument:

- **`k`** - number of crosover points.<br />
  **Type**: `number`<br />

### **`Genemo.crossover.orderOne()`**
Order 1 crossover.<br />
Returned function is applicable to: `Genemo.reproduce`'s `crossover` parameter.<br />

### **`Genemo.crossover.PMX()`**
Partially-mapped crossover.<br />
Returned function is applicable to: `Genemo.reproduce`'s `crossover` parameter.<br />

### **`Genemo.crossover.uniform()`**
Uniform crossover. Offsprings are created by selecting each gene from one of the parents with equal probability.<br />
Returned function is applicable to: `Genemo.reproduce`'s `crossover` parameter.<br />

### **`Genemo.mutation.transformRandomGene(transformFunc)`**
Transforms random gene from individual. Individual must be represented as an array of genes.
Returned function is applicable to: `Genemo.reproduce`'s `mutate` parameter.<br />
Takes one argument:

- **`transformFunc`** - function which transforms one gene.<br />
  **Type**: `(gene, Rng) => mutatedGene`<br />

### **`Genemo.mutation.flipBit()`**
Negates value of a random gene (array element) of an individual.<br />
Returned function is applicable to: `Genemo.reproduce`'s `transformRandomGene` parameter.<br />

### **`Genemo.mutation.swapTwoGenes()`**
Swaps places of two randomly chosen genes (array elements) of an individual.<br />
Returned function is applicable to: `Genemo.reproduce`'s `transformRandomGene` parameter.<br />
