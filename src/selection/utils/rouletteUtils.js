const R = require('ramda');
const binaryRangeSearch = require('../../utils/binaryRangeSearch');

const normalizeCumulativeFitness = (cumulativeFitness) => {
  const fitnessSum = R.last(cumulativeFitness).cumulativeFitness;

  return fitnessSum === 0
    ? cumulativeFitness.map((obj, index) => (
      { ...obj, cumulativeFitness: (index + 1) / cumulativeFitness.length }
    ))
    : cumulativeFitness.map(obj => (
      { ...obj, cumulativeFitness: obj.cumulativeFitness / fitnessSum }
    ));
};

const selectRouletteElement = (normalizedCumulativeFitness, randomValue) => {
  const compare = element => randomValue < element.cumulativeFitness;
  return R.pick(
    ['individual', 'fitness'],
    binaryRangeSearch(normalizedCumulativeFitness, compare).evaluatedIndividual,
  );
};

module.exports = {
  normalizeCumulativeFitness,
  selectRouletteElement,
};
