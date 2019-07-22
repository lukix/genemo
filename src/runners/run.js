/* eslint-disable no-await-in-loop */

const R = require('ramda');
const { checkProps } = require('../utils/typeChecking');
const DebugDataCollector = require('../utils/DebugDataCollector');
const runnerPropTypes = require('./utils/runnerPropTypes');
const batchIterationExecutor = require('./utils/batchIterationExecutor');

const mergeFitnessValuesWithPopulation = (population, fitnessValues) => (
  R.zip(population, fitnessValues).map(([individual, fitness]) => ({
    individual,
    fitness,
  }))
);

/**
 * Runs genetic algorithm until stopCondition returns true
 *
 * @param {Object} options
 * @param {(random: () => number) => Array<any>} options.generateInitialPopulation
 * @param {(evaluatedPopulation: Array<any>, random: () => number) => Array<any>} options.selection
 * @param {(evaluatedPopulation: Array<any>, random: () => number) => Array<any>} options.reproduce
 * @param {({ prevPopulation: Array<Object>, childrenPopulation: Array<Object> }, random: () => number) => Array<Object>} options.succession
 * @param {(individual: any) => number} options.evaluatePopulation
 * @param {({ evaluatedPopulation: Array<Object>, iteration: number }) => boolean} options.stopCondition
 * @param {number} options.maxBlockingTime
 *
 * @returns {{ evaluatedPopulation: Array<Object>, iteration: number }} Last iteration information
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
    evaluatePopulation,
    stopCondition,
    random = Math.random,
    iterationCallback = () => {},
    maxBlockingTime = Infinity,
  } = options;

  const logsCollector = new DebugDataCollector();
  const collectReproduceLog = (key, value) => logsCollector.collect(`reproduce.${key}`, value);

  const mainLoopBody = async ({ evaluatedPopulation }) => {
    logsCollector.startClock('selection');
    const parentsPopulation = await selection(evaluatedPopulation, random);
    logsCollector.collectClockValue('selection');

    logsCollector.startClock('reproduce');
    const childrenPopulation = await reproduce(
      parentsPopulation,
      random,
      collectReproduceLog,
    );
    logsCollector.collectClockValue('reproduce');

    logsCollector.startClock('evaluatePopulation');
    const evaluatedChildrenPopulation = mergeFitnessValuesWithPopulation(
      childrenPopulation,
      await evaluatePopulation(childrenPopulation, random),
    );
    logsCollector.collectClockValue('evaluatePopulation');

    logsCollector.startClock('succession');
    const newEvaluatedPopulation = await succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    }, random);
    logsCollector.collectClockValue('succession');

    return newEvaluatedPopulation;
  };

  const executeMainLoopBody = batchIterationExecutor({
    executeMainLoopBody: mainLoopBody,
    maxBlockingTime,
  });

  let iteration = 0;
  const initialPopulation = await generateInitialPopulation(random);
  let evaluatedPopulation = mergeFitnessValuesWithPopulation(
    initialPopulation,
    await evaluatePopulation(initialPopulation, random),
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    logsCollector.startClock('lastIteration');
    iteration += 1;
    evaluatedPopulation = await executeMainLoopBody({ evaluatedPopulation });

    logsCollector.startClock('stopCondition');
    const shouldStop = await stopCondition({ evaluatedPopulation, iteration });
    logsCollector.collectClockValue('stopCondition');

    logsCollector.startClock('iterationCallback');
    await iterationCallback({
      evaluatedPopulation,
      iteration,
      logs: logsCollector.data,
    });
    logsCollector.collectClockValue('iterationCallback');

    if (shouldStop) {
      logsCollector.collectClockValue('lastIteration');
      return {
        evaluatedPopulation,
        iteration,
        logs: logsCollector.data,
      };
    }
    logsCollector.collectClockValue('lastIteration');
  }
};

module.exports = run;
