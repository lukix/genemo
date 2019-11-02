const R = require('ramda');
const randomFromRange = require('../utils/randomFromRange');

const createChildUsingPMXCrossover = ([parent1, parent2], minIndex, maxIndex) => {
  const individualLength = parent1.length;
  const child = new Array(individualLength).fill(null);

  // Copy random swath from parent1
  R.range(minIndex, maxIndex + 1).forEach((index) => {
    child[index] = parent1[index];
  });

  // Insert not colliding elements from parent2
  const emptyIndices = [];
  [...R.range(0, minIndex), ...R.range(maxIndex + 1, individualLength)].forEach((index) => {
    if (!child.includes(parent2[index])) {
      child[index] = parent2[index];
    } else {
      emptyIndices.push(index);
    }
  });

  const mapping = new Map(
    [
      ...R.range(minIndex, maxIndex + 1).map(index => [
        parent2[index],
        parent1[index],
      ]),
      ...R.range(minIndex, maxIndex + 1).map(index => [
        parent1[index],
        parent2[index],
      ]),
    ],
  );

  // In empty places insert elements based on mapping
  emptyIndices.forEach((index) => {
    let value = parent2[index];
    while (child.includes(value)) {
      value = mapping.get(value);
    }
    child[index] = value;
  });

  return child;
};

const PMX = () => ([mother, father], random) => {
  const individualLength = mother.length;
  const index1 = randomFromRange(random)(0, individualLength - 1);
  const index2 = randomFromRange(random)(0, individualLength - 1);
  const minIndex = Math.min(index1, index2);
  const maxIndex = Math.max(index1, index2);

  const son = createChildUsingPMXCrossover([mother, father], minIndex, maxIndex);
  const daughter = createChildUsingPMXCrossover([father, mother], minIndex, maxIndex);

  return [son, daughter];
};

module.exports = PMX;
module.exports.createChildUsingPMXCrossover = createChildUsingPMXCrossover;
