import { Rng } from '../sharedTypes';

// "from" and "to" are inclusive
const randomFromRange = (random: Rng) => (
  (from: number, to: number) => from + Math.floor(random() * (to - from + 1))
);

export default randomFromRange;
