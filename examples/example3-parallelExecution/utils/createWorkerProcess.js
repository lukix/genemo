const createWorkerProcess = ({
  onInit = () => null,
  onRun,
}) => {
  process.on('message', (msg) => {
    switch (msg.type) {
      case 'init':
        onInit();
        break;
      case 'run': {
        const result = onRun(msg.data);
        process.send({
          type: 'result',
          data: result,
        });
        break;
      }
      case undefined:
        throw Error('Unspecified message type');
      default:
        throw Error(`Unknown message type: ${msg.type}`);
    }
  });
};

module.exports = createWorkerProcess;
