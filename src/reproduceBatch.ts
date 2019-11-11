import R from 'ramda';

import { checkProps, types } from './utils/typeChecking';
import Timer from './utils/timer';
import getRandomIndividual from './utils/getRandomIndividual';
import { Rng, EvaluatedPopulation, Population } from './sharedTypes';

export const selectParentsPairs = <Individual>(
  { evaluatedPopulation, targetPopulationSize, random }: {
    evaluatedPopulation: EvaluatedPopulation<Individual>;
    targetPopulationSize: number;
    random: Rng;
  },
): Array<[Individual, Individual]> => (
    R.range(0, Math.ceil(targetPopulationSize / 2))
      .map(() => {
        const mother = getRandomIndividual(evaluatedPopulation, random).individual;
        const father = getRandomIndividual(evaluatedPopulation, random).individual;
        return [mother, father];
      })
  );

const getIndividualsByMutationInfo = ({ individuals, shouldBeMutated }) => (
  individuals
    .filter(item => item.shouldBeMutated === shouldBeMutated)
    .map(({ individual }) => individual)
);

const DEFAULT_MUTATION_PROBABILITY = 0.01;

const reproduceBatchPropTypes = {
  mutateAll: { type: types.FUNCTION, isRequired: true },
  crossoverAll: { type: types.FUNCTION, isRequired: true },
  mutationProbability: { type: types.NUMBER, isRequired: false },
};

export interface ReproduceBatchOptions<Individual> {
  mutateAll: (individuals: Array<Individual>, random: Rng) => Array<Individual>;
  crossoverAll: (
    parentsPairs: Array<[Individual, Individual]>,
    random: Rng,
  ) => Array<[Individual, Individual]>;
  mutationProbability?: number;
}

const reproduceBatch = <Individual>(options: ReproduceBatchOptions<Individual>) => {
  checkProps({
    functionName: 'Genemo.reproduceBatch',
    props: options,
    propTypes: reproduceBatchPropTypes,
  });

  const {
    mutateAll,
    crossoverAll,
    mutationProbability = DEFAULT_MUTATION_PROBABILITY,
  } = options;

  const timer = Timer();

  return async (
    evaluatedPopulation: EvaluatedPopulation<Individual>,
    random: Rng,
    collectLog: (key: string, value: any) => void,
  ): Promise<Population<Individual>> => {
    const targetPopulationSize = evaluatedPopulation.length;

    timer.start();
    const parentsPairs = selectParentsPairs({ evaluatedPopulation, targetPopulationSize, random });
    const childrenPairs = await crossoverAll(parentsPairs, random);
    const newPopulation = R.unnest(childrenPairs).slice(0, targetPopulationSize);
    collectLog('crossover', timer.stop());

    timer.start();
    const populationPreparedForMutation = newPopulation.map(individual => ({
      individual,
      shouldBeMutated: random() <= mutationProbability,
    }));

    const individualsToBeMutated = getIndividualsByMutationInfo({
      individuals: populationPreparedForMutation,
      shouldBeMutated: true,
    });

    const unchangedIndividuals = getIndividualsByMutationInfo({
      individuals: populationPreparedForMutation,
      shouldBeMutated: false,
    });

    const mutatedIndividuals = await mutateAll(
      individualsToBeMutated,
      random,
    );
    const mutatedPopulation = [
      ...unchangedIndividuals,
      ...mutatedIndividuals,
    ];

    collectLog('mutation', timer.stop());

    return mutatedPopulation;
  };
};

export default reproduceBatch;
