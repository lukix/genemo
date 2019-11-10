import randomFromRange from '../utils/randomFromRange';
import { Rng } from '../sharedTypes';

// Warning: the following function modifies its parameter
const pushAndReturnArray = (array: Array<any>, elements: Array<any>) => {
  array.push(...elements);
  return array;
};

const singlePoint = () => <Gene>(
  [mother, father]: [Array<Gene>, Array<Gene>],
  random: Rng,
) => {
  const cutPoint = randomFromRange(random)(0, mother.length - 1);
  const son = pushAndReturnArray(mother.slice(0, cutPoint), father.slice(cutPoint));
  const daughter = pushAndReturnArray(father.slice(0, cutPoint), mother.slice(cutPoint));
  const children: [Array<Gene>, Array<Gene>] = [son, daughter];
  return children;
};

export default singlePoint;
