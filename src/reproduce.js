const randomFromRange = require('./utils/randomFromRange');

const getRandomIndividual = (population, random) => {
  const index = randomFromRange(random)(0, population.length - 1);
  return population[index];
};

const reproduce = ({
  mutate, // (individual, random) => individual
  crossover, // ([individual, individual], random) => [individual, individual]
  mutationProbability = 0.01,
}) => (evaluatedPopulation, random) => {
  const targetPopulationSize = evaluatedPopulation.length;
  const newPopulation = [];
  while (newPopulation.length < targetPopulationSize) {
    const mother = getRandomIndividual(evaluatedPopulation, random).individual;
    const father = getRandomIndividual(evaluatedPopulation, random).individual;
    const [daughter, son] = crossover([mother, father], random);
    newPopulation.push(daughter, son);
  }

  if (newPopulation.length > targetPopulationSize) {
    newPopulation.pop();
  }

  if (random() <= mutationProbability) {
    const randomIndex = randomFromRange(random)(0, newPopulation.length - 1);
    newPopulation[randomIndex] = mutate(newPopulation[randomIndex], random);
  }

  const mutatedPopulation = newPopulation.map(individual => (
    random() <= mutationProbability
      ? mutate(individual, random)
      : individual
  ));

  return mutatedPopulation;
};

module.exports = {
  reproduce,
};
