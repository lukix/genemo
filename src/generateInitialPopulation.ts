import { checkProps, types } from './utils/typeChecking';
import { Rng, Population } from './sharedTypes';

const propTypes = {
  generateIndividual: { type: types.FUNCTION, isRequired: true },
  size: { type: types.NUMBER, isRequired: true },
};

export interface GenerateInitialPopulationOptions<Individual> {
  generateIndividual: (random: Rng) => Individual;
  size: number;
}

export const generateInitialPopulation = <Individual>(
  options: GenerateInitialPopulationOptions<Individual>,
): (random: Rng) => Population<Individual> => {
  checkProps({
    functionName: 'Genemo.generateInitialPopulation',
    props: options,
    propTypes,
  });

  const { generateIndividual, size } = options;

  return random => Array(size).fill(null).map(() => generateIndividual(random));
};
