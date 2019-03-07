const Genemo = require('../src');

describe('logIterationData', () => {
  test('customLogger should be called with a correct string', () => {
    const mockLogger = jest.fn(() => {});
    const iterationCallback = Genemo.logIterationData({
      customLogger: mockLogger,
      include: {
        minFitness: true,
        maxFitness: true,
        avgFitness: true,
        debugDataKeys: ['customKey'],
      },
    });

    iterationCallback({
      generation: 1,
      evaluatedPopulation: [
        { fitness: 9 },
        { fitness: 10 },
        { fitness: 5 },
      ],
      debugData: { customKey: { lastValue: 3.1990 } },
    });

    const expectedLogStr = 'minFitness = 5, maxFitness = 10, avgFitness = 8, customKey = 3.20ms';
    expect(mockLogger).toBeCalledWith(expectedLogStr);
  });

  test('customLogger should be called with a correct string for default arguments', () => {
    const mockLogger = jest.fn(() => {});
    const iterationCallback = Genemo.logIterationData({
      customLogger: mockLogger,
      include: { generationNumber: true },
    });

    iterationCallback({
      generation: 1,
      evaluatedPopulation: [],
      debugData: {},
    });

    const expectedLogStr = '#1';
    expect(mockLogger).toBeCalledWith(expectedLogStr);
  });

  test('should call default custom logger', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const iterationCallback = Genemo.logIterationData({
      include: { generationNumber: true },
    });

    iterationCallback({
      generation: 10,
      evaluatedPopulation: [],
      debugData: {},
    });

    const expectedLogStr = '#10';
    expect(consoleLogSpy).toBeCalledWith(expectedLogStr);
  });
});
