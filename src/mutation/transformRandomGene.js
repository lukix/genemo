// Warning: the following function modifies its parameter (to increase performance)
const transformRandomGene = transformFunc => (individual, random) => {
  const mutationPoint = Math.floor(random() * individual.length);

  // Modifying an array in order to increase performance
  // eslint-disable-next-line no-param-reassign
  individual[mutationPoint] = transformFunc(individual[mutationPoint]);
  return individual;
};

module.exports = transformRandomGene;
