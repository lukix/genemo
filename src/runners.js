const Joi = require('joi');
const { withPropsChecking } = require('./utils/typeChecking');
const findInIterator = require('./utils/findInIterator');

const runnerPropTypes = {
  generateInitialPopulation: Joi.func().maxArity(0).required(), // () => population
  selection: Joi.func().maxArity(1).required(), // evaluatedPopulation => evaluatedPopulation
  reproduce: Joi.func().maxArity(1).required(), // evaluatedPopulation => population
  fitness: Joi.func().maxArity(1).required(), // individual => number
};

const evaluatePopulation = (population, fitnessFunc) => population.map(individual => ({
  individual,
  fitness: fitnessFunc(individual),
}));

const getGenerationsIterator = withPropsChecking('GMO.getGenerationsIterator', function* ({
  generateInitialPopulation,
  selection,
  reproduce,
  fitness,
}) {
  let generation = 0;
  const population = generateInitialPopulation();
  let evaluatedPopulation = evaluatePopulation(population, fitness);
  while (true) {
    generation += 1;
    const parentsPopulation = selection(evaluatedPopulation);
    const newPopulation = reproduce(parentsPopulation);
    evaluatedPopulation = evaluatePopulation(newPopulation, fitness);
    yield { evaluatedPopulation, generation };
  }
})({
  ...runnerPropTypes,
});

/**
 * Runs genetic algorithm until stopCondition returns true
 *
 * @param {Object} options
 * @param {() => Array<any>} options.generateInitialPopulation
 * @param {(evaluatedPopulation: Array<any>) => Array<any>} options.selection
 * @param {(evaluatedPopulation: Array<any>) => Array<any>} options.reproduce
 * @param {(individual: any) => number} options.fitness
 * @param {({ evaluatedPopulation: Array<Object>, generation: number }) => boolean} options.stopCondition
 *
 * @returns {{ evaluatedPopulation: Array<Object>, generation: number }} Last generation information
 */
const runEvolution = withPropsChecking('GMO.runEvolution', ({
  generateInitialPopulation,
  selection,
  reproduce,
  fitness,
  stopCondition,
}) => {
  const generationsIterator = getGenerationsIterator({
    generateInitialPopulation,
    selection,
    reproduce,
    fitness,
  });

  const lastGenerationInfo = findInIterator(stopCondition, generationsIterator);
  return lastGenerationInfo;
})({
  ...runnerPropTypes,
  stopCondition: Joi.func().maxArity(1).required(), // ({ evaluatedPopulation, generation }) => boolean
});

module.exports = {
  runEvolution,
  getGenerationsIterator,
};
