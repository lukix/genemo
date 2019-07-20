const Genemo = require('../../../src');

describe('run', () => {
  test('Calls genetic operator functions correct number of times', async (done) => {
    const generateInitialPopulation = jest.fn(() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const selection = jest.fn(population => population);
    const reproduce = jest.fn(population => population.map(({ individual }) => individual));
    const fitness = jest.fn(() => 1);
    const stopCondition = jest.fn(Genemo.stopCondition({ maxGenerations: 2 }));

    const evolutionOptions = {
      generateInitialPopulation,
      selection,
      reproduce,
      fitness,
      stopCondition,
    };

    await Genemo.run(evolutionOptions);
    expect(generateInitialPopulation).toHaveBeenCalledTimes(1);
    expect(selection).toHaveBeenCalledTimes(2);
    expect(reproduce).toHaveBeenCalledTimes(2);
    expect(fitness).toHaveBeenCalledTimes(10 + 2 * 10);
    expect(stopCondition).toHaveBeenCalledTimes(2);
    done();
  });

  test('Runs correct number of iterations when not using macrotasks', async (done) => {
    const generateInitialPopulation = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const selection = population => population;
    const reproduce = population => population.map(({ individual }) => individual);
    const fitness = () => 1;
    const stopCondition = Genemo.stopCondition({ maxGenerations: 2 });

    const evolutionOptions = {
      generateInitialPopulation,
      selection,
      reproduce,
      fitness,
      stopCondition,
      maxBlockingTime: 0,
    };

    const { generation } = await Genemo.run(evolutionOptions);
    expect(generation).toEqual(2);
    done();
  });
});
