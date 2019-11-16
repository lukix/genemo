import R from 'ramda';
import binaryRangeSearch from '../../utils/binaryRangeSearch';

export const normalizeCumulativeFitness = <T extends { cumulativeFitness: number }>(
  cumulativeFitness: Array<T>,
) => {
  const fitnessSum = R.last(cumulativeFitness).cumulativeFitness;

  return fitnessSum === 0
    ? cumulativeFitness.map((obj, index) => (
      { ...obj, cumulativeFitness: ((index + 1) / cumulativeFitness.length) }
    ))
    : cumulativeFitness.map(obj => (
      { ...obj, cumulativeFitness: obj.cumulativeFitness / fitnessSum }
    ));
};

type CumulativeFitnessItem<Individual> = {
  individual: Individual;
  fitness: number;
  cumulativeFitness: number;
}

export const selectRouletteElement = <Individual>(
  normalizedCumulativeFitness: Array<CumulativeFitnessItem<Individual>>,
  randomValue: number,
) => {
  const compare = (element: CumulativeFitnessItem<Individual>) => (
    randomValue < element.cumulativeFitness
  );
  const foundElement = binaryRangeSearch(
    normalizedCumulativeFitness,
    compare,
  ) as { individual: Individual; fitness: number; cumulativeFitness: number }; // randomValue is always < 1 and cumulativeFitness has always an element = 1, so there is always some element found

  return R.pick(
    ['individual', 'fitness'],
    foundElement,
  );
};
