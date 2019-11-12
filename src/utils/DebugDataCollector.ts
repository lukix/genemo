import getCurrentTime from './getCurrentTime';

class DebugDataCollector {
  data: { [key: string]: any } = {};

  clocks: { [key: string]: number } = {};

  collectLogs: boolean;

  constructor({ collectLogs }: { collectLogs: boolean }) {
    this.data = {};
    this.clocks = {};
    this.collectLogs = collectLogs;
  }

  collect(key: string, value: any) {
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

  startClock(key: string) {
    this.clocks[key] = getCurrentTime();
  }

  collectClockValue(key: string) {
    const elapsedTime = getCurrentTime() - this.clocks[key];
    this.collect(key, elapsedTime);
  }
}

export default DebugDataCollector;
