const generateInitialPopulation = ({
  generateIndividual,
  size,
}) => () => Array(size).fill().map(generateIndividual);

module.exports = {
  generateInitialPopulation,
};
