const Genemo = require('../../../src');

describe('getGenerationsIterator', () => {
  test('Calls genetic operator functions correct number of times', () => {
    const generateInitialPopulation = jest.fn(() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const selection = jest.fn(population => population);
    const reproduce = jest.fn(population => population.map(({ individual }) => individual));
    const fitness = jest.fn(() => 1);

    const evolutionOptions = {
      generateInitialPopulation,
      selection,
      reproduce,
      fitness,
    };

    const generationsIterator = Genemo.getGenerationsIterator(evolutionOptions);
    generationsIterator.next();
    generationsIterator.next();
    expect(generateInitialPopulation).toHaveBeenCalledTimes(1);
    expect(selection).toHaveBeenCalledTimes(2);
    expect(reproduce).toHaveBeenCalledTimes(2);
    expect(fitness).toHaveBeenCalledTimes(10 + 2 * 10);
  });
});