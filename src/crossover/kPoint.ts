import R from 'ramda';
import SinglePoint from './singlePoint';

const singlePoint = SinglePoint();

const kPoint = k => ([mother, father], random) => {
  const [son, daugher] = R.range(0, k).reduce(
    pair => singlePoint(pair, random),
    [mother, father],
  );
  return [son, daugher];
};

export default kPoint;
