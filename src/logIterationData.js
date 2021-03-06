const { checkProps, types } = require('./utils/typeChecking');
const { mean } = require('./utils/numbersListHelpers');

const iterationFormatter = (key, value) => `#${value}`;
const fitnessFormatter = (key, value) => `${key} = ${value}`;
const timeFormatter = (key, value) => `${key} = ${value.toFixed(2)}ms`;

const logIterationDataPropTypes = {
  include: { type: types.OBJECT, isRequired: true },
  customLogger: { type: types.FUNCTION, isRequired: false },
};

const logIterationData = (options) => {
  checkProps({
    functionName: 'Genemo.logIterationData',
    props: options,
    propTypes: logIterationDataPropTypes,
  });

  const {
    include,
    customLogger = console.log, // eslint-disable-line no-console
  } = options;

  return ({
    evaluatedPopulation,
    iteration,
    logs,
    getLowestFitnessIndividual,
    getHighestFitnessIndividual,
  }) => {
    const iterationNumber = {
      show: false,
      formatter: iterationFormatter,
      ...(include.iteration || {}),
    };
    const minFitness = { show: false, formatter: fitnessFormatter, ...(include.minFitness || {}) };
    const maxFitness = { show: false, formatter: fitnessFormatter, ...(include.maxFitness || {}) };
    const avgFitness = { show: false, formatter: fitnessFormatter, ...(include.avgFitness || {}) };
    const logsKeys = include.logsKeys || [];

    const texts = [
      iterationNumber.show && iterationNumber.formatter('iteration', iteration),
      minFitness.show && minFitness.formatter('minFitness', getLowestFitnessIndividual().fitness),
      maxFitness.show && maxFitness.formatter('maxFitness', getHighestFitnessIndividual().fitness),
      avgFitness.show && avgFitness.formatter(
        'avgFitness',
        mean(evaluatedPopulation.map(({ fitness }) => fitness)),
      ),
      ...logsKeys.map(({ key, formatter = timeFormatter }) => (
        logs[key] && formatter(key, logs[key].lastValue)
      )),
    ].filter(text => Boolean(text));

    customLogger(texts.join(', '));
  };
};

module.exports = logIterationData;
