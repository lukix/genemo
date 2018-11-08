const GMO = require('../lib');

// Function for creating random individual (chromosome).
// An individual is represented by an array with 50 values (genes),
// each being true or false.
const generateIndividual = GMO.randomSequenceOf([true, false], 50);

// This is an ideal individual. We want our genetic algorithm to came up with
// an individual (solution) which is as similar to targetIndividual as possible.
const targetIndividual = generateIndividual(Math.random);

// Fitness function evaluates how good an individual (solution) is.
// In our case it will be a number of identical genes between targetIndividual
// and the individual we are evaluating.
const fitnessFunction = (individual) => {
  const similarity = individual.reduce((sum, element, index) => (
    element === targetIndividual[index]
      ? sum + 1
      : sum
  ), 0);
  return similarity;
};

const evolutionOptions = {
  // Initial population consists of 500 random individuals (chromosomes).
  generateInitialPopulation: GMO.generateInitialPopulation({
    generateIndividual,
    size: 500,
  }),

  // Selection function chooses individuals from population for breeding
  // Let's use a very common selection method - roulette selection.
  selection: GMO.selection.roulette(),

  // A function, which creates a new population from the selected individuals from the previous one.
  // Usually consists of crossover and mutation.
  reproduce: GMO.reproduce({
    crossover: GMO.crossover.singlePoint,
    mutate: GMO.mutation.transformRandomGene(GMO.mutation.flipBit),
    mutationProbability: 0.01,
  }),

  // Fitness function to evaluate an individual
  fitness: fitnessFunction,

  // Let's stop our algorithm when some individual reaches fitness >= 50 or after 1000 generations.
  stopCondition: GMO.stopCondition({ minFitness: 50, maxGenerations: 5000 }),
};

// Run genetic algorithm
console.time('Execution time:');
const lastGeneration = GMO.runEvolution(evolutionOptions);
console.timeEnd('Execution time:');

const { evaluatedPopulation, generation } = lastGeneration;

console.log({
  generation,
  maxFitness: Math.max(...evaluatedPopulation.map(({ fitness }) => fitness)),
});
