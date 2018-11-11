const R = require('ramda');
const binaryRangeSearch = require('../../utils/binaryRangeSearch');

const selectRouletteElement = (normalizedCumulativeFitness, randomValue) => {
  const compare = element => randomValue < element.cumulativeFitness;
  return R.pick(
    ['individual', 'fitness'],
    binaryRangeSearch(normalizedCumulativeFitness, compare).evaluatedIndividual,
  );
};

module.exports = {
  selectRouletteElement,
};
