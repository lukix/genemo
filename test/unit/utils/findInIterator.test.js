const findInIterator = require('../../../src/utils/findInIterator');

describe('findInIterator', () => {
  test('Returns first element, which matches predicate', () => {
    const iterator = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const predicate = item => item % 5 === 0;

    const expectedResult = 5;

    const result = findInIterator(predicate, iterator);
    expect(result).toStrictEqual(expectedResult);
  });

  test('Returns undefined, which no item matches predicate', () => {
    const iterator = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const predicate = item => item % 11 === 0;

    const expectedResult = undefined;

    const result = findInIterator(predicate, iterator);
    expect(result).toStrictEqual(expectedResult);
  });
});
