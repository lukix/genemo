const GMO = require('../../lib');
const cyclicProvider = require('../utils/cyclicProvider');

// Common inputs
const evaluatedPopulation = [
  { fitness: 1 },
  { fitness: 3.5 },
  { fitness: 1.5 },
  { fitness: 3.9 },
  { fitness: 0.1 },
];


describe('roulette', () => {
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
      { fitness: 1 },
      { fitness: 0.1 },
      { fitness: 1.5 },
      { fitness: 3.9 },
      { fitness: 3.9 },
    ];

    const result = GMO.selection.roulette(evaluatedPopulation, random);
    expect(result).toStrictEqual(offspring);
  });
});
