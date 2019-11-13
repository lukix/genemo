import binaryRangeSearch from '../binaryRangeSearch';

const inputArray = [-20, -7, 1, 3, 4, 5, 8, 9, 11, 26];

describe('binaryRangeSearch', () => {
  test('Finds element when it is first in the array', () => {
    const condition = n => n >= -30;

    // Expected result
    const expectedResult = -20;

    const result = binaryRangeSearch(inputArray, condition);
    expect(result).toEqual(expectedResult);
  });

  test('Finds element when it is last in the array', () => {
    const condition = n => n >= 26;

    // Expected result
    const expectedResult = 26;

    const result = binaryRangeSearch(inputArray, condition);
    expect(result).toEqual(expectedResult);
  });

  test('Return undefined if no elements has been found', () => {
    const condition = n => n >= 27;

    // Expected result
    const expectedResult = undefined;

    const result = binaryRangeSearch(inputArray, condition);
    expect(result).toEqual(expectedResult);
  });

  test('Return undefined given empty array', () => {
    const condition = n => n >= 27;

    // Expected result
    const expectedResult = undefined;

    const result = binaryRangeSearch([], condition);
    expect(result).toEqual(expectedResult);
  });

  test('Return correct result for an array with single item', () => {
    const condition = n => n >= 27;

    // Expected result
    const expectedResult = 27;

    const result = binaryRangeSearch([27], condition);
    expect(result).toEqual(expectedResult);
  });
});
