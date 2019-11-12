import { EvaluatedIndividual, EvaluatedPopulation } from '../sharedTypes';

const getIndividualWithLowerFitness = <Individual>(
  individual1: EvaluatedIndividual<Individual>,
  individual2: EvaluatedIndividual<Individual>,
) => (
    individual1.fitness < individual2.fitness
      ? individual1
      : individual2
  );

const getIndividualWithHigherFitness = <Individual>(
  individual1: EvaluatedIndividual<Individual>,
  individual2: EvaluatedIndividual<Individual>,
) => (
    individual1.fitness > individual2.fitness
      ? individual1
      : individual2
  );

const findBestIndividual = <Individual>(
  evaluatedPopulation: EvaluatedPopulation<Individual>,
  minimizeFitness: boolean,
) => {
  const reducer = minimizeFitness
    ? getIndividualWithLowerFitness
    : getIndividualWithHigherFitness;
  return evaluatedPopulation.reduce(reducer);
};

export default findBestIndividual;
