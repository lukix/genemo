const splitArrayIntoChunks = (chunksNum, array) => {
  if (chunksNum === 1) {
    return [[...array]];
  }

  const chunkSize = Math.floor(array.length / chunksNum);
  return [
    array.slice(0, chunkSize),
    ...splitArrayIntoChunks(chunksNum - 1, array.slice(chunkSize)),
  ];
};

const evaluatePopulationInChunks = (chunksNum, evaluateChunk) => async (population, rng) => {
  const chunks = splitArrayIntoChunks(chunksNum, population);
  const evaluatedChunks = await Promise.all(chunks.map(chunk => evaluateChunk(chunk, rng)));
  return evaluatedChunks.reduce((acc, chunk) => [...acc, ...chunk], []);
};

module.exports = evaluatePopulationInChunks;
