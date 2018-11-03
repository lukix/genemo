const randomFromRange = require('./utils/randomFromRange');

const randomSequenceOf = (valuesSet, length) => random => (
  new Array(length).fill().map(() => {
    const index = randomFromRange(random)(0, valuesSet.length - 1);
    return valuesSet[index];
  })
);

module.exports = randomSequenceOf;
