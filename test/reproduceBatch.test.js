import Genemo from '../src';
import { selectParentsPairs } from '../src/reproduceBatch';
import cyclicProvider from './test-utils/cyclicProvider';

describe('reproduceBatch', () => {
  test('Returns correct population with odd number of individuals', async () => {
    const random = cyclicProvider([
      // Crossover
      0.41, 0.21,
      0.0, 0.99,
      0.21, 0.99,

      // Mutation
      0.01, 0.99, 0.99, 0.01, 0.99,
    ]);
    const evaluatedPopulation = [
      { individual: '0', fitness: 1 },
      { individual: '1', fitness: 3 },
      { individual: '2', fitness: -2 },
      { individual: '3', fitness: 5 },
      { individual: '4', fitness: 1 },
    ];

    const expectedResult = ['1', '0', '1', '2m', '4m'];

    const reproduceBatch = Genemo.reproduceBatch({
      mutateAll: individuals => individuals.map(individual => `${individual}m`),
      crossoverAll: pairs => pairs.map(([a, b]) => [a, b]),
    });
    const result = await reproduceBatch(evaluatedPopulation, random, () => null);
    expect(result).toStrictEqual(expectedResult);
  });

  test('selectParentsPairs returns correct pairs', async () => {
    const random = cyclicProvider([
      0.41, 0.21,
      0.0, 0.99,
      0.21, 0.99,
    ]);
    const evaluatedPopulation = [
      { individual: 0, fitness: 1 },
      { individual: 1, fitness: 3 },
      { individual: 2, fitness: -2 },
      { individual: 3, fitness: 5 },
      { individual: 4, fitness: 1 },
    ];

    const expectedResult = [
      [2, 1],
      [0, 4],
      [1, 4],
    ];

    const result = selectParentsPairs({
      evaluatedPopulation,
      targetPopulationSize: evaluatedPopulation.length,
      random,
    });
    expect(result).toStrictEqual(expectedResult);
  });

  test('Calls mutateAll with an empty array when mutationProbability = 0', async () => {
    const random = cyclicProvider([0.5]);
    const evaluatedPopulation = [
      { individual: '0', fitness: 1 },
      { individual: '1', fitness: 3 },
      { individual: '2', fitness: -2 },
      { individual: '3', fitness: 5 },
      { individual: '4', fitness: 1 },
    ];
    const mutateAll = jest.fn(individuals => individuals);

    const reproduceBatch = Genemo.reproduceBatch({
      mutateAll,
      crossoverAll: pairs => pairs.map(([a, b]) => [a, b]),
      mutationProbability: 0,
    });
    await reproduceBatch(evaluatedPopulation, random, () => null);

    expect(mutateAll).toHaveBeenCalledTimes(1);
    expect(mutateAll).toHaveBeenCalledWith([], random);
  });
});
