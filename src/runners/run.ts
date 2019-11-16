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
  EvaluatedPopulation,
  Population,
  RunReturnType,
} from '../sharedTypes';

type WithFitness = { fitness: number };
export interface RunOptions<Individual> {
  generateInitialPopulation: (random: Rng) => Population<Individual>;
  selection: (evaluatedPopulation: EvaluatedPopulation<Individual>, random: Rng) => (
    EvaluatedPopulation<Individual>
  );
  reproduce: (
    evaluatedPopulation: EvaluatedPopulation<Individual>,
    random: Rng,
    collectReproduceLog: (key: string, value: any) => void,
  ) => Population<Individual>;
  succession?: (
    prevAndChildrenPopulations: {
      prevPopulation: EvaluatedPopulation<Individual>;
      childrenPopulation: EvaluatedPopulation<Individual>;
    }, random: Rng) => EvaluatedPopulation<Individual>;
  evaluatePopulation: (population: Population<Individual>, random: Rng) => Array<number>;
  stopCondition: (
    iterationInfo: { evaluatedPopulation: EvaluatedPopulation<Individual>; iteration: number }
  ) => boolean;
  random?: Rng;
  iterationCallback?: (iterationData: object) => void;
  maxBlockingTime?: number;
  collectLogs?: boolean;
}

const mergeFitnessValuesWithPopulation = <Individual>(
  population: Population<Individual>,
  fitnessValues: Array<number>,
): EvaluatedPopulation<Individual> => (
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
    succession = (
      ({ childrenPopulation }: { childrenPopulation: EvaluatedPopulation<Individual> }) => (
        childrenPopulation
      )
    ),
    evaluatePopulation,
    stopCondition,
    random = Math.random,
    iterationCallback = () => {},
    maxBlockingTime = Infinity,
    collectLogs = true,
  } = options;

  const logsCollector = new DebugDataCollector({ collectLogs });
  const collectReproduceLog = (key: string, value: any) => logsCollector.collect(`reproduce.${key}`, value);

  const mainLoopBody = async (
    { evaluatedPopulation }: { evaluatedPopulation: EvaluatedPopulation<Individual> },
  ) => {
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

  type InitialLoopState = {
    iterationData: {
      iteration: number;
      evaluatedPopulation: EvaluatedPopulation<Individual>;
    };
  };

  const initialPopulation = await generateInitialPopulation(random);
  const initialLoopState: InitialLoopState = {
    iterationData: {
      iteration: 0,
      evaluatedPopulation: mergeFitnessValuesWithPopulation(
        initialPopulation,
        await evaluatePopulation(initialPopulation, random),
      ),
    },
  };

  type U = { iterationData: RunReturnType<Individual>; shouldStop: boolean}
  const result = await doWhile<InitialLoopState, U>(
    async ({
      iterationData: { iteration, evaluatedPopulation },
    }) => {
      logsCollector.startClock('lastIteration');
      const newEvaluatedPopulation = await executeMainLoopBody({ evaluatedPopulation });

      const iterationData = {
        evaluatedPopulation: newEvaluatedPopulation,
        iteration: iteration + 1,
        logs: logsCollector.data,
        getLowestFitnessIndividual: () => {
          const lowestFitness = min(
            newEvaluatedPopulation.map(({ fitness }: WithFitness) => fitness),
          );
          const evaluatedIndividualWithLowestFitness = newEvaluatedPopulation
            .find(({ fitness }: WithFitness) => fitness === lowestFitness);
          return evaluatedIndividualWithLowestFitness;
        },
        getHighestFitnessIndividual: () => {
          const highestFitness = max(
            newEvaluatedPopulation.map(({ fitness }: WithFitness) => fitness),
          );
          const evaluatedIndividualWithHighestFitness = newEvaluatedPopulation
            .find(({ fitness }: WithFitness) => fitness === highestFitness);
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

      const iterationResult: {
        iterationData: RunReturnType<Individual>;
        shouldStop: boolean;
      } = { iterationData, shouldStop };
      return iterationResult;
    },
    ({ shouldStop }) => shouldStop,
    initialLoopState,
  );

  return result.iterationData;
};

export default run;
