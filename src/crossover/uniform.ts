import R from 'ramda';
import { Rng } from '../sharedTypes';

const createOffspring = <Gene>([parentA, parentB]: [Array<Gene>, Array<Gene>], random: Rng) => (
  R.zip(parentA, parentB).map(([geneA, geneB]) => (random() >= 0.5 ? geneA : geneB))
);

const uniformCrossover = () => <Gene>(
  [mother, father]: [Array<Gene>, Array<Gene>],
  random: Rng,
) => {
  const son = createOffspring([mother, father], random);
  const daughter = createOffspring([father, mother], random);
  return [son, daughter];
};

export default uniformCrossover;
