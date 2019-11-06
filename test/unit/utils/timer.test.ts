import Timer from '../../../src/utils/timer';

describe('Timer', () => {
  test('To throw an error when "stop" is called without calling "start" beforehand', () => {
    const timer = Timer();
    expect(() => timer.stop()).toThrow();
  });
});
