const R = require('ramda');
const randomFromRange = require('../utils/randomFromRange');

const createChildUsingOrderOneCrossover = ([parent1, parent2], minIndex, maxIndex) => {
  const individualLength = parent1.length;
  const child = new Array(individualLength).fill();
  R.range(minIndex, maxIndex + 1).forEach((index) => {
    child[index] = parent1[index];
  });

  let childIndex = maxIndex + 1;
  [...R.range(maxIndex + 1, individualLength), ...R.range(0, maxIndex + 1)].forEach((index) => {
    if (!child.includes(parent2[index])) {
      child[childIndex % individualLength] = parent2[index];
      childIndex += 1;
    }
  });
  return child;
};

const orderOne = ([mother, father]) => {
  const individualLength = mother.length;
  const index1 = randomFromRange(0, individualLength - 1);
  const index2 = randomFromRange(0, individualLength - 1);
  const minIndex = Math.min(index1, index2);
  const maxIndex = Math.max(index1, index2);

  const son = createChildUsingOrderOneCrossover([mother, father], minIndex, maxIndex);
  const daughter = createChildUsingOrderOneCrossover([father, mother], minIndex, maxIndex);

  return [son, daughter];
};

module.exports = orderOne;
