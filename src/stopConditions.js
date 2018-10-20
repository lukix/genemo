const stopCondition = ({ minFitness = Infinity, maxGenerations = Infinity }) => (
  ({ evaluatedPopulation, generation }) => (
    evaluatedPopulation.some(({ fitness }) => fitness >= minFitness) || generation >= maxGenerations
  )
);

module.exports = {
  stopCondition,
};
