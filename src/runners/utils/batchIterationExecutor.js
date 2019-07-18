const asyncify = require('../../utils/asyncify');
const getCurrentTime = require('../../utils/getCurrentTime');
const FixedSizeBuffer = require('./fixedSizeBuffer');

const batchIterationExecutor = ({
  executeMainLoopBody,
  maxBlockingTime,
}) => {
  const executeMainLoopBodyInMacrotask = asyncify(executeMainLoopBody);
  const iterationsTimesBuffer = FixedSizeBuffer(50);

  let lastIterationTimestamp = getCurrentTime();
  let batchStartTimestamp = getCurrentTime();

  return ({ evaluatedPopulation }) => {
    const usedTime = getCurrentTime() - batchStartTimestamp;
    const lastIterationTime = getCurrentTime() - lastIterationTimestamp;
    iterationsTimesBuffer.push(lastIterationTime);
    const expectedIterationTime = iterationsTimesBuffer.getMaxValue();

    const remainingTime = maxBlockingTime - usedTime;
    const shouldExecuteInMacrotask = remainingTime < (usedTime + expectedIterationTime);

    lastIterationTimestamp = getCurrentTime();
    batchStartTimestamp = shouldExecuteInMacrotask ? getCurrentTime() : batchStartTimestamp;

    return shouldExecuteInMacrotask
      ? executeMainLoopBodyInMacrotask({ evaluatedPopulation })
      : executeMainLoopBody({ evaluatedPopulation });
  };
};

module.exports = batchIterationExecutor;
