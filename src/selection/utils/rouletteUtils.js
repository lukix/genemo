import R from 'ramda';
import binaryRangeSearch from '../../utils/binaryRangeSearch';

export const normalizeCumulativeFitness = (cumulativeFitness) => {
  const fitnessSum = R.last(cumulativeFitness).cumulativeFitness;

  return fitnessSum === 0
    ? cumulativeFitness.map((obj, index) => (
      { ...obj, cumulativeFitness: ((index + 1) / cumulativeFitness.length) }
    ))
    : cumulativeFitness.map(obj => (
      { ...obj, cumulativeFitness: obj.cumulativeFitness / fitnessSum }
    ));
};

export const selectRouletteElement = (normalizedCumulativeFitness, randomValue) => {
  const compare = element => randomValue < element.cumulativeFitness;
  return R.pick(
    ['individual', 'fitness'],
    binaryRangeSearch(normalizedCumulativeFitness, compare).evaluatedIndividual,
  );
};
