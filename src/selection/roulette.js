const R = require('ramda');
const { selectRouletteElement } = require('./utils/rouletteUtils');

const normalizePopulationFitness = (evaluatedPopulation, minimizeFitness) => {
  const minFitness = Math.min(...evaluatedPopulation.map(({ fitness }) => fitness));
  const maxFitness = Math.max(...evaluatedPopulation.map(({ fitness }) => fitness));

  return evaluatedPopulation.map(evaluatedIndividual => ({
    ...evaluatedIndividual,
    normalizedFitness: minimizeFitness
      ? maxFitness - evaluatedIndividual.fitness
      : evaluatedIndividual.fitness - minFitness,
  }));
};

const calculateCumulativeFitness = populationWithNormalizedFitness => (
  R.scan(
    (prev, currIndividual) => ({
      evaluatedIndividual: currIndividual,
      cumulativeFitness: prev.cumulativeFitness + currIndividual.normalizedFitness,
    }),
    { cumulativeFitness: 0 },
    populationWithNormalizedFitness,
  ).slice(1)
);

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

const rouletteSelection = ({ minimizeFitness = false } = {}) => (evaluatedPopulation, random) => {
  const populationWithNormalizedFitness = normalizePopulationFitness(
    evaluatedPopulation,
    minimizeFitness,
  );

  const cumulativeFitness = calculateCumulativeFitness(populationWithNormalizedFitness);
  const normalizedCumulativeFitness = normalizeCumulativeFitness(cumulativeFitness);

  return new Array(evaluatedPopulation.length).fill().map(() => (
    selectRouletteElement(normalizedCumulativeFitness, random())
  ));
};

module.exports = rouletteSelection;
