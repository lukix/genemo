const { run } = require('./runners');

const selection = require('./selection');
const mutation = require('./mutation');
const crossover = require('./crossover');

const { generateInitialPopulation } = require('./generateInitialPopulation');
const { reproduce, reproduceAsync } = require('./reproduce');
const { stopCondition } = require('./stopConditions');
const randomSequenceOf = require('./randomSequenceOf');
const randomPermutationOf = require('./randomPermutationOf');
const elitism = require('./elitism');
const logIterationData = require('./logIterationData');

module.exports = {
  run,

  selection,
  mutation,
  crossover,

  generateInitialPopulation,
  reproduce,
  reproduceAsync,
  stopCondition,
  logIterationData,
  randomSequenceOf,
  randomPermutationOf,
  elitism,
};
