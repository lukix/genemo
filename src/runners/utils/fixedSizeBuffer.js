const { max } = require('../../utils/numbersListHelpers');

const FixedSizeBuffer = (size) => {
  const buffer = [];
  return {
    push: (item) => {
      buffer.push(item);
      if (buffer.length > size) {
        buffer.shift();
      }
    },
    getMaxValue: () => max(buffer),
    toArray: () => [...buffer],
  };
};

module.exports = FixedSizeBuffer;
