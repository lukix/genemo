import Genemo from '../../src';

// Common input
const prevPopulation = [
  { individual: 1, fitness: 1 },
  { individual: 2, fitness: 2 },
  { individual: 3, fitness: 5 },
  { individual: 4, fitness: 3 },
  { individual: 5, fitness: 4 },
];
const childrenPopulation = [
  { individual: 6, fitness: 2 },
  { individual: 7, fitness: 2 },
  { individual: 8, fitness: 7 },
  { individual: 9, fitness: 4 },
  { individual: 10, fitness: 3 },
];

describe('Elitism', () => {
  test('Returns correct population (maximization)', () => {
    // Expected result
    const resultPopulation = [
      { individual: 3, fitness: 5 },
      { individual: 5, fitness: 4 },
      { individual: 8, fitness: 7 },
      { individual: 9, fitness: 4 },
      { individual: 10, fitness: 3 },
    ];

    const elitism = Genemo.elitism({
      keepFactor: 0.4,
      minimizeFitness: false,
    });
    const result = elitism({ prevPopulation, childrenPopulation });
    expect(result).toStrictEqual(resultPopulation);
  });

  test('Returns correct population (minimization)', () => {
    // Expected result
    const resultPopulation = [
      { individual: 1, fitness: 1 },
      { individual: 7, fitness: 2 },
      { individual: 8, fitness: 7 },
      { individual: 9, fitness: 4 },
      { individual: 10, fitness: 3 },
    ];

    const elitism = Genemo.elitism({
      keepFactor: 0.2,
      minimizeFitness: true,
    });
    const result = elitism({ prevPopulation, childrenPopulation });
    expect(result).toStrictEqual(resultPopulation);
  });
});
