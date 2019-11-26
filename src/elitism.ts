import { EvaluatedPopulation } from './sharedTypes';

type WithFitness = { fitness: number };

const compareAsc = (a: WithFitness, b: WithFitness) => a.fitness - b.fitness;
const compareDesc = (a: WithFitness, b: WithFitness) => b.fitness - a.fitness;

const elitism = (options: { keepFactor: number; minimizeFitness: boolean }) => {
  const { keepFactor, minimizeFitness } = options;

  return <Individual>({
    prevPopulation,
    childrenPopulation,
  }: {
    prevPopulation: EvaluatedPopulation<Individual>;
    childrenPopulation: EvaluatedPopulation<Individual>;
  }) => {
    prevPopulation.sort(minimizeFitness ? compareAsc : compareDesc);
    const numberOfIndividualsToKeep = Math.round(prevPopulation.length * keepFactor);
    return [
      ...prevPopulation.slice(0, numberOfIndividualsToKeep),
      ...childrenPopulation.slice(numberOfIndividualsToKeep),
    ];
  };
};

export default elitism;
