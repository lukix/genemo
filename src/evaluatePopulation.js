const { checkProps, types } = require('./utils/typeChecking');

const propTypes = {
  fitnessFunction: { type: types.FUNCTION, isRequired: true },
};

const evaluatePopulation = (options) => {
  checkProps({
    functionName: 'Genemo.evaluatePopulation',
    props: options,
    propTypes,
  });

  const { fitnessFunction } = options;

  return population => (
    population.map(individual => (
      fitnessFunction(individual)
    ))
  );
};

module.exports = evaluatePopulation;
