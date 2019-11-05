import randomFromRange from './utils/randomFromRange';

const randomSequenceOf = (valuesSet, length) => random => (
  new Array(length).fill(null).map(() => {
    const index = randomFromRange(random)(0, valuesSet.length - 1);
    return valuesSet[index];
  })
);

export default randomSequenceOf;
