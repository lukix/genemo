const Genemo = require('../../../src');
const {
  getNeighbors,
  createNeighborsMap,
  createSingleChild,
} = require('../../../src/crossover/edgeRecombination');
const cyclicProvider = require('../../test-utils/cyclicProvider');

// Common inputs
const mother = ['A', 'B', 'F', 'E', 'D', 'G', 'C'];
const father = ['G', 'F', 'A', 'B', 'C', 'D', 'E'];

describe('Edge recombination crossover', () => {
  test('getNeighbors function works for the first element', () => {
    // Input
    const array = ['A', 'B', 'C', 'D'];
    const index = 0;

    // Expected result
    const expectedResult = ['D', 'B'];
    const result = getNeighbors(array, index);
    expect(result).toStrictEqual(expectedResult);
  });

  test('getNeighbors function works for the last element', () => {
    // Input
    const array = ['A', 'B', 'C', 'D'];
    const index = 3;

    // Expected result
    const expectedResult = ['C', 'A'];
    const result = getNeighbors(array, index);
    expect(result).toStrictEqual(expectedResult);
  });

  test('getNeighbors function works for an array with 2 items', () => {
    // Input
    const array = ['A', 'B'];
    const index = 0;

    // Expected result
    const expectedResult = ['B'];
    const result = getNeighbors(array, index);
    expect(result).toStrictEqual(expectedResult);
  });

  test('getNeighbors function works for an array with 1 items', () => {
    // Input
    const array = ['A'];
    const index = 0;

    // Expected result
    const expectedResult = [];
    const result = getNeighbors(array, index);
    expect(result).toStrictEqual(expectedResult);
  });

  test('createNeighborsMap function returns a correct map', () => {
    // Given
    const hashGene = gene => gene;
    const expectedResult = new Map([
      ['A', ['C', 'B', 'F']],
      ['B', ['A', 'F', 'C']],
      ['C', ['G', 'A', 'B', 'D']],
      ['D', ['E', 'G', 'C']],
      ['E', ['F', 'D', 'G']],
      ['F', ['B', 'E', 'G', 'A']],
      ['G', ['D', 'C', 'E', 'F']],
    ]);

    // When
    const neighborsMap = createNeighborsMap(mother, father, hashGene);

    // Then
    expect(neighborsMap).toStrictEqual(expectedResult);
  });

  test('createSingleChild returns a correct offspring', () => {
    // Input
    const random = cyclicProvider([0.0, 0.2, 0.0, 0.2, 0.99, 0.99, 0.2]);
    const hashGene = gene => gene;

    // Expected result
    const expectedResult = ['A', 'B', 'F', 'E', 'G', 'C', 'D'];

    const result = createSingleChild([mother, father], hashGene, random);
    expect(result).toStrictEqual(expectedResult);
  });

  test('Returns correct offsprings', () => {
    // Input
    const parentA = ['A', 'B', 'C'];
    const parentB = ['C', 'A', 'B'];
    const random = cyclicProvider([0.99, 0.0, 0.2]);

    // Expected result
    const expectedResult = [
      ['C', 'B', 'A'],
      ['A', 'C', 'B'],
    ];

    const result = Genemo.crossover.edgeRecombination()([parentA, parentB], random);
    expect(result).toStrictEqual(expectedResult);
  });
});
