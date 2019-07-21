const asyncify = require('../../../src/utils/asyncify');

describe('asyncify', () => {
  test('Runs asynchronously and returns correct value with promise', (done) => {
    const mockFn = jest.fn(x => x);
    const mockFnAsync = asyncify(mockFn);
    const arg = 5;
    mockFnAsync(arg).then((result) => {
      expect(result).toStrictEqual(arg);
      done();
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test('Correctly handles exception', (done) => {
    const mockFn = jest.fn((x) => { throw x; });
    const mockFnAsync = asyncify(mockFn);
    const arg = 5;
    mockFnAsync(arg).catch((result) => {
      expect(result).toStrictEqual(arg);
      done();
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
