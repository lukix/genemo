const Genemo = require('../../lib');
const distances = require('../data/distances17.json');

const evaluatePopulationInChunks = require('./utils/evaluatePopulationInChunks');
const createParallelExecutor = require('./utils/createParallelExecutor');

const cities = [...Array(distances.length).keys()];
const generateIndividual = Genemo.randomPermutationOf(cities);

const WORKERS_NUMBER = 4;

const evaluateInParallel = createParallelExecutor({
  workersNumber: WORKERS_NUMBER,
  workerFileName: './examples/example3-parallelExecution/evaluateChunkWorker.js',
});

const evaluatePopulation = evaluatePopulationInChunks(
  WORKERS_NUMBER,
  chunk => evaluateInParallel(chunk),
);

const evolutionOptions = {
  generateInitialPopulation: Genemo.generateInitialPopulation({
    generateIndividual,
    size: 160,
  }),
  selection: Genemo.selection.rank({ minimizeFitness: true }),
  reproduce: Genemo.reproduce({
    crossover: Genemo.crossover.orderOne(),
    mutate: Genemo.mutation.swapTwoGenes(),
    mutationProbability: 0.02,
  }),
  evaluatePopulation,
  stopCondition: Genemo.stopCondition({ maxIterations: 1000 }),
  iterationCallback: Genemo.logIterationData({
    include: {
      iteration: { show: true },
      logsKeys: [
        { key: 'lastIteration' },
      ],
    },
  }),
};

// Run genetic algorithm
console.time('Execution time:');
Genemo.run(evolutionOptions).then(({ iteration, getLowestFitnessIndividual }) => {
  console.timeEnd('Execution time:');
  console.log({
    iteration,
    shortestPath: getLowestFitnessIndividual().fitness,
  });
});
