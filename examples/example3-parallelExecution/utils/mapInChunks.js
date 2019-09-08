const splitArrayIntoChunks = require('./splitArrayIntoChunks');

const mapInChunks = ({ numberOfChunks, mapFunction }) => async (array, ...args) => {
  const chunks = splitArrayIntoChunks(numberOfChunks, array);
  const mappedChunks = await Promise.all(chunks.map(chunk => mapFunction(chunk, ...args)));
  return mappedChunks.reduce((acc, chunk) => [...acc, ...chunk], []);
};

module.exports = mapInChunks;
