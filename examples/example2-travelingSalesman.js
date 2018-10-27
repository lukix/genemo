const shuffle = require('shuffle-array');
const GMO = require('../lib');
const distances = require('./data/distances.json');
const findBestIndividual = require('../lib/utils/findBestIndividual');

const cities = [...Array(distances.length).keys()];
const generateIndividual = () => shuffle(cities, { copy: true });

const fitnessFunction = (individual) => {
  const totalDistance = individual.slice(0, -1).reduce((distance, city, index) => {
    const nextCity = individual[index + 1];
    const currentDistance = distances[city][nextCity];
    return distance + currentDistance;
  }, 0);
  return totalDistance;
};

const elitistSelection = ({
  minimalizeFitness = false,
  nextSelection,
}) => (evaluatedPopulation) => {
  const selectedIndividuals = nextSelection(evaluatedPopulation);
  const bestIndividuals = [findBestIndividual(evaluatedPopulation, minimalizeFitness)];
  [selectedIndividuals[0]] = bestIndividuals;
  return selectedIndividuals;
};

const selection = elitistSelection({
  minimalizeFitness: true,
  nextSelection: GMO.selection.tournament({ tournamentSize: 3, minimalizeFitness: true }),
});

const evolutionOptions = {
  generateInitialPopulation: GMO.generateInitialPopulation({
    generateIndividual,
    size: 500,
  }),
  selection,
  reproduce: GMO.reproduce({
    crossover: GMO.crossover.orderOne,
    mutate: GMO.mutation.swapTwoGenes,
    mutationProbability: 0.02,
  }),
  fitness: fitnessFunction,
  stopCondition: GMO.stopCondition({ maxGenerations: 2000 }),
};

// Run genetic algorithm
console.time('Execution time:');
const lastGeneration = GMO.runEvolution(evolutionOptions);
console.timeEnd('Execution time:');

const { evaluatedPopulation } = lastGeneration;

const bestIndividual = findBestIndividual(evaluatedPopulation, true);

console.log({ shortestPath: bestIndividual.fitness });
