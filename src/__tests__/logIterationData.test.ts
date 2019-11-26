import Genemo from '..';

describe('logIterationData', () => {
  test('customLogger should be called with a correct string', () => {
    const mockLogger = jest.fn(() => {});
    const iterationCallback = Genemo.logIterationData({
      customLogger: mockLogger,
      include: {
        minFitness: { show: true },
        maxFitness: { show: true },
        avgFitness: { show: true },
        logsKeys: [{ key: 'customKey' }],
      },
    });

    iterationCallback({
      iteration: 1,
      evaluatedPopulation: [
        { individual: 'A', fitness: 9 },
        { individual: 'B', fitness: 10 },
        { individual: 'C', fitness: 5 },
      ],
      logs: { customKey: { samples: 1, lastValue: 3.1990, meanValue: 3.1990 } },
      getLowestFitnessIndividual: () => ({ individual: 'C', fitness: 5 }),
      getHighestFitnessIndividual: () => ({ individual: 'B', fitness: 10 }),
    });

    const expectedLogStr = 'minFitness = 5, maxFitness = 10, avgFitness = 8, customKey = 3.20ms';
    expect(mockLogger).toHaveBeenCalledWith(expectedLogStr);
  });

  test('customLogger should be called with a correct string for default arguments', () => {
    const mockLogger = jest.fn(() => {});
    const iterationCallback = Genemo.logIterationData({
      customLogger: mockLogger,
      include: { iteration: { show: true } },
    });

    iterationCallback({
      iteration: 1,
      evaluatedPopulation: [],
      logs: {},
      // Insignificant properties:
      getLowestFitnessIndividual: () => ({ individual: 'C', fitness: 5 }),
      getHighestFitnessIndividual: () => ({ individual: 'B', fitness: 10 }),
    });

    const expectedLogStr = '#1';
    expect(mockLogger).toHaveBeenCalledWith(expectedLogStr);
  });

  test('should call default custom logger', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const iterationCallback = Genemo.logIterationData({
      include: { iteration: { show: true } },
    });

    iterationCallback({
      iteration: 10,
      evaluatedPopulation: [],
      logs: {},
      // Insignificant properties:
      getLowestFitnessIndividual: () => ({ individual: 'A', fitness: 5 }),
      getHighestFitnessIndividual: () => ({ individual: 'B', fitness: 10 }),
    });

    const expectedLogStr = '#10';
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedLogStr);
  });

  test('logs custom formatter should return a correct string', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const iterationCallback = Genemo.logIterationData({
      include: {
        logsKeys: [{ key: 'customKey', formatter: (key, value) => `${key}-${value}-suffix` }],
      },
    });

    iterationCallback({
      iteration: 10,
      evaluatedPopulation: [],
      logs: { customKey: { samples: 1, lastValue: 5, meanValue: 5 } },
      // Insignificant properties:
      getLowestFitnessIndividual: () => ({ individual: 'A', fitness: 5 }),
      getHighestFitnessIndividual: () => ({ individual: 'B', fitness: 10 }),
    });

    const expectedLogStr = 'customKey-5-suffix';
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedLogStr);
  });

  test('avgFitness custom formatter should return a correct string', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const iterationCallback = Genemo.logIterationData({
      include: {
        avgFitness: { show: true, formatter: (key, value) => `${key}-${value}-suffix` },
      },
    });

    iterationCallback({
      iteration: 10,
      evaluatedPopulation: [{ individual: 'A', fitness: 2 }],
      // Insignificant properties:
      logs: { customKey: { samples: 1, lastValue: 5, meanValue: 5 } },
      getLowestFitnessIndividual: () => ({ individual: 'A', fitness: 2 }),
      getHighestFitnessIndividual: () => ({ individual: 'A', fitness: 2 }),
    });

    const expectedLogStr = 'avgFitness-2-suffix';
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedLogStr);
  });
});
