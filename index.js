const GMO = require('./src');

const mutate = (individual) => {
  const mutationPoint = Math.floor(Math.random() * individual.length);
  return [
    ...individual.slice(0, mutationPoint),
    1 - individual[mutationPoint],
    ...individual.slice(mutationPoint),
  ];
};

const crossover = ([mother, father]) => {
  const cutPoint = 1 + Math.floor(Math.random() * mother.length - 1);
  const son = [...mother.slice(0, cutPoint), ...father.slice(cutPoint)];
  const daughter = [...father.slice(0, cutPoint), ...mother.slice(cutPoint)];
  return [son, daughter];
};

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
    mutate,
    crossover,
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
  evaluatedPopulation,
  generation,
  maxFitness: Math.max(...evaluatedPopulation.map(({ fitness }) => fitness)),
});
