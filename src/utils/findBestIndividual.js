const getIndividualWithLowerFitness = (individual1, individual2) => (
  individual1.fitness < individual2.fitness
    ? individual1
    : individual2
);

const getIndividualWithHigherFitness = (individual1, individual2) => (
  individual1.fitness > individual2.fitness
    ? individual1
    : individual2
);

const findBestIndividual = (evaluatedPopulation, minimizeFitness) => {
  const reducer = minimizeFitness
    ? getIndividualWithLowerFitness
    : getIndividualWithHigherFitness;
  return evaluatedPopulation.reduce(reducer);
};

module.exports = findBestIndividual;
