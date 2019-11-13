/* Test how asyncify behaves in environments with no setImmediate function */
// @ts-ignore
global.setImmediate = undefined;
// eslint-disable-next-line import/first
import asyncify from '../asyncify';

describe('asyncify on browser env', () => {
  test('Behaves correctly when there is no setImmediate function', async () => {
    const mockFn = jest.fn(x => x);
    const mockFnAsync = asyncify(mockFn);
    const arg = 5;

    const result = await mockFnAsync(arg);
    expect(result).toStrictEqual(arg);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
