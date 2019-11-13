import findBestIndividual from '../findBestIndividual';

describe('findBestIndividual', () => {
  test('Returns correct individual (maximization)', () => {
    const evaluatedPopulation = [
      { individual: 'A', fitness: 1.2 },
      { individual: 'B', fitness: 3.6 },
      { individual: 'C', fitness: 1.6 },
      { individual: 'D', fitness: 4 },
      { individual: 'E', fitness: 0.1 },
    ];

    // Expected result
    const bestIndividual = { individual: 'D', fitness: 4 };

    const result = findBestIndividual(evaluatedPopulation, false);
    expect(result).toStrictEqual(bestIndividual);
  });

  test('Returns correct individual (minimization)', () => {
    const evaluatedPopulation = [
      { individual: 'A', fitness: 1.2 },
      { individual: 'B', fitness: 3.6 },
      { individual: 'C', fitness: 1.6 },
      { individual: 'D', fitness: 4 },
      { individual: 'E', fitness: 0.1 },
    ];

    // Expected result
    const bestIndividual = { individual: 'E', fitness: 0.1 };

    const result = findBestIndividual(evaluatedPopulation, true);
    expect(result).toStrictEqual(bestIndividual);
  });

  test('Returns correct individual when it is at index 0 (maximization)', () => {
    const evaluatedPopulation = [
      { individual: 'A', fitness: 5.9 },
      { individual: 'B', fitness: 1.2 },
      { individual: 'C', fitness: 3.6 },
      { individual: 'D', fitness: 1.6 },
      { individual: 'E', fitness: 4 },
      { individual: 'F', fitness: 0.1 },
    ];

    // Expected result
    const bestIndividual = { individual: 'A', fitness: 5.9 };

    const result = findBestIndividual(evaluatedPopulation, false);
    expect(result).toStrictEqual(bestIndividual);
  });

  test('Returns correct individual when it is at index 0 (minimization)', () => {
    const evaluatedPopulation = [
      { individual: 'A', fitness: -7.7 },
      { individual: 'B', fitness: 1.2 },
      { individual: 'C', fitness: 3.6 },
      { individual: 'D', fitness: 1.6 },
      { individual: 'E', fitness: 4 },
      { individual: 'F', fitness: 0.1 },
    ];

    // Expected result
    const bestIndividual = { individual: 'A', fitness: -7.7 };

    const result = findBestIndividual(evaluatedPopulation, true);
    expect(result).toStrictEqual(bestIndividual);
  });
});
