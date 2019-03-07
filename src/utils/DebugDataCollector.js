const hrtime = require('browser-process-hrtime');

const getCurrentTimeInMiliseconds = () => {
  const [seconds, nanoseconds] = hrtime();
  return seconds * 1e3 + nanoseconds * 1e-6;
};

class DebugDataCollector {
  constructor() {
    this.data = {};
    this.clocks = {};
  }

  collect(key, value) {
    this.data[key] = this.data[key]
      ? {
        samples: this.data[key].samples + 1,
        lastValue: value,
        meanValue: (
          (this.data[key].meanValue * this.data[key].samples + value)
          / (this.data[key].samples + 1)
        ),
      }
      : {
        samples: 1,
        lastValue: value,
        meanValue: value,
      };
  }

  startClock(key) {
    this.clocks[key] = getCurrentTimeInMiliseconds();
  }

  collectClockValue(key) {
    const elapsedTime = getCurrentTimeInMiliseconds() - this.clocks[key];
    this.collect(key, elapsedTime);
  }
}

module.exports = DebugDataCollector;
