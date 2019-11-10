import randomFromRange from './utils/randomFromRange';
import { Rng } from './sharedTypes';

const randomPermutationOf = <T>(valuesSet: Array<T>) => (random: Rng) => {
  const permutation = [...valuesSet];
  let remainingItems = valuesSet.length;

  // While there remain elements to shuffle...
  while (remainingItems > 0) {
    // Pick a random element...
    const i = randomFromRange(random)(0, remainingItems - 1);

    // And swap it with the current element.
    [
      permutation[i],
      permutation[remainingItems - 1],
    ] = [
      permutation[remainingItems - 1],
      permutation[i],
    ];

    remainingItems -= 1;
  }

  return permutation;
};

export default randomPermutationOf;
