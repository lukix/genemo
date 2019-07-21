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
      generation: 1,
      evaluatedPopulation: [
        { fitness: 9 },
        { fitness: 10 },
        { fitness: 5 },
      ],
      logs: { customKey: { lastValue: 3.1990 } },
    });

    const expectedLogStr = 'minFitness = 5, maxFitness = 10, avgFitness = 8, customKey = 3.20ms';
    expect(mockLogger).toBeCalledWith(expectedLogStr);
  });

  test('customLogger should be called with a correct string for default arguments', () => {
    const mockLogger = jest.fn(() => {});
    const iterationCallback = Genemo.logIterationData({
      customLogger: mockLogger,
      include: { iteration: { show: true } },
    });

    iterationCallback({
      generation: 1,
      evaluatedPopulation: [],
      logs: {},
    });

    const expectedLogStr = '#1';
    expect(mockLogger).toBeCalledWith(expectedLogStr);
  });

  test('should call default custom logger', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const iterationCallback = Genemo.logIterationData({
      include: { iteration: { show: true } },
    });

    iterationCallback({
      generation: 10,
      evaluatedPopulation: [],
      logs: {},
    });

    const expectedLogStr = '#10';
    expect(consoleLogSpy).toBeCalledWith(expectedLogStr);
  });
});
