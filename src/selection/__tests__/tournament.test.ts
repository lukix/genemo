import Genemo from '../..';
import cyclicProvider from '../../testUtils/cyclicProvider';

// Common inputs
const evaluatedPopulation = [
  { individual: 'A', fitness: 0 },
  { individual: 'B', fitness: -100 },
  { individual: 'C', fitness: 2 },
  { individual: 'D', fitness: 2 },
  { individual: 'E', fitness: -3.1 },
];


describe('tournament', () => {
  test('Returns correct parents population (maximization)', () => {
    // Input
    const tournamentSelection = Genemo.selection.tournament({
      size: 3,
      minimizeFitness: false,
    });
    const random = cyclicProvider([
      0.0, 0.2, 0.4,
      0.39, 0.39, 0.6,
      0.99, 0.0, 0.2,
      0.0, 0.0, 0.0,
      0.99, 0.99, 1.0 - Number.EPSILON,
    ]);

    // Expected result
    const offsprings = [
      { individual: 'C', fitness: 2 },
      { individual: 'D', fitness: 2 },
      { individual: 'A', fitness: 0 },
      { individual: 'A', fitness: 0 },
      { individual: 'E', fitness: -3.1 },
    ];

    const result = tournamentSelection(evaluatedPopulation, random);
    expect(result).toStrictEqual(offsprings);
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
    const offsprings = [
      { individual: 'B', fitness: -100 },
      { individual: 'B', fitness: -100 },
      { individual: 'B', fitness: -100 },
      { individual: 'A', fitness: 0 },
      { individual: 'E', fitness: -3.1 },
    ];

    const result = tournamentSelection(evaluatedPopulation, random);
    expect(result).toStrictEqual(offsprings);
  });
});
