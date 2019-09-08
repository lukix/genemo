const splitArrayIntoChunks = require('./splitArrayIntoChunks');

const evaluatePopulationInChunks = (chunksNum, evaluateChunk) => async (population, rng) => {
  const chunks = splitArrayIntoChunks(chunksNum, population);
  const evaluatedChunks = await Promise.all(chunks.map(chunk => evaluateChunk(chunk, rng)));
  return evaluatedChunks.reduce((acc, chunk) => [...acc, ...chunk], []);
};

module.exports = evaluatePopulationInChunks;
