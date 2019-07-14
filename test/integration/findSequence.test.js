const rand = require('random-seed');
const Genemo = require('../../src');

describe('Find Sequence', () => {
  test('Last generation matches snapshot', async (done) => {
    const { random } = rand.create('seed');

    const generateIndividual = Genemo.randomSequenceOf([true, false], 50);
    const targetIndividual = generateIndividual(random);
    const fitnessFunction = (individual) => {
      const matchingElements = individual.filter(
        (element, index) => element === targetIndividual[index],
      );
      return matchingElements.length;
    };

    const evolutionOptions = {
      generateInitialPopulation: Genemo.generateInitialPopulation({
        generateIndividual,
        size: 50,
      }),
      selection: Genemo.selection.roulette(),
      reproduce: Genemo.reproduce({
        crossover: Genemo.crossover.singlePoint,
        mutate: Genemo.mutation.transformRandomGene(Genemo.mutation.flipBit),
        mutationProbability: 0.03,
      }),
      fitness: fitnessFunction,
      stopCondition: Genemo.stopCondition({ minFitness: 50, maxGenerations: 100 }),
      random,
    };

    const lastGeneration = await Genemo.runEvolutionAsync(evolutionOptions);
    expect(lastGeneration).toMatchSnapshot('findSequence1');
    done();
  });
});
