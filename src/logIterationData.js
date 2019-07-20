const { min, max, mean } = require('./utils/numbersListHelpers');

const iterationFormatter = (key, value) => `#${value}`;
const fitnessFormatter = (key, value) => `${key} = ${value}`;
const timeFormatter = (key, value) => `${key} = ${value.toFixed(2)}ms`;

const logIterationData = ({
  include,
  customLogger = console.log, // eslint-disable-line no-console
}) => (
  ({
    evaluatedPopulation,
    generation: iteration,
    performanceData,
  }) => {
    const iterationNumber = {
      show: false,
      formatter: iterationFormatter,
      ...(include.iteration || {}),
    };
    const minFitness = { show: false, formatter: fitnessFormatter, ...(include.minFitness || {}) };
    const maxFitness = { show: false, formatter: fitnessFormatter, ...(include.maxFitness || {}) };
    const avgFitness = { show: false, formatter: fitnessFormatter, ...(include.avgFitness || {}) };
    const performanceDataKeys = include.performanceDataKeys || [];

    const fitnessValues = evaluatedPopulation.map(({ fitness }) => fitness);

    const texts = [
      iterationNumber.show && iterationNumber.formatter('iteration', iteration),
      minFitness.show && minFitness.formatter('minFitness', min(fitnessValues)),
      maxFitness.show && maxFitness.formatter('maxFitness', max(fitnessValues)),
      avgFitness.show && avgFitness.formatter('avgFitness', mean(fitnessValues)),
      ...performanceDataKeys.map(({ key, formatter = timeFormatter }) => (
        performanceData[key] && formatter(key, performanceData[key].lastValue)
      )),
    ].filter(text => Boolean(text));

    customLogger(texts.join(', '));
  }
);

module.exports = logIterationData;
