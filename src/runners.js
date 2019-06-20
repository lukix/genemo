/* eslint-disable no-await-in-loop */

const { checkProps, types } = require('./utils/typeChecking');
const asyncify = require('./utils/asyncify');
const DebugDataCollector = require('./utils/DebugDataCollector');

const runnerPropTypes = {
  generateInitialPopulation: { type: types.FUNCTION, isRequired: true },
  selection: { type: types.FUNCTION, isRequired: true },
  reproduce: { type: types.FUNCTION, isRequired: true },
  succession: { type: types.FUNCTION, isRequired: true },
  fitness: { type: types.FUNCTION, isRequired: true },
  random: { type: types.FUNCTION, isRequired: true },
};

const evaluatePopulation = (population, fitnessFunc) => population.map(individual => ({
  individual,
  fitness: fitnessFunc(individual),
}));

const evaluatePopulationAsync = (population, fitnessFunc) => (
  Promise.all(
    population.map(async individual => ({
      individual,
      fitness: await fitnessFunc(individual),
    })),
  )
);

const getGenerationsIterator = function* ({
  generateInitialPopulation,
  selection,
  reproduce,
  succession = ({ childrenPopulation }) => childrenPopulation,
  fitness,
  random = Math.random,
}) {
  checkProps({
    functionName: 'Genemo.getGenerationsIterator',
    props: {
      generateInitialPopulation,
      selection,
      reproduce,
      succession,
      fitness,
      random,
    },
    propTypes: { ...runnerPropTypes },
  });

  let generation = 0;
  const population = generateInitialPopulation(random);
  let evaluatedPopulation = evaluatePopulation(population, fitness, random);
  while (true) {
    generation += 1;
    const parentsPopulation = selection(evaluatedPopulation, random);
    const childrenPopulation = reproduce(parentsPopulation, random);
    const evaluatedChildrenPopulation = evaluatePopulation(childrenPopulation, fitness);
    evaluatedPopulation = succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    }, random);
    yield { evaluatedPopulation, generation };
  }
};

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
 *
 * @returns {{ evaluatedPopulation: Array<Object>, generation: number }} Last generation information
 */
const runEvolutionAsync = async ({
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
    functionName: 'Genemo.runEvolutionAsync',
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

  const mainLoopBody = asyncify(async ({ evaluatedPopulation }) => {
    debugDataCollector.startClock('selection');
    const parentsPopulation = await selection(evaluatedPopulation, random);
    debugDataCollector.collectClockValue('selection');

    debugDataCollector.startClock('reproduce');
    const childrenPopulation = await reproduce(parentsPopulation, random);
    debugDataCollector.collectClockValue('reproduce');

    debugDataCollector.startClock('fitness');
    const evaluatedChildrenPopulation = await evaluatePopulationAsync(childrenPopulation, fitness);
    debugDataCollector.collectClockValue('fitness');

    debugDataCollector.startClock('succession');
    const newEvaluatedPopulation = await succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    }, random);
    debugDataCollector.collectClockValue('succession');

    return newEvaluatedPopulation;
  });

  let generation = 0;
  const population = await generateInitialPopulation(random);
  let evaluatedPopulation = await evaluatePopulationAsync(population, fitness, random);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    debugDataCollector.startClock('lastIteration');
    generation += 1;
    evaluatedPopulation = await mainLoopBody({ evaluatedPopulation });

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

module.exports = {
  runEvolution,
  runEvolutionAsync,
  getGenerationsIterator,
};
