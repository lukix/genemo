const { checkProps } = require('../utils/typeChecking');
const runnerPropTypes = require('./utils/runnerPropTypes');
const { evaluatePopulation } = require('./utils/evaluatePopulation');

const getGenerationsIterator = function* ({
  generateInitialPopulation,
  selection,
  reproduce,
  succession = ({ childrenPopulation }) => childrenPopulation,
  fitness,
  random = Math.random,
}) {
  checkProps({
    functionName: 'Genemo.getGenerationsIterator',
    props: {
      generateInitialPopulation,
      selection,
      reproduce,
      succession,
      fitness,
      random,
    },
    propTypes: { ...runnerPropTypes },
  });

  let generation = 0;
  const population = generateInitialPopulation(random);
  let evaluatedPopulation = evaluatePopulation(population, fitness, random);
  while (true) {
    generation += 1;
    const parentsPopulation = selection(evaluatedPopulation, random);
    const childrenPopulation = reproduce(parentsPopulation, random);
    const evaluatedChildrenPopulation = evaluatePopulation(childrenPopulation, fitness);
    evaluatedPopulation = succession({
      prevPopulation: evaluatedPopulation,
      childrenPopulation: evaluatedChildrenPopulation,
    }, random);
    yield { evaluatedPopulation, generation };
  }
};

module.exports = getGenerationsIterator;
