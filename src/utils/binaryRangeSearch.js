const binaryRangeSearch = (() => {
  const privateFunction = (array, compare, begIndex, endIndex) => {
    if (begIndex >= endIndex) {
      return array[begIndex];
    }

    const index = begIndex + Math.floor((endIndex - begIndex) / 2);
    return compare(array[index])
      ? privateFunction(array, compare, begIndex, index) // left
      : privateFunction(array, compare, index + 1, endIndex); // right
  };

  const publicFunction = (array, compare) => (
    privateFunction(array, compare, 0, array.length - 1)
  );

  return publicFunction;
})();

module.exports = binaryRangeSearch;
