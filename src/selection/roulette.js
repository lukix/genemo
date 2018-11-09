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
  ).slice(1);

  const fitnessSum = R.last(cumulativeFitness).cumulativeFitness;

  const normalizedCumulativeFitness = fitnessSum === 0
    ? cumulativeFitness.map((obj, index) => (
      { ...obj, cumulativeFitness: (index + 1) / cumulativeFitness.length }
    ))
    : cumulativeFitness.map(obj => (
      { ...obj, cumulativeFitness: obj.cumulativeFitness / fitnessSum }
    ));

  return new Array(evaluatedPopulation.length).fill().map(() => {
    const randomValue = random();
    const compare = element => randomValue < element.cumulativeFitness;
    const a = binaryRangeSearch(normalizedCumulativeFitness, compare);
    return R.pick(
      ['individual', 'fitness'],
      a.evaluatedIndividual,
    );
  });
};

module.exports = rouletteSelection;
