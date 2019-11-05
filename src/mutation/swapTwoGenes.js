import randomFromRange from '../utils/randomFromRange';

// Warning: the following function modifies its parameter (to increase performance)
const swapTwoGenes = () => (individual, random) => {
  const index1 = randomFromRange(random)(0, individual.length - 1);
  const index2 = randomFromRange(random)(0, individual.length - 1);
  const value1 = individual[index1];
  const value2 = individual[index2];

  // Modifying an array in order to increase performance
  individual[index1] = value2; // eslint-disable-line no-param-reassign
  individual[index2] = value1; // eslint-disable-line no-param-reassign
  return individual;
};

export default swapTwoGenes;
