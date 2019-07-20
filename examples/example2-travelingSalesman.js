const Genemo = require('../lib');
const distances = require('./data/distances17.json');

const cities = [...Array(distances.length).keys()];
const generateIndividual = Genemo.randomPermutationOf(cities);

// Fitness is measured as a path total length
const fitnessFunction = (individual) => {
  const lastToFirstDistance = distances[individual[individual.length - 1]][individual[0]];
  const totalDistance = individual.slice(0, -1).reduce((distance, city, index) => {
    const nextCity = individual[index + 1];
    const currentDistance = distances[city][nextCity];
    return distance + currentDistance;
  }, 0) + lastToFirstDistance;
  return totalDistance;
};

const evolutionOptions = {
  generateInitialPopulation: Genemo.generateInitialPopulation({
    generateIndividual,
    size: 250,
  }),
  selection: Genemo.selection.rank({ minimizeFitness: true }),
  reproduce: Genemo.reproduce({
    crossover: Genemo.crossover.orderOne,
    mutate: Genemo.mutation.swapTwoGenes,
    mutationProbability: 0.02,
  }),
  evaluatePopulation: Genemo.evaluatePopulation({ fitnessFunction }),
  stopCondition: Genemo.stopCondition({ maxFitness: 2085, maxGenerations: 1000 }),
};

// Run genetic algorithm
console.time('Execution time:');
Genemo.run(evolutionOptions).then(({ evaluatedPopulation, generation }) => {
  console.timeEnd('Execution time:');
  console.log({
    generation,
    shortestPath: Math.min(...evaluatedPopulation.map(({ fitness }) => fitness)),
  });
});
