export type Rng = () => number;
export type EvaluatedIndividual<Individual> = { individual: Individual; fitness: number };
export type EvaluatedPopulation<Individual> = Array<EvaluatedIndividual<Individual>>;
export type Population<Individual> = Array<Individual>;
export interface RunReturnType<Individual> {
  evaluatedPopulation: EvaluatedPopulation<Individual>;
  iteration: number;
  logs: object;
  getLowestFitnessIndividual: () => EvaluatedIndividual<Individual>;
  getHighestFitnessIndividual: () => EvaluatedIndividual<Individual>;
}
