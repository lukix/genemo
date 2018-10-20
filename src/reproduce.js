const randomFromRange = (from, to) => from + Math.floor(Math.random() * (to - from + 1));

const getRandomIndividual = (population) => {
  const index = randomFromRange(0, population.length - 1);
  return population[index];
};

const reproduce = ({
  mutate, // individual => individual
  crossover, // ([individual, individual]) => [individual, individual]
  mutationProbability = 0.01,
}) => (evaluatedPopulation) => {
  const targetPopulationSize = evaluatedPopulation.length;
  const newPopulation = [];
  while (newPopulation.length < targetPopulationSize) {
    const mother = getRandomIndividual(evaluatedPopulation).individual;
    const father = getRandomIndividual(evaluatedPopulation).individual;
    const [daughter, son] = crossover([mother, father]);
    newPopulation.push(...(
      targetPopulationSize - newPopulation.length >= 2
        ? [daughter, son]
        : [daughter]
    ));
  }

  if (Math.random() <= mutationProbability) {
    const randomIndex = randomFromRange(0, newPopulation.length - 1);
    newPopulation[randomIndex] = mutate(newPopulation[randomIndex]);
  }

  const mutatedPopulation = newPopulation.map(individual => (
    Math.random() <= mutationProbability
      ? mutate(individual)
      : individual
  ));

  return mutatedPopulation;
};

module.exports = {
  reproduce,
};
