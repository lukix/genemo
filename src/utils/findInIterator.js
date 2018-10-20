const findInIterator = (predicate, iterator) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const result of iterator) {
    if (predicate(result)) {
      return result;
    }
  }
  return undefined;
};

module.exports = findInIterator;
