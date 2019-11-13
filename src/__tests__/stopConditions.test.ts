import Genemo from '..';

describe('stopCondition', () => {
  test('Returns correct value for each condition', () => {
    const evaluatedPopulation = [
      { individual: 1, fitness: -7 },
      { individual: 2, fitness: 5 },
      { individual: 3, fitness: 0 },
    ];
    const iteration = 50;

    const stopCondition1 = Genemo.stopCondition({ minFitness: 10, maxIterations: 100 });
    const stopCondition2 = Genemo.stopCondition({ minFitness: 4, maxIterations: 100 });
    const stopCondition3 = Genemo.stopCondition({ maxFitness: 10 });
    const stopCondition4 = Genemo.stopCondition({ maxIterations: 10 });

    expect(stopCondition1({ evaluatedPopulation, iteration })).toBe(false);
    expect(stopCondition2({ evaluatedPopulation, iteration })).toBe(true);
    expect(stopCondition3({ evaluatedPopulation, iteration })).toBe(true);
    expect(stopCondition4({ evaluatedPopulation, iteration })).toBe(true);
  });
});
