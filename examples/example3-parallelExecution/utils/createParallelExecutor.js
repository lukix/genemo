const { fork } = require('child_process');
const R = require('ramda');

const createParallelExecutor = ({ workersNumber, workerFileName }) => {
  // Initialize workers
  const workers = R.range(0, workersNumber).map(() => ({
    process: fork(workerFileName),
    isBusy: false,
  }));

  const scheduledJobs = [];

  const triggerWorkersManagement = () => {
    if (scheduledJobs.length === 0) {
      return;
    }

    const availableWorker = workers.find(({ isBusy }) => !isBusy);
    if (!availableWorker) {
      return;
    }

    const availableJob = scheduledJobs.shift();

    availableWorker.process.once('message', (message) => {
      // TODO: Check message.type
      availableWorker.isBusy = false;
      availableJob.onFinish(message.data);
      triggerWorkersManagement();
    });
    availableWorker.process.send({
      type: 'run',
      data: availableJob.data,
    });
    availableWorker.isBusy = true;
  };

  const scheduleJob = data => (
    new Promise((resolve) => {
      scheduledJobs.push({
        data,
        onFinish: resolve,
      });
      triggerWorkersManagement();
    })
  );

  return data => scheduleJob(data);
};

module.exports = createParallelExecutor;
