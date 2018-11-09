const GMO = require('../../../lib');
const { createChildUsingPMXCrossover } = require('../../../lib/crossover/pmx');
const cyclicProvider = require('../../test-utils/cyclicProvider');

// Common inputs
const mother = [8, 4, 7, 3, 6, 2, 5, 1, 9, 0];
const father = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


describe('createChildUsingPMXCrossover', () => {
  test('Returns correct offspring', () => {
    // Input
    const minIndex = 3;
    const maxIndex = 7;

    // Expected result
    const offspring = [0, 7, 4, 3, 6, 2, 5, 1, 8, 9];

    const result = createChildUsingPMXCrossover([mother, father], minIndex, maxIndex);
    expect(result).toStrictEqual(offspring);
  });
});

describe('PMX crossover', () => {
  test('Returns correct offsprings', () => {
    // Input
    const random = cyclicProvider([0.7, 0.3]);

    // Expected result
    const offsprings = [
      [0, 7, 4, 3, 6, 2, 5, 1, 8, 9],
      [8, 2, 1, 3, 4, 5, 6, 7, 9, 0],
    ];

    const result = GMO.crossover.PMX([mother, father], random);
    expect(result).toStrictEqual(offsprings);
  });
});
