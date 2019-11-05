import { checkProps, types } from '../utils/typeChecking';
import {
  normalizeCumulativeFitness,
  selectRouletteElement,
} from './utils/rouletteUtils';

const calculateArithmeticSeries = (first, last, count) => (count * (first + last)) / 2;

const propTypes = {
  minimizeFitness: { type: types.BOOLEAN, isRequired: true },
};

const rankSelection = (options) => {
  checkProps({
    functionName: 'Genemo.selection.rank',
    props: options,
    propTypes,
  });

  const {
    minimizeFitness,
  } = options;

  return (evaluatedPopulation, random) => {
    const compareFitness = minimizeFitness
      ? (a, b) => b.fitness - a.fitness
      : (a, b) => a.fitness - b.fitness;
    const sortedPopulation = [...evaluatedPopulation].sort(compareFitness);

    const cumulativeFitness = sortedPopulation.map((individual, index) => ({
      evaluatedIndividual: individual,
      cumulativeFitness: calculateArithmeticSeries(0, index, index + 1),
    }));

    const normalizedCumulativeFitness = normalizeCumulativeFitness(cumulativeFitness);

    return new Array(evaluatedPopulation.length).fill(null).map(() => (
      selectRouletteElement(normalizedCumulativeFitness, random())
    ));
  };
};

export default rankSelection;
