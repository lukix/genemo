import RandomFromRange from './randomFromRange';

const RandomItem = (random) => {
  const randomFromRange = RandomFromRange(random);
  return array => array[randomFromRange(0, array.length - 1)];
};

export default RandomItem;
