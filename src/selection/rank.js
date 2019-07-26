const {
  normalizeCumulativeFitness,
  selectRouletteElement,
} = require('./utils/rouletteUtils');

const calculateArithmeticSeries = (first, last, count) => count * (first + last) / 2;

const rankSelection = ({ minimizeFitness } = {}) => (evaluatedPopulation, random) => {
  const compareFitness = minimizeFitness
    ? (a, b) => b.fitness - a.fitness
    : (a, b) => a.fitness - b.fitness;
  const sortedPopulation = [...evaluatedPopulation].sort(compareFitness);

  const cumulativeFitness = sortedPopulation.map((individual, index) => ({
    evaluatedIndividual: individual,
    cumulativeFitness: calculateArithmeticSeries(0, index, index + 1),
  }));

  const normalizedCumulativeFitness = normalizeCumulativeFitness(cumulativeFitness);

  return new Array(evaluatedPopulation.length).fill().map(() => (
    selectRouletteElement(normalizedCumulativeFitness, random())
  ));
};

module.exports = rankSelection;
