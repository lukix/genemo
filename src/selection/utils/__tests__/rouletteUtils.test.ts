import {
  normalizeCumulativeFitness,
} from '../rouletteUtils';

describe('normalizeCumulativeFitness', () => {
  test('Returns correct result', () => {
    const cumulativeFitness = [
      { id: 0, cumulativeFitness: 2 },
      { id: 1, cumulativeFitness: 2 },
      { id: 2, cumulativeFitness: 7 },
      { id: 3, cumulativeFitness: 10 },
    ];

    const expectedResult = [
      { id: 0, cumulativeFitness: 0.2 },
      { id: 1, cumulativeFitness: 0.2 },
      { id: 2, cumulativeFitness: 0.7 },
      { id: 3, cumulativeFitness: 1.0 },
    ];

    const result = normalizeCumulativeFitness(cumulativeFitness);
    expect(result).toStrictEqual(expectedResult);
  });

  test('Returns correct result for fitnessSum equal zero', () => {
    const cumulativeFitness = [
      { id: 0, cumulativeFitness: 0 },
      { id: 1, cumulativeFitness: 0 },
      { id: 2, cumulativeFitness: 0 },
      { id: 3, cumulativeFitness: 0 },
    ];

    const expectedResult = [
      { id: 0, cumulativeFitness: 0.25 },
      { id: 1, cumulativeFitness: 0.50 },
      { id: 2, cumulativeFitness: 0.75 },
      { id: 3, cumulativeFitness: 1.0 },
    ];

    const result = normalizeCumulativeFitness(cumulativeFitness);
    expect(result).toStrictEqual(expectedResult);
  });
});
