import { max } from '../../utils/numbersListHelpers';

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

export default FixedSizeBuffer;
