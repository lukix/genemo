const Genemo = require('../src');

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
        { fitness: 9 },
        { fitness: 10 },
        { fitness: 5 },
      ],
      logs: { customKey: { lastValue: 3.1990 } },
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
      logs: { customKey: { lastValue: 5 } },
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
      evaluatedPopulation: [{ fitness: 2 }],
    });

    const expectedLogStr = 'avgFitness-2-suffix';
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedLogStr);
  });
});
