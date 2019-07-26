const randomFromRange = require('../utils/randomFromRange');
const findBestIndividual = require('../utils/findBestIndividual');

const tournament = ({
  size,
  minimizeFitness,
}) => (evaluatedPopulation, random) => (
  new Array(evaluatedPopulation.length).fill().map(() => {
    const individuals = new Array(size).fill().map(() => {
      const index = randomFromRange(random)(0, evaluatedPopulation.length - 1);
      return evaluatedPopulation[index];
    });
    return findBestIndividual(individuals, minimizeFitness);
  })
);

module.exports = tournament;
