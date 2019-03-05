/* eslint-disable no-await-in-loop */

const Joi = require('joi');
const { withPropsChecking } = require('./utils/typeChecking');
const asyncify = require('./utils/asyncify');
const DebugDataCollector = require('./utils/DebugDataCollector');

const runnerPropTypes = {
  generateInitialPopulation: Joi.func().maxArity(1).required(),
  selection: Joi.func().maxArity(2).required(),
  reproduce: Joi.func().maxArity(2).required(),
  succession: Joi.func().maxArity(2),
  fitness: Joi.func().maxArity(1).required(),
  random: Joi.func().maxArity(0),
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

const getGenerationsIterator = withPropsChecking('Genemo.getGenerationsIterator', function* ({
  generateInitialPopulation,
  selection,
  reproduce,
  succession = ({ childrenPopulation }) => childrenPopulation,
  fitness,
  random = Math.random,
}) {
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
})({
  ...runnerPropTypes,
});

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
const runEvolution = withPropsChecking('Genemo.runEvolution', ({
  generateInitialPopulation,
  selection,
  reproduce,
  succession = ({ childrenPopulation }) => childrenPopulation,
  fitness,
  stopCondition,
  random = Math.random,
  iterationCallback = () => {},
}) => {
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
    debugDataCollector.startClock('iteration');
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
    debugDataCollector.collectClockValue('iteration');
  }
})({
  ...runnerPropTypes,
  stopCondition: Joi.func().maxArity(1).required(),
  iterationCallback: Joi.func().maxArity(1),
});

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
const runEvolutionAsync = withPropsChecking('Genemo.runEvolutionAsync', async ({
  generateInitialPopulation,
  selection,
  reproduce,
  succession = ({ childrenPopulation }) => childrenPopulation,
  fitness,
  stopCondition,
  random = Math.random,
}) => {
  const mainLoopBody = asyncify(async ({ evaluatedPopulation }) => {
    const parentsPopulation = await selection(evaluatedPopulation, random);
    const childrenPopulation = await reproduce(parentsPopulation, random);
    const evaluatedChildrenPopulation = await evaluatePopulationAsync(childrenPopulation, fitness);
    const newEvaluatedPopulation = await succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    }, random);
    return newEvaluatedPopulation;
  });

  let generation = 0;
  const population = await generateInitialPopulation(random);
  let evaluatedPopulation = await evaluatePopulationAsync(population, fitness, random);
  do {
    generation += 1;
    evaluatedPopulation = await mainLoopBody({ evaluatedPopulation });
  } while (!(await stopCondition({ evaluatedPopulation, generation })));
  return { evaluatedPopulation, generation };
})({
  ...runnerPropTypes,
  stopCondition: Joi.func().maxArity(1).required(),
});

module.exports = {
  runEvolution,
  runEvolutionAsync,
  getGenerationsIterator,
};
