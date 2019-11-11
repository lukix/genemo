import Genemo from '../../../src';
import cyclicProvider from '../../test-utils/cyclicProvider';

// Common inputs
const evaluatedPopulation = [
  { individual: 'A', fitness: 1.2 },
  { individual: 'B', fitness: 3.6 },
  { individual: 'C', fitness: 1.6 },
  { individual: 'D', fitness: 4 },
  { individual: 'E', fitness: 0.1 },
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
      { individual: 'A', fitness: 1.2 },
      { individual: 'D', fitness: 4 },
      { individual: 'B', fitness: 3.6 },
      { individual: 'D', fitness: 4 },
      { individual: 'D', fitness: 4 },
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
      { individual: 'B', fitness: 3.6 },
      { individual: 'E', fitness: 0.1 },
      { individual: 'A', fitness: 1.2 },
      { individual: 'E', fitness: 0.1 },
      { individual: 'E', fitness: 0.1 },
    ];

    const rank = Genemo.selection.rank({ minimizeFitness: true });
    const result = rank(evaluatedPopulation, random);
    expect(result).toStrictEqual(offspring);
  });
});
