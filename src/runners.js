const Joi = require('joi');
const { withPropsChecking } = require('./utils/typeChecking');
const findInIterator = require('./utils/findInIterator');

const runnerPropTypes = {
  generateInitialPopulation: Joi.func().maxArity(0).required(),
  selection: Joi.func().maxArity(1).required(),
  reproduce: Joi.func().maxArity(1).required(),
  succession: Joi.func().maxArity(1),
  fitness: Joi.func().maxArity(1).required(),
};

const evaluatePopulation = (population, fitnessFunc) => population.map(individual => ({
  individual,
  fitness: fitnessFunc(individual),
}));

const getGenerationsIterator = withPropsChecking('GMO.getGenerationsIterator', function* ({
  generateInitialPopulation,
  selection,
  reproduce,
  succession = ({ childrenPopulation }) => childrenPopulation,
  fitness,
}) {
  let generation = 0;
  const population = generateInitialPopulation();
  let evaluatedPopulation = evaluatePopulation(population, fitness);
  while (true) {
    generation += 1;
    const parentsPopulation = selection(evaluatedPopulation);
    const childrenPopulation = reproduce(parentsPopulation);
    const evaluatedChildrenPopulation = evaluatePopulation(childrenPopulation, fitness);
    evaluatedPopulation = succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    });
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
 * @param {({ prevPopulation: Array<Object>, childrenPopulation: Array<Object> }) => Array<Object>}
 * @param {(individual: any) => number} options.fitness
 * @param {({ evaluatedPopulation: Array<Object>, generation: number }) => boolean} options.stopCondition
 *
 * @returns {{ evaluatedPopulation: Array<Object>, generation: number }} Last generation information
 */
const runEvolution = withPropsChecking('GMO.runEvolution', ({
  generateInitialPopulation,
  selection,
  reproduce,
  succession,
  fitness,
  stopCondition,
}) => {
  const generationsIterator = getGenerationsIterator({
    generateInitialPopulation,
    selection,
    reproduce,
    succession,
    fitness,
  });

  const lastGenerationInfo = findInIterator(stopCondition, generationsIterator);
  return lastGenerationInfo;
})({
  ...runnerPropTypes,
  stopCondition: Joi.func().maxArity(1).required(),
});

module.exports = {
  runEvolution,
  getGenerationsIterator,
};
