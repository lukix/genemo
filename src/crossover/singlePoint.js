const randomFromRange = require('../utils/randomFromRange');

// Warning: the following function modifies its parameter
const pushAndReturnArray = (array, elements) => {
  array.push(...elements);
  return array;
};

const singlePoint = ([mother, father], random) => {
  const cutPoint = randomFromRange(random)(0, mother.length - 1);
  const son = pushAndReturnArray(mother.slice(0, cutPoint), father.slice(cutPoint));
  const daughter = pushAndReturnArray(father.slice(0, cutPoint), mother.slice(cutPoint));
  return [son, daughter];
};

module.exports = singlePoint;
