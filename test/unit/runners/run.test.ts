import Genemo from '../../../src';

describe('run', () => {
  test('Calls genetic operator functions correct number of times', async () => {
    const generateInitialPopulation = jest.fn(() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const selection = jest.fn(population => population);
    const reproduce = jest.fn(population => population.map(({ individual }) => individual));
    const evaluatePopulation = jest.fn(arr => arr.map(() => 1));
    const stopCondition = jest.fn(Genemo.stopCondition({ maxIterations: 2 }));
    const iterationCallback = jest.fn();

    const evolutionOptions = {
      generateInitialPopulation,
      selection,
      reproduce,
      evaluatePopulation,
      stopCondition,
      iterationCallback,
    };

    await Genemo.run(evolutionOptions);
    expect(generateInitialPopulation).toHaveBeenCalledTimes(1);
    expect(selection).toHaveBeenCalledTimes(2);
    expect(reproduce).toHaveBeenCalledTimes(2);
    expect(evaluatePopulation).toHaveBeenCalledTimes(3);
    expect(stopCondition).toHaveBeenCalledTimes(2);
    expect(iterationCallback).toHaveBeenCalledTimes(2);
  });

  test('Runs correct number of iterations when not using macrotasks', async () => {
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
  });

  test('Calls succession with correct parameters', async () => {
    const generateInitialPopulation = jest.fn(() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const selection = population => population;
    const reproduce = population => population.map(({ individual }) => individual);
    const evaluatePopulation = arr => arr.map(() => 1);
    const stopCondition = Genemo.stopCondition({ maxIterations: 1 });
    const succession = jest.fn(({ childrenPopulation }) => childrenPopulation);
    const random = () => 0.5;

    const evolutionOptions = {
      generateInitialPopulation,
      selection,
      reproduce,
      evaluatePopulation,
      stopCondition,
      succession,
      random,
    };

    await Genemo.run(evolutionOptions);
    expect(succession).toHaveBeenCalledTimes(1);
    expect(succession).toHaveBeenCalledWith({
      prevPopulation: [
        { individual: 0, fitness: 1 },
        { individual: 1, fitness: 1 },
        { individual: 2, fitness: 1 },
        { individual: 3, fitness: 1 },
        { individual: 4, fitness: 1 },
        { individual: 5, fitness: 1 },
        { individual: 6, fitness: 1 },
        { individual: 7, fitness: 1 },
        { individual: 8, fitness: 1 },
        { individual: 9, fitness: 1 },
      ],
      childrenPopulation: [
        { individual: 0, fitness: 1 },
        { individual: 1, fitness: 1 },
        { individual: 2, fitness: 1 },
        { individual: 3, fitness: 1 },
        { individual: 4, fitness: 1 },
        { individual: 5, fitness: 1 },
        { individual: 6, fitness: 1 },
        { individual: 7, fitness: 1 },
        { individual: 8, fitness: 1 },
        { individual: 9, fitness: 1 },
      ],
    }, random);
  });
});
