const binaryRangeSearchInner = <T>(
  array: Array<T>,
  condition: (T) => boolean,
  begIndex: number,
  endIndex: number,
): T => {
  if (begIndex >= endIndex) {
    return array[begIndex];
  }

  const index = begIndex + Math.floor((endIndex - begIndex) / 2);
  return condition(array[index])
    ? binaryRangeSearchInner(array, condition, begIndex, index) // left
    : binaryRangeSearchInner(array, condition, index + 1, endIndex); // right
};

/**
 * Finds first element in an array which fulfills given condition.
 * @param array Array to be searched
 * @param condition Informs if the algorithm should move to the left or to the right from the current element
 */
const binaryRangeSearch = <T>(array: Array<T>, condition: (T) => boolean) => {
  const result = binaryRangeSearchInner(array, condition, 0, array.length - 1);
  return condition(result) ? result : undefined;
};

export default binaryRangeSearch;
