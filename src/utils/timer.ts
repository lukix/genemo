import getCurrentTime from './getCurrentTime';

const Timer = () => {
  const timers: Array<any> = [];

  return {
    start: () => {
      timers.push(getCurrentTime());
    },
    stop: () => (
      getCurrentTime() - timers.pop()
    ),
  };
};

export default Timer;
