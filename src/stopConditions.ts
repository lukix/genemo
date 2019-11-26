import { EvaluatedPopulation } from './sharedTypes';

export const stopCondition = (
  options: { minFitness?: number; maxFitness?: number; maxIterations?: number },
) => {
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
