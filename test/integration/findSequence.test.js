const rand = require('random-seed');
const GMO = require('../../lib');

describe('Find Sequence', () => {
  test('Last generation matches snapshot', () => {
    const { random } = rand.create('seed');

    const generateIndividual = GMO.randomSequenceOf([true, false], 50);
    const targetIndividual = generateIndividual(random);
    const fitnessFunction = (individual) => {
      const matchingElements = individual.filter(
        (element, index) => element === targetIndividual[index],
      );
      return matchingElements.length;
    };

    const evolutionOptions = {
      generateInitialPopulation: GMO.generateInitialPopulation({
        generateIndividual,
        size: 50,
      }),
      selection: GMO.selection.roulette(),
      reproduce: GMO.reproduce({
        crossover: GMO.crossover.singlePoint,
        mutate: GMO.mutation.transformRandomGene(GMO.mutation.flipBit),
        mutationProbability: 0.03,
      }),
      fitness: fitnessFunction,
      stopCondition: GMO.stopCondition({ minFitness: 50, maxGenerations: 100 }),
      random,
    };

    const lastGeneration = GMO.runEvolution(evolutionOptions);
    expect(lastGeneration).toMatchSnapshot('findSequence1');
  });
});
