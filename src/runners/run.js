/* eslint-disable no-await-in-loop */

const { checkProps } = require('../utils/typeChecking');
const DebugDataCollector = require('../utils/DebugDataCollector');
const runnerPropTypes = require('./utils/runnerPropTypes');
const evaluatePopulation = require('./utils/evaluatePopulation');
const batchIterationExecutor = require('./utils/batchIterationExecutor');

/**
 * Runs genetic algorithm until stopCondition returns true
 * Every generation is run asynchronously.
 *
 * @param {Object} options
 * @param {(random: () => number) => Array<any>} options.generateInitialPopulation
 * @param {(evaluatedPopulation: Array<any>, random: () => number) => Array<any>} options.selection
 * @param {(evaluatedPopulation: Array<any>, random: () => number) => Array<any>} options.reproduce
 * @param {({ prevPopulation: Array<Object>, childrenPopulation: Array<Object> }, random: () => number) => Array<Object>} options.succession
 * @param {(individual: any) => number} options.fitness
 * @param {({ evaluatedPopulation: Array<Object>, generation: number }) => boolean} options.stopCondition
 * @param {number} options.maxBlockingTime
 *
 * @returns {{ evaluatedPopulation: Array<Object>, generation: number }} Last generation information
 */
const run = async (options) => {
  checkProps({
    functionName: 'Genemo.run',
    props: options,
    propTypes: runnerPropTypes,
  });

  const {
    generateInitialPopulation,
    selection,
    reproduce,
    succession = ({ childrenPopulation }) => childrenPopulation,
    fitness,
    stopCondition,
    random = Math.random,
    iterationCallback = () => {},
    maxBlockingTime = Infinity,
  } = options;

  const debugDataCollector = new DebugDataCollector();

  const mainLoopBody = async ({ evaluatedPopulation }) => {
    debugDataCollector.startClock('selection');
    const parentsPopulation = await selection(evaluatedPopulation, random);
    debugDataCollector.collectClockValue('selection');

    debugDataCollector.startClock('reproduce');
    const childrenPopulation = await reproduce(parentsPopulation, random);
    debugDataCollector.collectClockValue('reproduce');

    debugDataCollector.startClock('fitness');
    const evaluatedChildrenPopulation = await evaluatePopulation(childrenPopulation, fitness);
    debugDataCollector.collectClockValue('fitness');

    debugDataCollector.startClock('succession');
    const newEvaluatedPopulation = await succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    }, random);
    debugDataCollector.collectClockValue('succession');

    return newEvaluatedPopulation;
  };

  const executeMainLoopBody = batchIterationExecutor({
    executeMainLoopBody: mainLoopBody,
    maxBlockingTime,
  });

  let generation = 0;
  const population = await generateInitialPopulation(random);
  let evaluatedPopulation = await evaluatePopulation(population, fitness, random);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    debugDataCollector.startClock('lastIteration');
    generation += 1;
    evaluatedPopulation = await executeMainLoopBody({ evaluatedPopulation });

    debugDataCollector.startClock('stopCondition');
    const shouldStop = await stopCondition({ evaluatedPopulation, generation });
    debugDataCollector.collectClockValue('stopCondition');

    debugDataCollector.startClock('iterationCallback');
    await iterationCallback({
      evaluatedPopulation,
      generation,
      debugData: debugDataCollector.data,
    });
    debugDataCollector.collectClockValue('iterationCallback');

    if (shouldStop) {
      return { evaluatedPopulation, generation };
    }
    debugDataCollector.collectClockValue('lastIteration');
  }
};

module.exports = run;
