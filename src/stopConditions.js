const { checkProps, types } = require('./utils/typeChecking');

const propTypes = {
  minFitness: { type: types.NUMBER, isRequired: false },
  maxFitness: { type: types.NUMBER, isRequired: false },
  maxIterations: { type: types.NUMBER, isRequired: false },
};

const stopCondition = (options) => {
  checkProps({
    functionName: 'Genemo.stopCondition',
    props: options,
    propTypes,
  });

  const {
    minFitness = Infinity,
    maxFitness = -Infinity,
    maxIterations = Infinity,
  } = options;

  return ({ evaluatedPopulation, iteration }) => (
    evaluatedPopulation.some(({ fitness }) => fitness >= minFitness)
    || evaluatedPopulation.some(({ fitness }) => fitness <= maxFitness)
    || iteration >= maxIterations
  );
};

module.exports = {
  stopCondition,
};
