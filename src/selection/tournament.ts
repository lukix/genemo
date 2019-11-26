import randomFromRange from '../utils/randomFromRange';
import findBestIndividual from '../utils/findBestIndividual';
import { EvaluatedPopulation, Rng } from '../sharedTypes';

const tournament = (options: { size: number; minimizeFitness: boolean }) => {
  const {
    size,
    minimizeFitness,
  } = options;

  return <Individual>(evaluatedPopulation: EvaluatedPopulation<Individual>, random: Rng) => (
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
