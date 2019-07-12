const { min, max, mean } = require('./utils/numbersListHelpers');

const logIterationData = ({
  include,
  customLogger = console.log, // eslint-disable-line no-console
}) => (
  ({
    evaluatedPopulation,
    generation,
    debugData,
  }) => {
    const {
      generationNumber: logGenerationNumber = false,
      minFitness: logMinFitness = false,
      maxFitness: logMaxFitness = false,
      avgFitness: logAvgFitness = false,
      debugDataKeys = [],
    } = include;

    const fitnessValues = evaluatedPopulation.map(({ fitness }) => fitness);

    const texts = [
      logGenerationNumber && `#${generation}`,
      logMinFitness && `minFitness = ${min(fitnessValues)}`,
      logMaxFitness && `maxFitness = ${max(fitnessValues)}`,
      logAvgFitness && `avgFitness = ${mean(fitnessValues)}`,
      ...debugDataKeys.map(key => (
        debugData[key] && `${key} = ${debugData[key].lastValue.toFixed(2)}ms`
      )),
    ].filter(text => Boolean(text));

    customLogger(texts.join(', '));
  }
);

module.exports = logIterationData;
