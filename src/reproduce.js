const R = require('ramda');
const randomFromRange = require('./utils/randomFromRange');
const { checkProps, types } = require('./utils/typeChecking');

const reproducePropTypes = {
  mutate: { type: types.FUNCTION, isRequired: true },
  crossover: { type: types.FUNCTION, isRequired: true },
  mutationProbability: { type: types.NUMBER, isRequired: true },
};

const getRandomIndividual = (population, random) => {
  const index = randomFromRange(random)(0, population.length - 1);
  return population[index];
};

const reproduce = ({
  mutate,
  crossover,
  mutationProbability = 0.01,
}) => {
  checkProps({
    functionName: 'Genemo.reproduce',
    props: {
      mutate,
      crossover,
      mutationProbability,
    },
    propTypes: reproducePropTypes,
  });

  return (evaluatedPopulation, random) => {
    const targetPopulationSize = evaluatedPopulation.length;

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

    const mutatedPopulation = newPopulation.map(individual => (
      random() <= mutationProbability
        ? mutate(individual, random)
        : individual
    ));

    return mutatedPopulation;
  };
};

module.exports = {
  reproduce,
};
