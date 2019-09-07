// TODO: Make message types customizable(?)

const createWorkerProcess = ({
  onInit = () => null,
  onRun,
}) => {
  process.on('message', (msg) => {
    switch (msg.type) {
      case 'init':
        onInit();
        // TODO: Add some kind of storage for worker instance(?)
        // TODO: Send message
        break;
      case 'run': { // TODO: Better name of run message type
        const result = onRun(msg.data); // TODO: Better name of onRun property
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
