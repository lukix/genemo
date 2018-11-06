const elitism = ({ keepFactor, minimizeFitness }) => (
  ({ prevPopulation, childrenPopulation }) => {
    const compareAsc = (a, b) => a.fitness - b.fitness;
    const compareDesc = (a, b) => b.fitness - a.fitness;
    prevPopulation.sort(minimizeFitness ? compareAsc : compareDesc);
    const numberOfIndividualsToKeep = Math.round(prevPopulation.length * keepFactor);
    return [
      ...prevPopulation.slice(0, numberOfIndividualsToKeep),
      ...childrenPopulation.slice(numberOfIndividualsToKeep),
    ];
  }
);

module.exports = elitism;
