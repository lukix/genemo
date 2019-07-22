/* Test how asyncify behaves in environments with no setImmediate function */
global.setImmediate = undefined;
const asyncify = require('../../../src/utils/asyncify');

describe('asyncify on browser env', () => {
  test('Behaves correctly when there is no setImmediate function', (done) => {
    const mockFn = jest.fn(x => x);
    const mockFnAsync = asyncify(mockFn);
    const arg = 5;
    mockFnAsync(arg).then((result) => {
      expect(result).toStrictEqual(arg);
      done();
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
