const R = require('ramda');
const {
  normalizeCumulativeFitness,
  selectRouletteElement,
} = require('./utils/rouletteUtils');
const { min, max } = require('../utils/numbersListHelpers');

const normalizePopulationFitness = (evaluatedPopulation, minimizeFitness) => {
  const minFitness = min(evaluatedPopulation.map(({ fitness }) => fitness));
  const maxFitness = max(evaluatedPopulation.map(({ fitness }) => fitness));

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

const rouletteSelection = ({ minimizeFitness }) => (evaluatedPopulation, random) => {
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
