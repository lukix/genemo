const Genemo = require('../src');
const cyclicProvider = require('./test-utils/cyclicProvider');

describe('reproduce', () => {
  test('Returns correct population with odd number of individuals', () => {
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

    const expectedResult = [2, 1, 0, 4, 1];

    const reproduce = Genemo.reproduce({
      mutate: individual => individual,
      crossover: (([a, b]) => [a, b]),
    });
    const result = reproduce(evaluatedPopulation, random);
    expect(result).toStrictEqual(expectedResult);
  });

  test('Calls mutation for the right individuals', () => {
    const random = cyclicProvider([
      0.41, 0.21,
      0.0, 0.99,
      0.21, 0.99,
      0.5, 0.0, 0.9, 0.1, 0.8,
    ]);
    const evaluatedPopulation = [
      { individual: 0, fitness: 1 },
      { individual: 1, fitness: 3 },
      { individual: 2, fitness: -2 },
      { individual: 3, fitness: 5 },
      { individual: 4, fitness: 1 },
    ];

    const expectedResult = [2, 101, 0, 104, 1];

    const reproduce = Genemo.reproduce({
      mutate: individual => individual + 100,
      crossover: ([a, b]) => [a, b],
      mutationProbability: 0.1,
    });
    const result = reproduce(evaluatedPopulation, random);
    expect(result).toStrictEqual(expectedResult);
  });
});
