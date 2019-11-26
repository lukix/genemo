import R from 'ramda';
import Timer from './utils/timer';
import getRandomIndividual from './utils/getRandomIndividual';
import { Rng, EvaluatedPopulation, Population } from './sharedTypes';

const DEFAULT_MUTATION_PROBABILITY = 0.01;

export interface ReproduceOptions<Individual> {
  mutate: (individual: Individual, random: Rng) => Individual;
  crossover: (parents: [Individual, Individual], random: Rng) => [Individual, Individual];
  mutationProbability?: number;
}

const reproduce = <Individual>(options: ReproduceOptions<Individual>) => {
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
