import R from 'ramda';
import randomFromRange from '../utils/randomFromRange';
import { Rng } from '../sharedTypes';

export const createChildUsingOrderOneCrossover = ([parent1, parent2], minIndex, maxIndex) => {
  const individualLength = parent1.length;
  const child = new Array(individualLength).fill(null);
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

const orderOne = () => <Gene>([mother, father]: [Array<Gene>, Array<Gene>], random: Rng) => {
  const individualLength = mother.length;
  const index1 = randomFromRange(random)(0, individualLength - 1);
  const index2 = randomFromRange(random)(0, individualLength - 1);
  const minIndex = Math.min(index1, index2);
  const maxIndex = Math.max(index1, index2);

  const son = createChildUsingOrderOneCrossover([mother, father], minIndex, maxIndex);
  const daughter = createChildUsingOrderOneCrossover([father, mother], minIndex, maxIndex);

  return [son, daughter];
};

export default orderOne;
