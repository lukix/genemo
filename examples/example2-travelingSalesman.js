const R = require('ramda');
const shuffle = require('shuffle-array');
const GMO = require('../lib');
const distances = require('./data/distances.json');
const randomFromRange = require('../lib/utils/randomFromRange');
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

const createChildUsingOrderOneCrossover = ([parent1, parent2], minIndex, maxIndex) => {
  const individualLength = parent1.length;
  const child = new Array(individualLength).fill();
  R.range(minIndex, maxIndex + 1).forEach((index) => {
    child[index] = parent1[index];
  });

  let childIndex = maxIndex + 1;
  [...R.range(maxIndex + 1, individualLength), ...R.range(0, maxIndex + 1)].forEach((index) => {
    if (!child.includes(parent2[index])) {
      child[childIndex % individualLength] = parent2[index];
      childIndex += 1;
    }
  });
  return child;
};

const orderOneCrossover = ([mother, father]) => {
  const individualLength = mother.length;
  const index1 = randomFromRange(0, individualLength - 1);
  const index2 = randomFromRange(0, individualLength - 1);
  const minIndex = Math.min(index1, index2);
  const maxIndex = Math.max(index1, index2);

  const son = createChildUsingOrderOneCrossover([mother, father], minIndex, maxIndex);
  const daughter = createChildUsingOrderOneCrossover([father, mother], minIndex, maxIndex);

  return [son, daughter];
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
    crossover: orderOneCrossover,
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
