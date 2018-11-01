const { runEvolution, getGenerationsIterator } = require('./runners');

const selection = require('./selection');
const mutation = require('./mutation');
const crossover = require('./crossover');

const { generateInitialPopulation } = require('./generateInitialPopulation');
const { reproduce } = require('./reproduce');
const { stopCondition } = require('./stopConditions');
const randomSequenceOf = require('./randomSequenceOf');
const elitism = require('./elitism');

module.exports = {
  runEvolution,
  getGenerationsIterator,

  selection,
  mutation,
  crossover,

  generateInitialPopulation,
  reproduce,
  stopCondition,
  randomSequenceOf,
  elitism,
};
