/* eslint-disable no-await-in-loop */

import R from 'ramda';
import { checkProps } from '../utils/typeChecking';
import DebugDataCollector from '../utils/DebugDataCollector';
import batchIterationExecutor from './utils/batchIterationExecutor';
import { min, max } from '../utils/numbersListHelpers';
import runnerPropTypes from './utils/runnerPropTypes';
import doWhile from './utils/doWhile';

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

  const initialPopulation = await generateInitialPopulation(random);
  const initialLoopState = {
    iterationData: {
      iteration: 0,
      evaluatedPopulation: mergeFitnessValuesWithPopulation(
        initialPopulation,
        await evaluatePopulation(initialPopulation, random),
      ),
    },
    shouldStop: false,
  };

  const result = await doWhile(
    async ({ iterationData: { iteration, evaluatedPopulation } }) => {
      logsCollector.startClock('lastIteration');
      const newEvaluatedPopulation = await executeMainLoopBody({ evaluatedPopulation });

      const iterationData = {
        evaluatedPopulation: newEvaluatedPopulation,
        iteration: iteration + 1,
        logs: logsCollector.data,
        getLowestFitnessIndividual: () => {
          const lowestFitness = min(newEvaluatedPopulation.map(({ fitness }) => fitness));
          const evaluatedIndividualWithLowestFitness = newEvaluatedPopulation
            .find(({ fitness }) => fitness === lowestFitness);
          return evaluatedIndividualWithLowestFitness;
        },
        getHighestFitnessIndividual: () => {
          const highestFitness = max(newEvaluatedPopulation.map(({ fitness }) => fitness));
          const evaluatedIndividualWithHighestFitness = newEvaluatedPopulation
            .find(({ fitness }) => fitness === highestFitness);
          return evaluatedIndividualWithHighestFitness;
        },
      };

      logsCollector.startClock('iterationCallback');
      await iterationCallback(iterationData);
      logsCollector.collectClockValue('iterationCallback');

      logsCollector.startClock('stopCondition');
      const shouldStop = await stopCondition({
        evaluatedPopulation: iterationData.evaluatedPopulation,
        iteration: iterationData.iteration,
      });
      logsCollector.collectClockValue('stopCondition');

      logsCollector.collectClockValue('lastIteration');

      return { iterationData, shouldStop };
    },
    ({ shouldStop }) => shouldStop,
    initialLoopState,
  );

  return result.iterationData;
};

export default run;
