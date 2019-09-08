const splitArrayIntoChunks = require('./splitArrayIntoChunks');

const mapInChunks = (chunksNum, mapFn) => async (array) => {
  const chunks = splitArrayIntoChunks(chunksNum, array);
  const mappedChunks = await Promise.all(chunks.map(chunk => mapFn(chunk)));
  return mappedChunks.reduce((acc, chunk) => [...acc, ...chunk], []);
};

module.exports = mapInChunks;
