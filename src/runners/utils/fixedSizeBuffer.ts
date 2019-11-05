import { max } from '../../utils/numbersListHelpers';

const FixedSizeBuffer = <T>(size) => {
  const buffer: Array<T> = [];
  return {
    push: (item: T) => {
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
