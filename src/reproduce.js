const Joi = require('joi');
const R = require('ramda');
const randomFromRange = require('./utils/randomFromRange');
const { withPropsChecking } = require('./utils/typeChecking');

const getRandomIndividual = (population, random) => {
  const index = randomFromRange(random)(0, population.length - 1);
  return population[index];
};

const reproduce = withPropsChecking('Genemo.reproduce', ({
  mutate,
  crossover,
  mutationProbability = 0.01,
}) => (evaluatedPopulation, random) => {
  const targetPopulationSize = evaluatedPopulation.length;
  const newPopulation = [];
  while (newPopulation.length < targetPopulationSize) {
    const mother = getRandomIndividual(evaluatedPopulation, random).individual;
    const father = getRandomIndividual(evaluatedPopulation, random).individual;
    const [daughter, son] = crossover([mother, father], random);
    newPopulation.push(daughter, son);
  }

  if (newPopulation.length > targetPopulationSize) {
    newPopulation.pop();
  }

  const mutatedPopulation = newPopulation.map(individual => (
    random() <= mutationProbability
      ? mutate(individual, random)
      : individual
  ));

  return mutatedPopulation;
})({
  mutate: Joi.func().maxArity(2).required(),
  crossover: Joi.func().maxArity(2).required(),
  mutationProbability: Joi.number().min(0).max(1),
});

const reproduceAsync = withPropsChecking('Genemo.reproduceAsync', ({
  mutate,
  crossover,
  mutationProbability = 0.01,
}) => async (evaluatedPopulation, random) => {
  const targetPopulationSize = evaluatedPopulation.length;
  const crossoverPromises = R.range(0, Math.ceil(targetPopulationSize / 2))
    .map(() => {
      const mother = getRandomIndividual(evaluatedPopulation, random).individual;
      const father = getRandomIndividual(evaluatedPopulation, random).individual;
      return crossover([mother, father], random);
    });

  const childrenPairs = await Promise.all(crossoverPromises);
  const newPopulation = childrenPairs
    .reduce((childrenList, siblings) => {
      childrenList.push(...siblings);
      return childrenList;
    }, [])
    .slice(0, targetPopulationSize);

  const mutatedPopulation = await Promise.all(newPopulation.map(individual => (
    random() <= mutationProbability
      ? mutate(individual, random)
      : individual
  )));

  return mutatedPopulation;
})({
  mutate: Joi.func().maxArity(2).required(),
  crossover: Joi.func().maxArity(2).required(),
  mutationProbability: Joi.number().min(0).max(1),
});

module.exports = {
  reproduce,
  reproduceAsync,
};
