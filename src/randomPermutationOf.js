import randomFromRange from './utils/randomFromRange';

const randomPermutationOf = valuesSet => (random) => {
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
