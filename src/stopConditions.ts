import { checkProps, types } from './utils/typeChecking';
import { EvaluatedPopulation } from './sharedTypes';

const propTypes = {
  minFitness: { type: types.NUMBER, isRequired: false },
  maxFitness: { type: types.NUMBER, isRequired: false },
  maxIterations: { type: types.NUMBER, isRequired: false },
};

export const stopCondition = (
  options: { minFitness?: number; maxFitness?: number; maxIterations?: number },
) => {
  checkProps({
    functionName: 'Genemo.stopCondition',
    props: options,
    propTypes,
  });

  const {
    minFitness = Infinity,
    maxFitness = -Infinity,
    maxIterations = Infinity,
  } = options;

  return <Individual>(
    {
      evaluatedPopulation,
      iteration,
    }: {
      evaluatedPopulation: EvaluatedPopulation<Individual>;
      iteration: number;
    },
  ) => (
    evaluatedPopulation.some(({ fitness }) => fitness >= minFitness)
    || evaluatedPopulation.some(({ fitness }) => fitness <= maxFitness)
    || iteration >= maxIterations
  );
};
