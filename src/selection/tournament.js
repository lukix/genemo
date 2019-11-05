import randomFromRange from '../utils/randomFromRange';
import { checkProps, types } from '../utils/typeChecking';
import findBestIndividual from '../utils/findBestIndividual';

const propTypes = {
  size: { type: types.NUMBER, isRequired: true },
  minimizeFitness: { type: types.BOOLEAN, isRequired: true },
};

const tournament = (options) => {
  checkProps({
    functionName: 'Genemo.selection.tournament',
    props: options,
    propTypes,
  });

  const {
    size,
    minimizeFitness,
  } = options;

  return (evaluatedPopulation, random) => (
    new Array(evaluatedPopulation.length).fill(null).map(() => {
      const individuals = new Array(size).fill(null).map(() => {
        const index = randomFromRange(random)(0, evaluatedPopulation.length - 1);
        return evaluatedPopulation[index];
      });
      return findBestIndividual(individuals, minimizeFitness);
    })
  );
};

export default tournament;
