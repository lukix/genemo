const Genemo = require('../lib');

// Function for creating random individual (chromosome).
// An individual is represented by an array with 50 values (genes),
// each being true or false.
const generateIndividual = Genemo.randomSequenceOf([true, false], 50);

// This is an ideal individual. We want our genetic algorithm to came up with
// an individual (solution) which is as similar to targetIndividual as possible.
const targetIndividual = generateIndividual(Math.random);

// Fitness function evaluates how good an individual (solution) is.
// In our case it will be a number of identical genes between targetIndividual
// and the individual we are evaluating.
const fitnessFunction = (individual) => {
  const matchingElements = individual.filter(
    (element, index) => element === targetIndividual[index],
  );
  return matchingElements.length;
};

const evolutionOptions = {
  // Initial population consists of 500 random individuals (chromosomes).
  generateInitialPopulation: Genemo.generateInitialPopulation({
    generateIndividual,
    size: 500,
  }),

  // Selection function chooses individuals from population for breeding
  // Let's use a very common selection method - roulette selection.
  selection: Genemo.selection.roulette({ minimizeFitness: false }),

  // A function, which creates a new population from the selected individuals from the previous one.
  // Usually consists of crossover and mutation.
  reproduce: Genemo.reproduce({
    crossover: Genemo.crossover.singlePoint(),
    mutate: Genemo.mutation.transformRandomGene(Genemo.mutation.flipBit()),
    mutationProbability: 0.01,
  }),

  // evaluatePopulation with custom fitness function to evaluate an individual
  evaluatePopulation: Genemo.evaluatePopulation({ fitnessFunction }),

  // Let's stop our algorithm when some individual reaches fitness >= 50 or after 1000 iterations.
  stopCondition: Genemo.stopCondition({ minFitness: 50, maxIterations: 5000 }),
};

// Run genetic algorithm
console.time('Execution time:');
Genemo.run(evolutionOptions).then(({ iteration, getHighestFitnessIndividual }) => {
  console.timeEnd('Execution time:');
  console.log({
    iteration,
    maxFitness: getHighestFitnessIndividual().fitness,
  });
});
