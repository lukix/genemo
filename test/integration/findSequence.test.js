const rand = require('random-seed');
const Genemo = require('../../src');

describe('Find Sequence', () => {
  test('Last iteration population matches snapshot', async (done) => {
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
      evaluatePopulation: Genemo.evaluatePopulation({ fitnessFunction }),
      stopCondition: Genemo.stopCondition({ minFitness: 50, maxIterations: 100 }),
      random,
      collectLogs: false,
    };

    const result = await Genemo.run(evolutionOptions);
    expect(result).toMatchSnapshot('findSequence1');
    done();
  });
});
