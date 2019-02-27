const { runEvolution, runEvolutionAsync, getGenerationsIterator } = require('./runners');

const selection = require('./selection');
const mutation = require('./mutation');
const crossover = require('./crossover');

const { generateInitialPopulation } = require('./generateInitialPopulation');
const { reproduce } = require('./reproduce');
const { stopCondition } = require('./stopConditions');
const randomSequenceOf = require('./randomSequenceOf');
const randomPermutationOf = require('./randomPermutationOf');
const elitism = require('./elitism');

module.exports = {
  runEvolution,
  runEvolutionAsync,
  getGenerationsIterator,

  selection,
  mutation,
  crossover,

  generateInitialPopulation,
  reproduce,
  stopCondition,
  randomSequenceOf,
  randomPermutationOf,
  elitism,
};
