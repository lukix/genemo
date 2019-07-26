const getCurrentTime = require('./getCurrentTime');

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

module.exports = Timer;
