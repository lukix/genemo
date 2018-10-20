const randomFromRange = require('../utils/randomFromRange');

const singlePoint = ([mother, father]) => {
  const cutPoint = randomFromRange(1, mother.length - 2);
  const son = [...mother.slice(0, cutPoint), ...father.slice(cutPoint)];
  const daughter = [...father.slice(0, cutPoint), ...mother.slice(cutPoint)];
  return [son, daughter];
};

module.exports = singlePoint;
