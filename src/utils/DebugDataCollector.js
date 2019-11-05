import getCurrentTime from './getCurrentTime';

class DebugDataCollector {
  constructor({ collectLogs }) {
    this.data = {};
    this.clocks = {};
    this.collectLogs = collectLogs;
  }

  collect(key, value) {
    if (!this.collectLogs) {
      return;
    }

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

export default DebugDataCollector;
