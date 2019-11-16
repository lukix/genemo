import { checkProps, types } from './utils/typeChecking';
import { Population } from './sharedTypes';

const propTypes = {
  fitnessFunction: { type: types.FUNCTION, isRequired: true },
};

const evaluatePopulation = <Individual>(
  options: { fitnessFunction: (Individual: Individual) => number },
) => {
  checkProps({
    functionName: 'Genemo.evaluatePopulation',
    props: options,
    propTypes,
  });

  const { fitnessFunction } = options;

  return (population: Population<Individual>) => (
    population.map(individual => (
      fitnessFunction(individual)
    ))
  );
};

export default evaluatePopulation;
