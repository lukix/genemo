const randomFromRange = require('./randomFromRange');

const getRandomIndividual = (population, random) => {
  const index = randomFromRange(random)(0, population.length - 1);
  return population[index];
};

module.exports = getRandomIndividual;
