const Genemo = require('../../../src');
const cyclicProvider = require('../../test-utils/cyclicProvider');

// Common inputs
const evaluatedPopulation = [
  { fitness: 0 },
  { fitness: -100 },
  { fitness: 2 },
  { fitness: 2 },
  { fitness: -3.1 },
];


describe('tournament', () => {
  test('Returns correct parents population (maximization)', () => {
    // Input
    const tournamentSelection = Genemo.selection.tournament({
      size: 3,
    });
    const random = cyclicProvider([
      0.0, 0.2, 0.4,
      0.39, 0.39, 0.6,
      0.99, 0.0, 0.2,
      0.0, 0.0, 0.0,
      0.99, 0.99, 1.0 - Number.EPSILON,
    ]);

    // Expected result
    const offspring = [
      { fitness: 2 },
      { fitness: 2 },
      { fitness: 0 },
      { fitness: 0 },
      { fitness: -3.1 },
    ];

    const result = tournamentSelection(evaluatedPopulation, random);
    expect(result).toStrictEqual(offspring);
  });

  test('Returns correct parents population (minimization)', () => {
    // Input
    const tournamentSelection = Genemo.selection.tournament({
      size: 3,
      minimizeFitness: true,
    });
    const random = cyclicProvider([
      0.0, 0.2, 0.4,
      0.39, 0.39, 0.6,
      0.99, 0.0, 0.2,
      0.0, 0.0, 0.0,
      0.99, 0.99, 1.0 - Number.EPSILON,
    ]);

    // Expected result
    const offspring = [
      { fitness: -100 },
      { fitness: -100 },
      { fitness: -100 },
      { fitness: 0 },
      { fitness: -3.1 },
    ];

    const result = tournamentSelection(evaluatedPopulation, random);
    expect(result).toStrictEqual(offspring);
  });
});
