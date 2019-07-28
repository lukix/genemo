const { checkProps, types } = require('./utils/typeChecking');

const compareAsc = (a, b) => a.fitness - b.fitness;
const compareDesc = (a, b) => b.fitness - a.fitness;

const propTypes = {
  keepFactor: { type: types.NUMBER, isRequired: true },
  minimizeFitness: { type: types.BOOLEAN, isRequired: true },
};

const elitism = (options) => {
  checkProps({
    functionName: 'Genemo.elitism',
    props: options,
    propTypes,
  });

  const { keepFactor, minimizeFitness } = options;

  return ({ prevPopulation, childrenPopulation }) => {
    prevPopulation.sort(minimizeFitness ? compareAsc : compareDesc);
    const numberOfIndividualsToKeep = Math.round(prevPopulation.length * keepFactor);
    return [
      ...prevPopulation.slice(0, numberOfIndividualsToKeep),
      ...childrenPopulation.slice(numberOfIndividualsToKeep),
    ];
  };
};

module.exports = elitism;
