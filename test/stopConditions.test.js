const Genemo = require('../src');

describe('stopCondition', () => {
  test('Returns correct value for each condition', () => {
    const evaluatedPopulation = [
      { individual: 1, fitness: -7 },
      { individual: 2, fitness: 5 },
      { individual: 3, fitness: 0 },
    ];
    const generation = 50;

    const stopCondition1 = Genemo.stopCondition({ minFitness: 10, maxGenerations: 100 });
    const stopCondition2 = Genemo.stopCondition({ minFitness: 4, maxGenerations: 100 });
    const stopCondition3 = Genemo.stopCondition({ maxFitness: 10 });
    const stopCondition4 = Genemo.stopCondition({ maxGenerations: 10 });

    expect(stopCondition1({ evaluatedPopulation, generation })).toBe(false);
    expect(stopCondition2({ evaluatedPopulation, generation })).toBe(true);
    expect(stopCondition3({ evaluatedPopulation, generation })).toBe(true);
    expect(stopCondition4({ evaluatedPopulation, generation })).toBe(true);
  });
});
