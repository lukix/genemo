const R = require('ramda');
const randomFromRange = require('./utils/randomFromRange');
const { checkProps, types } = require('./utils/typeChecking');
const Timer = require('./utils/timer');

const propTypes = {
  mutate: { type: types.FUNCTION, isRequired: true },
  crossover: { type: types.FUNCTION, isRequired: true },
  mutationProbability: { type: types.NUMBER, isRequired: false },
};

const getRandomIndividual = (population, random) => {
  const index = randomFromRange(random)(0, population.length - 1);
  return population[index];
};

const reproduce = (options) => {
  checkProps({
    functionName: 'Genemo.reproduce',
    props: options,
    propTypes,
  });

  const {
    mutate,
    crossover,
    mutationProbability = 0.01,
  } = options;

  const timer = Timer();

  return (evaluatedPopulation, random, collectLog) => {
    const targetPopulationSize = evaluatedPopulation.length;

    timer.start();
    const childrenPairs = R.range(0, Math.ceil(targetPopulationSize / 2))
      .map(() => {
        const mother = getRandomIndividual(evaluatedPopulation, random).individual;
        const father = getRandomIndividual(evaluatedPopulation, random).individual;
        return crossover([mother, father], random);
      });
    const newPopulation = childrenPairs
      .reduce((childrenList, siblings) => {
        childrenList.push(...siblings);
        return childrenList;
      }, [])
      .slice(0, targetPopulationSize);
    collectLog('crossover', timer.stop());

    timer.start();
    const mutatedPopulation = newPopulation.map(individual => (
      random() <= mutationProbability
        ? mutate(individual, random)
        : individual
    ));
    collectLog('mutation', timer.stop());

    return mutatedPopulation;
  };
};

module.exports = {
  reproduce,
};
