import RandomFromRange from './randomFromRange';
import { Rng } from '../sharedTypes';

const RandomItem = (random: Rng) => {
  const randomFromRange = RandomFromRange(random);
  return <T>(array: Array<T>) => array[randomFromRange(0, array.length - 1)];
};

export default RandomItem;
