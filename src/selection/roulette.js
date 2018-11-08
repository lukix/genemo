const R = require('ramda');
const binaryRangeSearch = require('../utils/binaryRangeSearch');

const rouletteSelection = ({ minimizeFitness = false } = {}) => (evaluatedPopulation, random) => {
  const minFitness = Math.min(...evaluatedPopulation.map(({ fitness }) => fitness));
  const maxFitness = Math.max(...evaluatedPopulation.map(({ fitness }) => fitness));

  const populationWithNormalizedFitness = evaluatedPopulation.map(evaluatedIndividual => ({
    ...evaluatedIndividual,
    normalizedFitness: minimizeFitness
      ? maxFitness - evaluatedIndividual.fitness
      : evaluatedIndividual.fitness - minFitness,
  }));

  const cumulativeFitness = R.scan(
    (prev, currIndividual) => ({
      evaluatedIndividual: currIndividual,
      cumulativeFitness: prev.cumulativeFitness + currIndividual.normalizedFitness,
    }),
    { cumulativeFitness: 0 },
    populationWithNormalizedFitness,
  );

  const fitnessSum = R.last(cumulativeFitness).cumulativeFitness;

  const normalizedCumulativeFitness = cumulativeFitness.map(obj => (
    { ...obj, cumulativeFitness: obj.cumulativeFitness / fitnessSum }
  ));

  return new Array(evaluatedPopulation.length).fill().map(() => {
    const randomValue = random();
    const compare = element => randomValue < element.cumulativeFitness;
    return R.pick(
      ['individual', 'fitness'],
      binaryRangeSearch(normalizedCumulativeFitness, compare).evaluatedIndividual,
    );
  });
};

module.exports = rouletteSelection;
