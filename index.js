const GMO = require('./src');

const flipGene = geneValue => 1 - geneValue;

const generateIndividual = () => new Array(50).fill().map(() => Math.round(Math.random()));

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
    mutate: GMO.mutation.transformRandomGene(flipGene),
    crossover: GMO.crossover.singlePoint,
    mutationProbability: 0.01,
  }),
  fitness: fitnessFunc,
  stopCondition: GMO.stopCondition({ minFitness: 51, maxGenerations: 1000 }),
};

console.time('evolution');
const lastGeneration = GMO.runEvolution(evolutionOptions);
console.timeEnd('evolution');


const { evaluatedPopulation, generation } = lastGeneration;

console.log({
  generation,
  maxFitness: Math.max(...evaluatedPopulation.map(({ fitness }) => fitness)),
});
