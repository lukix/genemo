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

module.exports = splitArrayIntoChunks;
