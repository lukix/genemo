const evaluatePopulation = ({ fitnessFunction }) => population => (
  Promise.all(
    population.map(async individual => (
      fitnessFunction(individual)
    )),
  )
);

module.exports = evaluatePopulation;
