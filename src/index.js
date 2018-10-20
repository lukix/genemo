const { runEvolution, getGenerationsIterator } = require('./runners');

const selection = require('./selection');
const mutation = require('./mutation');
const crossover = require('./crossover');

const { generateInitialPopulation } = require('./generateInitialPopulation');
const { reproduce } = require('./reproduce');

module.exports = {
  runEvolution,
  getGenerationsIterator,

  selection,
  mutation,
  crossover,

  generateInitialPopulation,
  reproduce,
};
