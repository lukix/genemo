const randomFromRange = require('../utils/randomFromRange');
const findBestIndividual = require('../utils/findBestIndividual');

const tournament = ({
  tournamentSize,
  minimalizeFitness = false,
}) => evaluatedPopulation => (
  new Array(evaluatedPopulation.length).fill().map(() => {
    const individuals = new Array(tournamentSize).fill().map(() => {
      const index = randomFromRange(0, evaluatedPopulation.length - 1);
      return evaluatedPopulation[index];
    });
    return findBestIndividual(individuals, minimalizeFitness);
  })
);

module.exports = tournament;
