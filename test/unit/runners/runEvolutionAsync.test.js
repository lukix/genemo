const Genemo = require('../../../src');

describe('runEvolutionAsync', () => {
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

    await Genemo.runEvolutionAsync(evolutionOptions);
    expect(generateInitialPopulation).toHaveBeenCalledTimes(1);
    expect(selection).toHaveBeenCalledTimes(2);
    expect(reproduce).toHaveBeenCalledTimes(2);
    expect(fitness).toHaveBeenCalledTimes(10 + 2 * 10);
    expect(stopCondition).toHaveBeenCalledTimes(2);
    done();
  });
});
