// Warning: the following function modifies its parameter (to increase performance)
const transformRandomGene = transformFunc => (individual) => {
  const mutationPoint = Math.floor(Math.random() * individual.length);

  // Modifying an array in order to increase performance
  // eslint-disable-next-line no-param-reassign
  individual[mutationPoint] = transformFunc(individual[mutationPoint]);
  return individual;
};

module.exports = transformRandomGene;
