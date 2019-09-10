const splitArrayIntoChunks = require('./splitArrayIntoChunks');

const mapInAsyncChunks = ({ numberOfChunks, mapFunction }) => async (array, ...args) => {
  const chunks = splitArrayIntoChunks(numberOfChunks, array);
  const mappedChunks = await Promise.all(chunks.map(chunk => mapFunction(chunk, ...args)));
  return mappedChunks.reduce((acc, chunk) => [...acc, ...chunk], []);
};

module.exports = mapInAsyncChunks;
