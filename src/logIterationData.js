const getMinValue = arr => Math.min(...arr);
const getMaxValue = arr => Math.max(...arr);
const getAvgValue = arr => arr.reduce((sum, curr) => sum + curr) / arr.length;

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
      logMinFitness && `minFitness = ${getMinValue(fitnessValues)}`,
      logMaxFitness && `maxFitness = ${getMaxValue(fitnessValues)}`,
      logAvgFitness && `avgFitness = ${getAvgValue(fitnessValues)}`,
      ...debugDataKeys.map(key => (
        debugData[key] && `${key} = ${debugData[key].lastValue.toFixed(2)}ms`
      )),
    ].filter(text => Boolean(text));

    customLogger(texts.join(', '));
  }
);

module.exports = logIterationData;
