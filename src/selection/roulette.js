const R = require('ramda');
const binaryRangeSearch = require('../utils/binaryRangeSearch');

const rouletteSelection = (evaluatedPopulation, random) => {
  const cumulativeFitness = R.scan(
    (prev, currIndividual) => ({
      evaluatedIndividual: currIndividual,
      cumulativeFitness: prev.cumulativeFitness + currIndividual.fitness,
    }),
    { cumulativeFitness: 0 },
    evaluatedPopulation,
  );

  const fitnessSum = R.last(cumulativeFitness).cumulativeFitness;

  const normalizedCumulativeFitness = cumulativeFitness.map(obj => (
    { ...obj, cumulativeFitness: obj.cumulativeFitness / fitnessSum }
  ));

  return new Array(evaluatedPopulation.length).fill().map(() => {
    const randomValue = random();
    const compare = element => randomValue < element.cumulativeFitness;
    return binaryRangeSearch(normalizedCumulativeFitness, compare).evaluatedIndividual;
  });
};

module.exports = rouletteSelection;
