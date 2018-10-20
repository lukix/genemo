const findRandomIndividualInRulette = (evaluatedPopulation, fitnessSum, value) => {
  let sum = 0;
  for (let i = 0; i < evaluatedPopulation.length; i += 1) {
    const individual = evaluatedPopulation[i];
    sum += individual.fitness / fitnessSum;
    if (value <= sum) {
      return individual;
    }
  }
  return evaluatedPopulation[0];
};

const rouletteSelection = (evaluatedPopulation) => {
  const fitnessSum = evaluatedPopulation.reduce(
    (sum, currIndividual) => sum + currIndividual.fitness,
    0,
  );
  return new Array(evaluatedPopulation.length).fill().map(() => (
    findRandomIndividualInRulette(evaluatedPopulation, fitnessSum, Math.random())
  ));
};

module.exports = rouletteSelection;
