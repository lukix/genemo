const R = require('ramda');

const createParallelExecutor = ({ workersNumber, workerFileName, createWorker }) => {
  // Initialize workers
  const workers = R.range(0, workersNumber).map(() => ({
    worker: createWorker(workerFileName),
    isBusy: false,
  }));

  const scheduledJobs = [];

  const triggerWorkersManagement = () => {
    const availableWorker = workers.find(({ isBusy }) => !isBusy);
    if (!availableWorker || scheduledJobs.length === 0) {
      return;
    }

    const availableJob = scheduledJobs.shift();

    availableWorker.worker.once('message', (message) => {
      // TODO: Check message.type
      availableWorker.isBusy = false;
      availableJob.onFinish(message.data);
      triggerWorkersManagement();
    });
    availableWorker.worker.send({
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

  const terminateWorkers = () => {
    workers.forEach(({ worker }) => {
      worker.kill();
    });
  };

  return [
    data => scheduleJob(data),
    terminateWorkers,
  ];
};

module.exports = createParallelExecutor;
