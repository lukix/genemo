import { checkProps, types } from './utils/typeChecking';

const propTypes = {
  generateIndividual: { type: types.FUNCTION, isRequired: true },
  size: { type: types.NUMBER, isRequired: true },
};

export const generateInitialPopulation = (options) => {
  checkProps({
    functionName: 'Genemo.generateInitialPopulation',
    props: options,
    propTypes,
  });

  const { generateIndividual, size } = options;

  return random => Array(size).fill(null).map(() => generateIndividual(random));
};
