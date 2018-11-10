const Genemo = require('../../../lib');
const cyclicProvider = require('../../test-utils/cyclicProvider');

// Common inputs
const mother = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const father = [11, 21, 31, 41, 51, 61, 71, 81, 91, 101];

describe('Single-point crossover', () => {
  test('Returns correct offsprings', () => {
    // Input
    const random = cyclicProvider([0.4]);

    // Expected result
    const offsprings = [
      [10, 20, 30, 40, 51, 61, 71, 81, 91, 101],
      [11, 21, 31, 41, 50, 60, 70, 80, 90, 100],
    ];

    const result = Genemo.crossover.singlePoint([mother, father], random);
    expect(result).toStrictEqual(offsprings);
  });

  test('Cutting point at the beginning of an array', () => {
    // Input
    const random = cyclicProvider([0]);

    // Expected result
    const offsprings = [
      [11, 21, 31, 41, 51, 61, 71, 81, 91, 101],
      [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    ];

    const result = Genemo.crossover.singlePoint([mother, father], random);
    expect(result).toStrictEqual(offsprings);
  });

  test('Cutting point at the end of an array', () => {
    // Input
    const random = cyclicProvider([1]);

    // Expected result
    const offsprings = [
      [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      [11, 21, 31, 41, 51, 61, 71, 81, 91, 101],
    ];

    const result = Genemo.crossover.singlePoint([mother, father], random);
    expect(result).toStrictEqual(offsprings);
  });
});
