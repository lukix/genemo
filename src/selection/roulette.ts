import R from 'ramda';
import { checkProps, types } from '../utils/typeChecking';
import { Rng, EvaluatedPopulation } from '../sharedTypes';
import {
  normalizeCumulativeFitness,
  selectRouletteElement,
} from './utils/rouletteUtils';
import { min, max } from '../utils/numbersListHelpers';

const normalizePopulationFitness = <Individual>(
  evaluatedPopulation: EvaluatedPopulation<Individual>,
  minimizeFitness: boolean,
) => {
  const minFitness = min(evaluatedPopulation.map(({ fitness }) => fitness));
  const maxFitness = max(evaluatedPopulation.map(({ fitness }) => fitness));

  return evaluatedPopulation.map(evaluatedIndividual => ({
    ...evaluatedIndividual,
    normalizedFitness: minimizeFitness
      ? maxFitness - evaluatedIndividual.fitness
      : evaluatedIndividual.fitness - minFitness,
  }));
};

const calculateCumulativeFitness = (
  populationWithNormalizedFitness: Array<{ normalizedFitness: number }>,
) => (
  R.scan(
    (prev, currIndividual) => ({
      evaluatedIndividual: currIndividual,
      cumulativeFitness: prev.cumulativeFitness + currIndividual.normalizedFitness,
    }),
    { cumulativeFitness: 0, evaluatedPopulation: null },
    populationWithNormalizedFitness,
  ).slice(1)
);

const propTypes = {
  minimizeFitness: { type: types.BOOLEAN, isRequired: true },
};

const rouletteSelection = (options: { minimizeFitness: boolean }) => {
  checkProps({
    functionName: 'Genemo.selection.roulette',
    props: options,
    propTypes,
  });

  const {
    minimizeFitness,
  } = options;

  return <Individual>(
    evaluatedPopulation: EvaluatedPopulation<Individual>,
    random: Rng,
  ): EvaluatedPopulation<Individual> => {
    const populationWithNormalizedFitness = normalizePopulationFitness(
      evaluatedPopulation,
      minimizeFitness,
    );

    const cumulativeFitness = calculateCumulativeFitness(populationWithNormalizedFitness);
    const normalizedCumulativeFitness = normalizeCumulativeFitness(cumulativeFitness);

    const result = new Array(evaluatedPopulation.length).fill(null).map(() => (
      selectRouletteElement(normalizedCumulativeFitness, random())
    ));
    return result;
  };
};

export default rouletteSelection;
