import * as selection from './selection';
import * as mutation from './mutation';
import * as crossover from './crossover';

import { run } from './runners';

import { generateInitialPopulation } from './generateInitialPopulation';
import evaluatePopulation from './evaluatePopulation';
import reproduce from './reproduce';
import reproduceBatch from './reproduceBatch';
import { stopCondition } from './stopConditions';
import randomSequenceOf from './randomSequenceOf';
import randomPermutationOf from './randomPermutationOf';
import elitism from './elitism';
import logIterationData from './logIterationData';

const publicInterface = {
  run,

  selection,
  mutation,
  crossover,

  generateInitialPopulation,
  evaluatePopulation,
  reproduce,
  reproduceBatch,
  stopCondition,
  logIterationData,
  randomSequenceOf,
  randomPermutationOf,
  elitism,
};

export default publicInterface;
module.exports = publicInterface;
