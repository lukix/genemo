import asyncify from '../asyncify';

describe('asyncify', () => {
  test('Runs asynchronously and returns correct value with promise', async () => {
    const mockFn = jest.fn(x => x);
    const mockFnAsync = asyncify(mockFn);
    const arg = 5;
    const result = await mockFnAsync(arg);
    expect(result).toStrictEqual(arg);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('Correctly handles exception', async () => {
    const errorObj = Error('error');
    const mockFn = jest.fn(() => { throw errorObj; });
    const mockFnAsync = asyncify(mockFn);
    const arg = 5;
    await expect(mockFnAsync(arg)).rejects.toEqual(errorObj);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
