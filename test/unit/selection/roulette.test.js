const Genemo = require('../../../lib');
const cyclicProvider = require('../../test-utils/cyclicProvider');

// Common inputs
const evaluatedPopulation = [
  { fitness: 1.2 },
  { fitness: 3.6 },
  { fitness: 1.6 },
  { fitness: 4 },
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
      { fitness: 1.2 },
      { fitness: 4 },
      { fitness: 1.6 },
      { fitness: 4 },
      { fitness: 4 },
    ];

    const roulette = Genemo.selection.roulette();
    const result = roulette(evaluatedPopulation, random);
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
      { fitness: 1.2 },
      { fitness: 0.1 },
      { fitness: 1.6 },
      { fitness: 0.1 },
      { fitness: 0.1 },
    ];

    const roulette = Genemo.selection.roulette({ minimizeFitness: true });
    const result = roulette(evaluatedPopulation, random);
    expect(result).toStrictEqual(offspring);
  });

  test('Returns correct parents population for uniform fitnesses', () => {
    // Input
    const evaluatedPopulationWithUniformFitnesses = [
      { fitness: 2, individual: 'A' },
      { fitness: 2, individual: 'B' },
      { fitness: 2, individual: 'C' },
      { fitness: 2, individual: 'D' },
      { fitness: 2, individual: 'E' },
    ];
    const random = cyclicProvider([
      0.0,
      0.99,
      0.5,
      0.7,
      0.98,
    ]);

    // Expected result
    const offspring = [
      { fitness: 2, individual: 'A' },
      { fitness: 2, individual: 'E' },
      { fitness: 2, individual: 'C' },
      { fitness: 2, individual: 'D' },
      { fitness: 2, individual: 'E' },
    ];

    const roulette = Genemo.selection.roulette({ minimizeFitness: false });
    const result = roulette(evaluatedPopulationWithUniformFitnesses, random);
    expect(result).toStrictEqual(offspring);
  });

  test('Returns correct parents population for negative fitnesses', () => {
    // Input
    const evaluatedPopulationWithUniformFitnesses = [
      { fitness: -3, individual: 'A' },
      { fitness: 2, individual: 'B' },
      { fitness: 2, individual: 'C' },
      { fitness: 2, individual: 'D' },
      { fitness: 2, individual: 'E' },
      { fitness: 2, individual: 'F' },
    ];
    const random = cyclicProvider([
      0.0,
      0.99,
      0.5,
      0.7,
      0.98,
      0.5,
    ]);

    // Expected result
    const offspring = [
      { fitness: 2, individual: 'B' },
      { fitness: 2, individual: 'F' },
      { fitness: 2, individual: 'D' },
      { fitness: 2, individual: 'E' },
      { fitness: 2, individual: 'F' },
      { fitness: 2, individual: 'D' },
    ];

    const roulette = Genemo.selection.roulette({ minimizeFitness: false });
    const result = roulette(evaluatedPopulationWithUniformFitnesses, random);
    expect(result).toStrictEqual(offspring);
  });
});
