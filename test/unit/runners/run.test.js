const Genemo = require('../../../src');

describe('run', () => {
  test('Calls genetic operator functions correct number of times', async (done) => {
    const generateInitialPopulation = jest.fn(() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const selection = jest.fn(population => population);
    const reproduce = jest.fn(population => population.map(({ individual }) => individual));
    const evaluatePopulation = jest.fn(arr => arr.map(() => 1));
    const stopCondition = jest.fn(Genemo.stopCondition({ maxIterations: 2 }));

    const evolutionOptions = {
      generateInitialPopulation,
      selection,
      reproduce,
      evaluatePopulation,
      stopCondition,
    };

    await Genemo.run(evolutionOptions);
    expect(generateInitialPopulation).toHaveBeenCalledTimes(1);
    expect(selection).toHaveBeenCalledTimes(2);
    expect(reproduce).toHaveBeenCalledTimes(2);
    expect(evaluatePopulation).toHaveBeenCalledTimes(3);
    expect(stopCondition).toHaveBeenCalledTimes(2);
    done();
  });

  test('Runs correct number of iterations when not using macrotasks', async (done) => {
    const generateInitialPopulation = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const selection = population => population;
    const reproduce = population => population.map(({ individual }) => individual);
    const evaluatePopulation = jest.fn(arr => arr.map(() => 1));
    const stopCondition = Genemo.stopCondition({ maxIterations: 2 });

    const evolutionOptions = {
      generateInitialPopulation,
      selection,
      reproduce,
      evaluatePopulation,
      stopCondition,
      maxBlockingTime: 0,
    };

    const { iteration } = await Genemo.run(evolutionOptions);
    expect(iteration).toEqual(2);
    done();
  });
});
