import R from 'ramda';
import SinglePoint from './singlePoint';
import { Rng } from '../sharedTypes';

const singlePoint = SinglePoint();

const kPoint = (k: number) => <Gene>(
  [mother, father]: [Array<Gene>, Array<Gene>],
  random: Rng,
) => {
  const [son, daugher] = R.range(0, k).reduce(
    (pair: [Array<Gene>, Array<Gene>]): [Array<Gene>, Array<Gene>] => singlePoint(pair, random),
    [mother, father],
  );
  return [son, daugher];
};

export default kPoint;
