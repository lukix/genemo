const evaluatePopulation = (population, fitnessFunc) => population.map(individual => ({
  individual,
  fitness: fitnessFunc(individual),
}));

const evaluatePopulationAsync = (population, fitnessFunc) => (
  Promise.all(
    population.map(async individual => ({
      individual,
      fitness: await fitnessFunc(individual),
    })),
  )
);

module.exports = {
  evaluatePopulation,
  evaluatePopulationAsync,
};
