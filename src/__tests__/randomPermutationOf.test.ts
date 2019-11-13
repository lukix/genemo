import rand from 'random-seed'; // eslint-disable-line import/no-extraneous-dependencies
import Genemo from '..';

describe('Find Sequence', () => {
  test('Sequence matches snapshot', () => {
    const { random } = rand.create('seed');
    const valuesSet = [-1, 0, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9];

    const result = Genemo.randomPermutationOf(valuesSet)(random);
    expect(result).toMatchSnapshot('randomPermutationOf');
  });

  test('works for empty valuesSet', () => {
    const { random } = rand.create('seed');
    const valuesSet = [];

    const result = Genemo.randomPermutationOf(valuesSet)(random);
    expect(result).toStrictEqual([]);
  });
});
