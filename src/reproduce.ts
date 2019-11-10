import R from 'ramda';

import { checkProps, types } from './utils/typeChecking';
import Timer from './utils/timer';
import getRandomIndividual from './utils/getRandomIndividual';
import { Rng, EvaluatedPopulation, Population } from './sharedTypes';

const DEFAULT_MUTATION_PROBABILITY = 0.01;

const reproducePropTypes = {
  mutate: { type: types.FUNCTION, isRequired: true },
  crossover: { type: types.FUNCTION, isRequired: true },
  mutationProbability: { type: types.NUMBER, isRequired: false },
};

export interface ReproduceOptions<Individual> {
  mutate: (individual: Individual, random: Rng) => Individual;
  crossover: (parents: [Individual, Individual], random: Rng) => [Individual, Individual];
  mutationProbability?: number;
}

const reproduce = <Individual>(options: ReproduceOptions<Individual>) => {
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

  return (
    evaluatedPopulation: EvaluatedPopulation<Individual>,
    random: Rng,
    collectLog: (key: string, value: any) => void,
  ): Population<Individual> => {
    const targetPopulationSize = evaluatedPopulation.length;

    timer.start();
    const childrenPairs = R.range(0, Math.ceil(targetPopulationSize / 2))
      .map(() => {
        const mother = getRandomIndividual(evaluatedPopulation, random).individual;
        const father = getRandomIndividual(evaluatedPopulation, random).individual;
        return crossover([mother, father], random);
      });
    const newPopulation = R.unnest(childrenPairs).slice(0, targetPopulationSize);
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

export default reproduce;
