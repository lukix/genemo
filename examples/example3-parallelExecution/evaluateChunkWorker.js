const Genemo = require('../../lib');
const distances = require('../data/distances17.json');

const createWorkerProcess = require('./utils/createWorkerProcess');

// Fitness is measured as a path total length
const fitnessFunction = (individual) => {
  for (let i = 0; i < 1e6; i += 1) {
    // This loop emulates heavy computations to show advantage of parallel execution
  }

  const lastToFirstDistance = distances[individual[individual.length - 1]][individual[0]];
  const totalDistance = individual.slice(0, -1).reduce((distance, city, index) => {
    const nextCity = individual[index + 1];
    const currentDistance = distances[city][nextCity];
    return distance + currentDistance;
  }, 0) + lastToFirstDistance;
  return totalDistance;
};

const evaluateChunk = chunk => (
  Genemo.evaluatePopulation({ fitnessFunction })(chunk)
);

createWorkerProcess({
  onRun: data => evaluateChunk(data),
});
