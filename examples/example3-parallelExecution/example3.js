/**
 * THIS EXAMPLE WORKS ONLY ON NODEJS ENVIRONMENT, BECAUSE IT USES child_process MODULE (in createNodeJSWorker function)
 */

const Genemo = require('../../lib');
const distances = require('../data/distances17.json');

const mapInAsyncChunks = require('./utils/mapInAsyncChunks');
const createParallelExecutor = require('./utils/createParallelExecutor');
const { createNodeJSWorker } = require('./utils/createWorker');

const cities = [...Array(distances.length).keys()];
const generateIndividual = Genemo.randomPermutationOf(cities);

const WORKERS_NUMBER = 4;

// ---EVALUATE POPULATION---
const [evaluateChunk, terminateEvaluateWorkers] = createParallelExecutor({
  workersNumber: WORKERS_NUMBER,
  workerFileName: './examples/example3-parallelExecution/evaluateChunkWorker.js',
  createWorker: createNodeJSWorker,
});

const evaluatePopulation = mapInAsyncChunks({
  numberOfChunks: WORKERS_NUMBER,
  mapFunction: evaluateChunk,
});

// ---REPRODUCE---
const [crossoverChunk, terminateCrossoverWorkers] = createParallelExecutor({
  workersNumber: WORKERS_NUMBER,
  workerFileName: './examples/example3-parallelExecution/crossoverChunkWorker.js',
  createWorker: createNodeJSWorker,
});

const crossoverInChunks = mapInAsyncChunks({
  numberOfChunks: WORKERS_NUMBER,
  mapFunction: crossoverChunk,
});

const reproduce = Genemo.reproduceHighLevel({
  crossoverAll: crossoverInChunks,
  mutate: Genemo.mutation.swapTwoGenes(),
  mutationProbability: 0.02,
});

// ---EVOLUTION OPTIONS---
const evolutionOptions = {
  generateInitialPopulation: Genemo.generateInitialPopulation({
    generateIndividual,
    size: 160,
  }),
  selection: Genemo.selection.rank({ minimizeFitness: true }),
  reproduce,
  evaluatePopulation,
  stopCondition: Genemo.stopCondition({ maxIterations: 100 }),
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
  terminateEvaluateWorkers();
  terminateCrossoverWorkers();
});
