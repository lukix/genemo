const Genemo = require('../../../src');
const cyclicProvider = require('../../test-utils/cyclicProvider');

// Common inputs
const mother = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const father = [11, 21, 31, 41, 51, 61, 71, 81, 91, 101];

describe('Two-point crossover', () => {
  test('Returns correct offsprings', () => {
    // Input
    const random = cyclicProvider([0.4, 0.8]);

    // Expected result
    const offsprings = [
      [10, 20, 30, 40, 51, 61, 71, 81, 90, 100],
      [11, 21, 31, 41, 50, 60, 70, 80, 91, 101],
    ];

    const result = Genemo.crossover.twoPoint()([mother, father], random);
    expect(result).toStrictEqual(offsprings);
  });
});
