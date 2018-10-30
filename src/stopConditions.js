const stopCondition = ({
  minFitness = Infinity,
  maxFitness = -Infinity,
  maxGenerations = Infinity,
}) => (
  ({ evaluatedPopulation, generation }) => (
    evaluatedPopulation.some(({ fitness }) => fitness >= minFitness)
    || evaluatedPopulation.some(({ fitness }) => fitness <= maxFitness)
    || generation >= maxGenerations
  )
);

module.exports = {
  stopCondition,
};
