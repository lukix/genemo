import RandomFromRange from './randomFromRange';
import { Rng } from '../sharedTypes';

const RandomItem = <T>(random: Rng) => {
  const randomFromRange = RandomFromRange(random);
  return (array: Array<T>) => array[randomFromRange(0, array.length - 1)];
};

export default RandomItem;
