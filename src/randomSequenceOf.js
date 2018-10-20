const randomFromRange = require('./utils/randomFromRange');

const randomSequenceOf = (valuesSet, length) => () => (
  new Array(length).fill().map(() => {
    const index = randomFromRange(0, valuesSet.length - 1);
    return valuesSet[index];
  })
);

module.exports = randomSequenceOf;
