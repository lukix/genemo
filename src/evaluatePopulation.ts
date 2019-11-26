import { Population } from './sharedTypes';

const evaluatePopulation = <Individual>(
  options: { fitnessFunction: (Individual: Individual) => number },
) => {
  const { fitnessFunction } = options;

  return (population: Population<Individual>) => (
    population.map(individual => (
      fitnessFunction(individual)
    ))
  );
};

export default evaluatePopulation;
