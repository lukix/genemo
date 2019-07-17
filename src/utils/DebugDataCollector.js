const getCurrentTime = require('./getCurrentTime');

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
    this.clocks[key] = getCurrentTime();
  }

  collectClockValue(key) {
    const elapsedTime = getCurrentTime() - this.clocks[key];
    this.collect(key, elapsedTime);
  }
}

module.exports = DebugDataCollector;
