const Genemo = require('../../../src');
const cyclicProvider = require('../../test-utils/cyclicProvider');

// Common inputs
const evaluatedPopulation = [
  { fitness: 1.2 }, // 1 | 3
  { fitness: 3.6 }, // 3 | 1
  { fitness: 1.6 }, // 2 | 2
  { fitness: 4 }, // 4 | 0
  { fitness: 0.1 }, // 0 | 4
];


describe('rank', () => {
  test('Returns correct parents population (maximization)', () => {
    // Input
    const random = cyclicProvider([
      0.0,
      0.99,
      0.5,
      0.7,
      0.98,
    ]);

    // Expected result
    const offspring = [
      { fitness: 1.2 },
      { fitness: 4 },
      { fitness: 3.6 },
      { fitness: 4 },
      { fitness: 4 },
    ];

    const rank = Genemo.selection.rank({ minimizeFitness: false });
    const result = rank(evaluatedPopulation, random);
    expect(result).toStrictEqual(offspring);
  });

  test('Returns correct parents population (minimization)', () => {
    // Input
    const random = cyclicProvider([
      0.0,
      0.99,
      0.5,
      0.7,
      0.98,
    ]);

    // Expected result
    const offspring = [
      { fitness: 3.6 },
      { fitness: 0.1 },
      { fitness: 1.2 },
      { fitness: 0.1 },
      { fitness: 0.1 },
    ];

    const rank = Genemo.selection.rank({ minimizeFitness: true });
    const result = rank(evaluatedPopulation, random);
    expect(result).toStrictEqual(offspring);
  });
});
