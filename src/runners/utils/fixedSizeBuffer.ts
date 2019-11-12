import { max } from '../../utils/numbersListHelpers';

const FixedSizeBuffer = (size) => {
  const buffer: Array<number> = [];
  return {
    push: (item: number) => {
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
