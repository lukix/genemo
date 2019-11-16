import { checkProps, types } from '../utils/typeChecking';
import { EvaluatedPopulation, Rng, EvaluatedIndividual } from '../sharedTypes';
import {
  normalizeCumulativeFitness,
  selectRouletteElement,
} from './utils/rouletteUtils';

const calculateArithmeticSeries = (
  first: number,
  last: number,
  count: number,
) => (count * (first + last)) / 2;

const propTypes = {
  minimizeFitness: { type: types.BOOLEAN, isRequired: true },
};

const rankSelection = (options: { minimizeFitness: boolean }) => {
  checkProps({
    functionName: 'Genemo.selection.rank',
    props: options,
    propTypes,
  });

  const {
    minimizeFitness,
  } = options;

  return <Individual>(evaluatedPopulation: EvaluatedPopulation<Individual>, random: Rng) => {
    const compareFitness = minimizeFitness
      ? (a: EvaluatedIndividual<Individual>, b: EvaluatedIndividual<Individual>) => (
        b.fitness - a.fitness
      )
      : (a: EvaluatedIndividual<Individual>, b: EvaluatedIndividual<Individual>) => (
        a.fitness - b.fitness
      );
    const sortedPopulation = [...evaluatedPopulation].sort(compareFitness);

    const cumulativeFitness = sortedPopulation.map((evaluatedIndividual, index) => ({
      individual: evaluatedIndividual.individual,
      fitness: evaluatedIndividual.fitness,
      cumulativeFitness: calculateArithmeticSeries(0, index, index + 1),
    }));

    const normalizedCumulativeFitness = normalizeCumulativeFitness(cumulativeFitness);

    return new Array(evaluatedPopulation.length).fill(null).map(() => (
      selectRouletteElement(normalizedCumulativeFitness, random())
    ));
  };
};

export default rankSelection;
