import { Rng, Population } from './sharedTypes';

export interface GenerateInitialPopulationOptions<Individual> {
  generateIndividual: (random: Rng) => Individual;
  size: number;
}

export const generateInitialPopulation = <Individual>(
  options: GenerateInitialPopulationOptions<Individual>,
): (random: Rng) => Population<Individual> => {
  const { generateIndividual, size } = options;

  return random => Array(size).fill(null).map(() => generateIndividual(random));
};
