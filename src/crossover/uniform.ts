import R from 'ramda';

const createOffspring = ([parentA, parentB], random) => (
  R.zip(parentA, parentB).map(([geneA, geneB]) => (random() >= 0.5 ? geneA : geneB))
);

const uniformCrossover = () => ([mother, father], random) => {
  const son = createOffspring([mother, father], random);
  const daughter = createOffspring([father, mother], random);
  return [son, daughter];
};

export default uniformCrossover;
