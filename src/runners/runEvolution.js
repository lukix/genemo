/* eslint-disable no-await-in-loop */

const { checkProps, types } = require('../utils/typeChecking');
const DebugDataCollector = require('../utils/DebugDataCollector');
const runnerPropTypes = require('./utils/runnerPropTypes');
const { evaluatePopulation } = require('./utils/evaluatePopulation');


/**
 * Runs genetic algorithm until stopCondition returns true
 *
 * @param {Object} options
 * @param {(random: () => number) => Array<any>} options.generateInitialPopulation
 * @param {(evaluatedPopulation: Array<any>, random: () => number) => Array<any>} options.selection
 * @param {(evaluatedPopulation: Array<any>, random: () => number) => Array<any>} options.reproduce
 * @param {({ prevPopulation: Array<Object>, childrenPopulation: Array<Object> }, random: () => number) => Array<Object>} options.succession
 * @param {(individual: any) => number} options.fitness
 * @param {({ evaluatedPopulation: Array<Object>, generation: number }) => boolean} options.stopCondition
 *
 * @returns {{ evaluatedPopulation: Array<Object>, generation: number }} Last generation information
 */
const runEvolution = ({
  generateInitialPopulation,
  selection,
  reproduce,
  succession = ({ childrenPopulation }) => childrenPopulation,
  fitness,
  stopCondition,
  random = Math.random,
  iterationCallback = () => {},
}) => {
  checkProps({
    functionName: 'Genemo.runEvolution',
    props: {
      generateInitialPopulation,
      selection,
      reproduce,
      succession,
      fitness,
      stopCondition,
      random,
      iterationCallback,
    },
    propTypes: {
      ...runnerPropTypes,
      stopCondition: { type: types.FUNCTION, isRequired: true },
      iterationCallback: { type: types.FUNCTION, isRequired: true },
    },
  });

  const debugDataCollector = new DebugDataCollector();

  const mainLoopBody = ({ evaluatedPopulation }) => {
    debugDataCollector.startClock('selection');
    const parentsPopulation = selection(evaluatedPopulation, random);
    debugDataCollector.collectClockValue('selection');

    debugDataCollector.startClock('reproduce');
    const childrenPopulation = reproduce(parentsPopulation, random);
    debugDataCollector.collectClockValue('reproduce');

    debugDataCollector.startClock('fitness');
    const evaluatedChildrenPopulation = evaluatePopulation(childrenPopulation, fitness);
    debugDataCollector.collectClockValue('fitness');

    debugDataCollector.startClock('succession');
    const newEvaluatedPopulation = succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    }, random);
    debugDataCollector.collectClockValue('succession');

    return newEvaluatedPopulation;
  };

  let generation = 0;
  const population = generateInitialPopulation(random);
  let evaluatedPopulation = evaluatePopulation(population, fitness, random);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    debugDataCollector.startClock('lastIteration');
    generation += 1;
    evaluatedPopulation = mainLoopBody({ evaluatedPopulation });

    debugDataCollector.startClock('stopCondition');
    const shouldStop = stopCondition({ evaluatedPopulation, generation });
    debugDataCollector.collectClockValue('stopCondition');

    debugDataCollector.startClock('iterationCallback');
    iterationCallback({ evaluatedPopulation, generation, debugData: debugDataCollector.data });
    debugDataCollector.collectClockValue('iterationCallback');

    if (shouldStop) {
      return { evaluatedPopulation, generation };
    }
    debugDataCollector.collectClockValue('lastIteration');
  }
};

module.exports = runEvolution;
