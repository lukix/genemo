import Genemo from '../../../src';
import cyclicProvider from '../../test-utils/cyclicProvider';

// Common inputs
const mother = [10, 20, 30, 40, 50];
const father = [11, 21, 31, 41, 51];

describe('Uniform crossover', () => {
  test('Returns correct offsprings', () => {
    // Input
    const random = cyclicProvider([0.7, 0.0, 0.4, 1, 0.5]);

    // Expected result
    const offsprings = [
      [10, 21, 31, 40, 50],
      [11, 20, 30, 41, 51],
    ];

    const result = Genemo.crossover.uniform()([mother, father], random);
    expect(result).toStrictEqual(offsprings);
  });
});
