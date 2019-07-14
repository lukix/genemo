const evaluatePopulation = (population, fitnessFunc) => (
  Promise.all(
    population.map(async individual => ({
      individual,
      fitness: await fitnessFunc(individual),
    })),
  )
);

module.exports = evaluatePopulation;
