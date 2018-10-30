const shuffle = require('shuffle-array');
const GMO = require('../lib');
const distances = require('./data/distances17.json');

const cities = [...Array(distances.length).keys()];
const generateIndividual = () => shuffle(cities, { copy: true });

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
  generateInitialPopulation: GMO.generateInitialPopulation({
    generateIndividual,
    size: 250,
  }),
  selection: GMO.selection.tournament({ tournamentSize: 3, minimalizeFitness: true }),
  reproduce: GMO.reproduce({
    crossover: GMO.crossover.orderOne,
    mutate: GMO.mutation.swapTwoGenes,
    mutationProbability: 0.02,
  }),
  fitness: fitnessFunction,
  stopCondition: GMO.stopCondition({ maxFitness: 2085, maxGenerations: 1000 }),
};

// Run genetic algorithm
console.time('Execution time:');
const lastGeneration = GMO.runEvolution(evolutionOptions);
console.timeEnd('Execution time:');

const { evaluatedPopulation, generation } = lastGeneration;

console.log({
  generation,
  shortestPath: Math.min(...evaluatedPopulation.map(({ fitness }) => fitness)),
});
