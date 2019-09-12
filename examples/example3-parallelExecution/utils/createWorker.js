const { fork } = require('child_process');

const createNodeJSWorker = (workerFileName) => {
  const worker = fork(workerFileName);
  return {
    once: (...args) => worker.once(...args),
    send: (...args) => worker.send(...args),
    kill: (...args) => worker.kill(...args),
  };
};

module.exports = {
  createNodeJSWorker,
};
