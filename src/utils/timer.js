import getCurrentTime from './getCurrentTime';

const Timer = () => {
  const timers = [];

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
