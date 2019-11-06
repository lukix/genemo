import getCurrentTime from './getCurrentTime';

const Timer = () => {
  const timers: Array<number> = [];

  return {
    start: () => {
      timers.push(getCurrentTime());
    },
    stop: () => {
      const lastTimer = timers.pop();
      if (typeof lastTimer === 'undefined') {
        throw new Error('timer.stop has been called without corresponding timer.start call');
      }
      return getCurrentTime() - lastTimer;
    },
  };
};

export default Timer;
