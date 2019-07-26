const evaluatePopulation = ({ fitnessFunction }) => population => (
  population.map(individual => (
    fitnessFunction(individual)
  ))
);

module.exports = evaluatePopulation;
