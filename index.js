const GMO = require('./src');

const generateIndividual = GMO.randomSequenceOf([true, false], 50);

const targetIndividual = generateIndividual();

const fitnessFunc = (individual) => {
  let similarity = 0;
  individual.forEach((element, index) => {
    similarity += element === targetIndividual[index] ? 1 : 0;
  });
  return similarity;
};

const evolutionOptions = {
  generateInitialPopulation: GMO.generateInitialPopulation({
    generateIndividual,
    size: 500,
  }),
  selection: GMO.selection.roulette,
  reproduce: GMO.reproduce({
    mutate: GMO.mutation.transformRandomGene(GMO.mutation.flipBit),
    crossover: GMO.crossover.singlePoint,
    mutationProbability: 0.01,
  }),
  fitness: fitnessFunc,
  stopCondition: GMO.stopCondition({ minFitness: 50, maxGenerations: 1000 }),
};

console.time('evolution');
const lastGeneration = GMO.runEvolution(evolutionOptions);
console.timeEnd('evolution');

const { evaluatedPopulation, generation } = lastGeneration;

console.log({
  generation,
  maxFitness: Math.max(...evaluatedPopulation.map(({ fitness }) => fitness)),
});
