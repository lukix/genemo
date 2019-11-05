import { min, max, mean } from '../../../src/utils/numbersListHelpers';

describe('numbersListHelpers', () => {
  test('Finds smallest number in an array', () => {
    // Given
    const array = [4, -21, 3, 0, 2.3, 7];
    const expectedResult = -21;

    // When
    const result = min(array);

    // Then
    expect(result).toEqual(expectedResult);
  });

  test('Finds biggest number in an array', () => {
    // Given
    const array = [4, -21, 3, 0, 2.3, 7];
    const expectedResult = 7;

    // When
    const result = max(array);

    // Then
    expect(result).toEqual(expectedResult);
  });

  test('Finds mean number in an array', () => {
    // Given
    const array = [4, -3, 3, 0];
    const expectedResult = 1;

    // When
    const result = mean(array);

    // Then
    expect(result).toEqual(expectedResult);
  });
});
