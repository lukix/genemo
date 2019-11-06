/* eslint-disable no-await-in-loop */

import R from 'ramda';
import { checkProps } from '../utils/typeChecking';
import DebugDataCollector from '../utils/DebugDataCollector';
import runnerPropTypes from './utils/runnerPropTypes';
import batchIterationExecutor from './utils/batchIterationExecutor';
import { min, max } from '../utils/numbersListHelpers';

import {
  Rng,
  EvaluatedIndividual,
  EvaluatedPopulation,
  Population,
} from '../sharedTypes';

export interface RunOptions<Individual> {
  generateInitialPopulation: (random: Rng) => Population<Individual>;
  selection: (evaluatedPopulation: EvaluatedPopulation<Individual>, random: Rng) => (
    EvaluatedPopulation<Individual>
  );
  reproduce: (
    evaluatedPopulation: EvaluatedPopulation<Individual>,
    random: Rng, collectReproduceLog: Function
  ) => Population<Individual>;
  succession?: (
    prevAndChildrenPopulations: {
      prevPopulation: EvaluatedPopulation<Individual>;
      childrenPopulation: EvaluatedPopulation<Individual>;
    }, random: Rng) => EvaluatedPopulation<Individual>;
  evaluatePopulation: (population: Population<Individual>, random: Rng) => number;
  stopCondition: (
    iterationInfo: { evaluatedPopulation: EvaluatedPopulation<Individual>; iteration: number }
  ) => boolean;
  random?: Rng;
  iterationCallback?: (iterationData: object) => void;
  maxBlockingTime?: number;
  collectLogs?: boolean;
}
type RunReturnType<Individual> = {
  evaluatedPopulation: EvaluatedPopulation<Individual>;
  iteration: number;
  logs: object;
  getLowestFitnessIndividual: () => EvaluatedIndividual<Individual>;
  getHighestFitnessIndividual: () => EvaluatedIndividual<Individual>;
};

const mergeFitnessValuesWithPopulation = (population, fitnessValues) => (
  R.zip(population, fitnessValues).map(([individual, fitness]) => ({
    individual,
    fitness,
  }))
);

/**
 * Runs genetic algorithm until stopCondition returns true
 */
const run = async <Individual>(
  options: RunOptions<Individual>,
): Promise<RunReturnType<Individual>> => {
  checkProps({
    functionName: 'Genemo.run',
    props: options,
    propTypes: runnerPropTypes,
  });

  const {
    generateInitialPopulation,
    selection,
    reproduce,
    succession = ({ childrenPopulation }) => childrenPopulation,
    evaluatePopulation,
    stopCondition,
    random = Math.random,
    iterationCallback = () => {},
    maxBlockingTime = Infinity,
    collectLogs = true,
  } = options;

  const logsCollector = new DebugDataCollector({ collectLogs });
  const collectReproduceLog = (key, value) => logsCollector.collect(`reproduce.${key}`, value);

  const mainLoopBody = async ({ evaluatedPopulation }) => {
    logsCollector.startClock('selection');
    const parentsPopulation = await selection(evaluatedPopulation, random);
    logsCollector.collectClockValue('selection');

    logsCollector.startClock('reproduce');
    const childrenPopulation = await reproduce(
      parentsPopulation,
      random,
      collectReproduceLog,
    );
    logsCollector.collectClockValue('reproduce');

    logsCollector.startClock('evaluatePopulation');
    const evaluatedChildrenPopulation = mergeFitnessValuesWithPopulation(
      childrenPopulation,
      await evaluatePopulation(childrenPopulation, random),
    );
    logsCollector.collectClockValue('evaluatePopulation');

    logsCollector.startClock('succession');
    const newEvaluatedPopulation = await succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    }, random);
    logsCollector.collectClockValue('succession');

    return newEvaluatedPopulation;
  };

  const executeMainLoopBody = batchIterationExecutor({
    executeMainLoopBody: mainLoopBody,
    maxBlockingTime,
  });

  let iteration = 0;
  const initialPopulation = await generateInitialPopulation(random);
  let evaluatedPopulation = mergeFitnessValuesWithPopulation(
    initialPopulation,
    await evaluatePopulation(initialPopulation, random),
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    logsCollector.startClock('lastIteration');
    iteration += 1;
    // eslint-disable-next-line require-atomic-updates
    evaluatedPopulation = await executeMainLoopBody({ evaluatedPopulation });

    logsCollector.startClock('stopCondition');
    const shouldStop = await stopCondition({ evaluatedPopulation, iteration });
    logsCollector.collectClockValue('stopCondition');

    const iterationData = {
      evaluatedPopulation,
      iteration,
      logs: logsCollector.data,
      // eslint-disable-next-line no-loop-func
      getLowestFitnessIndividual: () => {
        const lowestFitness = min(evaluatedPopulation.map(({ fitness }) => fitness));
        const evaluatedIndividualWithLowestFitness = evaluatedPopulation
          .find(({ fitness }) => fitness === lowestFitness);
        return evaluatedIndividualWithLowestFitness;
      },
      // eslint-disable-next-line no-loop-func
      getHighestFitnessIndividual: () => {
        const highestFitness = max(evaluatedPopulation.map(({ fitness }) => fitness));
        const evaluatedIndividualWithHighestFitness = evaluatedPopulation
          .find(({ fitness }) => fitness === highestFitness);
        return evaluatedIndividualWithHighestFitness;
      },
    };

    logsCollector.startClock('iterationCallback');
    await iterationCallback(iterationData);
    logsCollector.collectClockValue('iterationCallback');

    if (shouldStop) {
      logsCollector.collectClockValue('lastIteration');
      return iterationData;
    }
    logsCollector.collectClockValue('lastIteration');
  }
};

export default run;
