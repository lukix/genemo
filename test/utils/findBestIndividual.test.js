const findBestIndividual = require('../../lib/utils/findBestIndividual');

describe('findBestIndividual', () => {
  test('Returns correct individual (maximization)', () => {
    const evaluatedPopulation = [
      { fitness: 1.2 },
      { fitness: 3.6 },
      { fitness: 1.6 },
      { fitness: 4 },
      { fitness: 0.1 },
    ];

    // Expected result
    const bestIndividual = { fitness: 4 };

    const result = findBestIndividual(evaluatedPopulation, false);
    expect(result).toStrictEqual(bestIndividual);
  });

  test('Returns correct individual (minimization)', () => {
    const evaluatedPopulation = [
      { fitness: 1.2 },
      { fitness: 3.6 },
      { fitness: 1.6 },
      { fitness: 4 },
      { fitness: 0.1 },
    ];

    // Expected result
    const bestIndividual = { fitness: 0.1 };

    const result = findBestIndividual(evaluatedPopulation, true);
    expect(result).toStrictEqual(bestIndividual);
  });

  test('Returns correct individual when it is at index 0 (maximization)', () => {
    const evaluatedPopulation = [
      { fitness: 5.9 },
      { fitness: 1.2 },
      { fitness: 3.6 },
      { fitness: 1.6 },
      { fitness: 4 },
      { fitness: 0.1 },
    ];

    // Expected result
    const bestIndividual = { fitness: 5.9 };

    const result = findBestIndividual(evaluatedPopulation, false);
    expect(result).toStrictEqual(bestIndividual);
  });

  test('Returns correct individual when it is at index 0 (minimization)', () => {
    const evaluatedPopulation = [
      { fitness: -7.7 },
      { fitness: 1.2 },
      { fitness: 3.6 },
      { fitness: 1.6 },
      { fitness: 4 },
      { fitness: 0.1 },
    ];

    // Expected result
    const bestIndividual = { fitness: -7.7 };

    const result = findBestIndividual(evaluatedPopulation, true);
    expect(result).toStrictEqual(bestIndividual);
  });
});
