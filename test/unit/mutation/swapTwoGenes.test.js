const Genemo = require('../../../src');
const cyclicProvider = require('../../test-utils/cyclicProvider');


describe('swapTwoGenes', () => {
  test('Returns correct mutated individual', () => {
    // Input
    const random = cyclicProvider([
      0.0,
      0.99,
    ]);
    const individual = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Expected result
    const expectedMutatedIndividual = [9, 1, 2, 3, 4, 5, 6, 7, 8, 0];

    const result = Genemo.mutation.swapTwoGenes(individual, random);
    expect(result).toStrictEqual(expectedMutatedIndividual);
  });

  test('Returns correct mutated individual when swaping gene with itself', () => {
    // Input
    const random = cyclicProvider([
      0.35,
      0.35,
    ]);
    const individual = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Expected result
    const expectedMutatedIndividual = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const result = Genemo.mutation.swapTwoGenes(individual, random);
    expect(result).toStrictEqual(expectedMutatedIndividual);
  });
});
