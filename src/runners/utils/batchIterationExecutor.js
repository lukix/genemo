const asyncify = require('../../utils/asyncify');
const getCurrentTime = require('../../utils/getCurrentTime');
const FixedSizeBuffer = require('./fixedSizeBuffer');

const waitForNextMacrotask = asyncify(() => null);

const batchIterationExecutor = ({
  executeMainLoopBody,
  maxBlockingTime,
}) => {
  const iterationsTimesBuffer = FixedSizeBuffer(20);

  let lastIterationTimestamp = getCurrentTime();
  let batchStartTimestamp = getCurrentTime();

  return async ({ evaluatedPopulation }) => {
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

module.exports = batchIterationExecutor;
