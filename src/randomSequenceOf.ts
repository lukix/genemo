import randomFromRange from './utils/randomFromRange';
import { Rng } from './sharedTypes';

const randomSequenceOf = <T>(valuesSet: Array<T>, length: number) => (random: Rng) => (
  new Array(length).fill(null).map(() => {
    const index = randomFromRange(random)(0, valuesSet.length - 1);
    return valuesSet[index];
  })
);

export default randomSequenceOf;
