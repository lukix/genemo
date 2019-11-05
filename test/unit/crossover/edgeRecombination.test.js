import Genemo from '../../../src';
import {
  getNeighbors,
  createNeighborsMap,
  createSingleChild,
} from '../../../src/crossover/edgeRecombination';
import cyclicProvider from '../../test-utils/cyclicProvider';

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
    const mother = ['A', 'B', 'F', 'E', 'D', 'G', 'C'];
    const father = ['G', 'F', 'A', 'B', 'C', 'D', 'E'];
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
    const mother = ['A', 'B', 'F', 'E', 'D', 'G', 'C'];
    const father = ['G', 'F', 'A', 'B', 'C', 'D', 'E'];
    const random = cyclicProvider([0.0, 0.2, 0.0, 0.2, 0.99, 0.99, 0.2]);
    const hashGene = gene => gene;

    // Expected result
    const expectedResult = ['A', 'B', 'F', 'E', 'G', 'C', 'D'];

    const result = createSingleChild([mother, father], hashGene, random);
    expect(result).toStrictEqual(expectedResult);
  });

  test('createSingleChild returns a correct offspring for single-gene parents', () => {
    // Input
    const mother = ['A'];
    const father = ['A'];
    const random = cyclicProvider([0.2]);
    const hashGene = gene => gene;

    // Expected result
    const expectedResult = ['A'];

    const result = createSingleChild([mother, father], hashGene, random);
    expect(result).toStrictEqual(expectedResult);
  });

  test('Returns correct offsprings', () => {
    // Input
    const mother = ['A', 'B', 'C'];
    const father = ['C', 'A', 'B'];
    const random = cyclicProvider([0.99, 0.0, 0.2]);

    // Expected result
    const expectedResult = [
      ['C', 'B', 'A'],
      ['A', 'C', 'B'],
    ];

    const result = Genemo.crossover.edgeRecombination()([mother, father], random);
    expect(result).toStrictEqual(expectedResult);
  });

  test('Returns correct offsprings when using custom hashGene function', () => {
    // Input
    const mother = ['A', 'B', 'C'];
    const father = ['C', 'A', 'B'];
    const random = cyclicProvider([0.99, 0.0, 0.2]);
    const options = { hashGene: gene => gene };

    // Expected result
    const expectedResult = [
      ['C', 'B', 'A'],
      ['A', 'C', 'B'],
    ];

    const result = Genemo.crossover.edgeRecombination(options)([mother, father], random);
    expect(result).toStrictEqual(expectedResult);
  });
});
