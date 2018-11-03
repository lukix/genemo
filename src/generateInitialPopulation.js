const generateInitialPopulation = ({
  generateIndividual,
  size,
}) => random => Array(size).fill().map(() => generateIndividual(random));

module.exports = {
  generateInitialPopulation,
};
