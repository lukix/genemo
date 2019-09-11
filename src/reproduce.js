const R = require('ramda');
const randomFromRange = require('./utils/randomFromRange');
const { checkProps, types } = require('./utils/typeChecking');
const Timer = require('./utils/timer');

const DEFAULT_MUTATION_PROBABILITY = 0.01;

const reproducePropTypes = {
  mutate: { type: types.FUNCTION, isRequired: true },
  crossover: { type: types.FUNCTION, isRequired: true },
  mutationProbability: { type: types.NUMBER, isRequired: false },
};

const reproduceHighLevelPropTypes = {
  mutateAll: { type: types.FUNCTION, isRequired: true },
  crossoverAll: { type: types.FUNCTION, isRequired: true },
  mutationProbability: { type: types.NUMBER, isRequired: false },
};

const getRandomIndividual = (population, random) => {
  const index = randomFromRange(random)(0, population.length - 1);
  return population[index];
};

const reproduceHighLevel = (options) => {
  checkProps({
    functionName: 'Genemo.reproduceHighLevel',
    props: options,
    propTypes: reproduceHighLevelPropTypes,
  });

  const {
    mutateAll,
    crossoverAll,
    mutationProbability = DEFAULT_MUTATION_PROBABILITY,
  } = options;

  const timer = Timer();

  return async (evaluatedPopulation, random, collectLog) => {
    const targetPopulationSize = evaluatedPopulation.length;

    timer.start();
    const parentsPairs = R.range(0, Math.ceil(targetPopulationSize / 2))
      .map(() => {
        const mother = getRandomIndividual(evaluatedPopulation, random).individual;
        const father = getRandomIndividual(evaluatedPopulation, random).individual;
        return [mother, father];
      });
    const childrenPairs = await crossoverAll(parentsPairs, random);
    const newPopulation = childrenPairs
      .reduce((childrenList, siblings) => {
        childrenList.push(...siblings);
        return childrenList;
      }, [])
      .slice(0, targetPopulationSize);
    collectLog('crossover', timer.stop());

    timer.start();
    const populationPreparedForMutation = newPopulation.map(individual => (
      random() <= mutationProbability
        ? { individual, shouldBeMutated: true }
        : { individual, shouldBeMutated: false }
    ));

    const {
      true: individualsToBeMutated = [],
      false: unchangedIndividuals = [],
    } = R.groupBy(
      ({ shouldBeMutated }) => shouldBeMutated,
      populationPreparedForMutation,
    );

    const mutatedIndividuals = await mutateAll(
      individualsToBeMutated.map(({ individual }) => individual),
      random,
    );
    const mutatedPopulation = [
      ...unchangedIndividuals.map(({ individual }) => individual),
      ...mutatedIndividuals,
    ];

    collectLog('mutation', timer.stop());

    return mutatedPopulation;
  };
};

const reproduce = (options) => {
  checkProps({
    functionName: 'Genemo.reproduce',
    props: options,
    propTypes: reproducePropTypes,
  });

  const {
    mutate,
    crossover,
    mutationProbability = DEFAULT_MUTATION_PROBABILITY,
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
  reproduceHighLevel,
  reproduce,
};
