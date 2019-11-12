import randomFromRange from './randomFromRange';
import { Rng } from '../sharedTypes';

const getRandomIndividual = <T>(population: Array<T>, random: Rng) => {
  const index = randomFromRange(random)(0, population.length - 1);
  return population[index];
};

export default getRandomIndividual;
