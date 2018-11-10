const Joi = require('joi');
const { withPropsChecking } = require('./utils/typeChecking');
const findInIterator = require('./utils/findInIterator');

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
  succession,
  fitness,
  stopCondition,
  random,
}) => {
  const generationsIterator = getGenerationsIterator({
    generateInitialPopulation,
    selection,
    reproduce,
    succession,
    fitness,
    random,
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
