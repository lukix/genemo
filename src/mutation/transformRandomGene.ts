import { Rng } from '../sharedTypes';

// Warning: the following function modifies its parameter (to increase performance)
const transformRandomGene = <Gene>(transformFunc: (gene: Gene, random: Rng) => Gene) => (
  individual: Array<Gene>,
  random: Rng,
) => {
  const mutationPoint = Math.floor(random() * individual.length);

  // Modifying an array in order to increase performance
  // eslint-disable-next-line no-param-reassign
  individual[mutationPoint] = transformFunc(individual[mutationPoint], random);
  return individual;
};

export default transformRandomGene;
