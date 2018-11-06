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

const findBestIndividual = (evaluatedIndividuals, minimizeFitness) => {
  const reducer = minimizeFitness
    ? getIndividualWithLowerFitness
    : getIndividualWithHigherFitness;
  return evaluatedIndividuals.slice(1).reduce(reducer, evaluatedIndividuals[0]);
};

module.exports = findBestIndividual;
