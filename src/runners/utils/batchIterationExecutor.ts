import asyncify from '../../utils/asyncify';
import getCurrentTime from '../../utils/getCurrentTime';
import FixedSizeBuffer from './fixedSizeBuffer';
import { EvaluatedPopulation } from '../../sharedTypes';

const waitForNextMacrotask = asyncify(() => null);

const batchIterationExecutor = ({
  executeMainLoopBody,
  maxBlockingTime,
}: {
  executeMainLoopBody: Function;
  maxBlockingTime: number;
}) => {
  const iterationsTimesBuffer = FixedSizeBuffer(20);

  let lastIterationTimestamp = getCurrentTime();
  let batchStartTimestamp = getCurrentTime();

  return async <Individual>(
    { evaluatedPopulation }: { evaluatedPopulation: EvaluatedPopulation<Individual> },
  ) => {
    const usedTime = getCurrentTime() - batchStartTimestamp;
    const lastIterationTime = getCurrentTime() - lastIterationTimestamp;
    iterationsTimesBuffer.push(lastIterationTime);
    const expectedIterationTime = iterationsTimesBuffer.getMaxValue();

    const remainingTime = maxBlockingTime - usedTime;
    const shouldExecuteInMacrotask = remainingTime < expectedIterationTime;

    if (shouldExecuteInMacrotask) {
      await waitForNextMacrotask();
    }

    lastIterationTimestamp = getCurrentTime();
    batchStartTimestamp = shouldExecuteInMacrotask ? getCurrentTime() : batchStartTimestamp;

    return executeMainLoopBody({ evaluatedPopulation });
  };
};

export default batchIterationExecutor;
