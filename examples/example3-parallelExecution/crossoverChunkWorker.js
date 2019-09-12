const Genemo = require('../../lib');

const createWorkerProcess = require('./utils/createWorkerProcess');

const orderOne = Genemo.crossover.orderOne();
const crossover = (parents) => {
  for (let i = 0; i < 1e6; i += 1) {
    // This loop emulates heavy computations to show advantage of parallel execution
  }
  const children = orderOne(parents, Math.random);
  return children;
};

const crossoverChunk = chunk => chunk.map(pair => crossover(pair));

createWorkerProcess({
  onRun: data => crossoverChunk(data),
});
