const stopCondition = ({
  minFitness = Infinity,
  maxFitness = -Infinity,
  maxIterations = Infinity,
}) => (
  ({ evaluatedPopulation, iteration }) => (
    evaluatedPopulation.some(({ fitness }) => fitness >= minFitness)
    || evaluatedPopulation.some(({ fitness }) => fitness <= maxFitness)
    || iteration >= maxIterations
  )
);

module.exports = {
  stopCondition,
};
