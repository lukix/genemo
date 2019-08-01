/* eslint-disable no-loop-func */

const { checkProps, types } = require('../utils/typeChecking');
const RandomFromRange = require('../utils/randomFromRange');

const getNeighbors = (array, index) => {
  const neighborAIndex = index === 0
    ? array.length - 1
    : index - 1;

  const neighborBIndex = (index + 1) % array.length;

  // Can I use Set to remove duplicates? Yes, but it needs to be specified in documentation
  return [...new Set([neighborAIndex, neighborBIndex])]
    .filter(neighborIndex => neighborIndex !== index)
    .map(neighborIndex => array[neighborIndex]);
};

const mergeGenesLists = (genesA, genesB, hashGene) => {
  const comparisonFunc = (geneA, geneB) => hashGene(geneA) === hashGene(geneB);
  const genesBNotInA = genesB.filter(geneB => genesA.every(geneA => !comparisonFunc(geneA, geneB)));
  return [...genesA, ...genesBNotInA];
};

const insertNeighborsIntoMap = (map, individual, hashGene) => (
  new Map(
    individual.map((gene, index) => {
      const hash = hashGene(gene);
      const exisitngNeighbors = map.get(hash) || [];
      return [
        hash,
        mergeGenesLists(exisitngNeighbors, getNeighbors(individual, index), hashGene),
      ];
    }),
  )
);

const createNeighborsMap = (individualA, individualB, hashGene) => {
  const neighborsAMap = insertNeighborsIntoMap(new Map(), individualA, hashGene);
  const mergedNeighborsMap = insertNeighborsIntoMap(neighborsAMap, individualB, hashGene);

  return mergedNeighborsMap;
};

const appendRemainingGenesToChild = (
  child,
  currentGene,
  neighborsMap,
  parent,
  hashGene,
  randomFromRange,
) => {
  const currentGeneHash = hashGene(currentGene);
  const newChild = [...child, currentGene];

  // Remove currentGene from neighbor lists
  const newNeighborsMap = new Map([...neighborsMap.entries()].map(([hash, neighbors]) => [
    hash,
    neighbors.filter(neighbor => hashGene(neighbor) !== currentGeneHash),
  ]));

  const neighborsOfCurrentGene = newNeighborsMap.get(currentGeneHash);
  const hasCurrentGeneAnyNeighbors = neighborsOfCurrentGene && neighborsOfCurrentGene.length > 0;

  const nextGene = hasCurrentGeneAnyNeighbors
    ? (() => {
      //   Determine neighbor of currentGene that has fewest neighbors
      const currentGeneNeighbors = newNeighborsMap.get(currentGeneHash);
      const genesNeighbors = currentGeneNeighbors.map(
        gene => [gene, newNeighborsMap.get(hashGene(gene))],
      );

      const minNeighborsNumber = Math.min(
        ...genesNeighbors.map(([, neighbors]) => neighbors.length),
      );
      const genesWithLeastNeighbors = genesNeighbors
        .filter(([, neighbors]) => neighbors.length === minNeighborsNumber)
        .map(([gene]) => gene);

      return genesWithLeastNeighbors[randomFromRange(0, genesWithLeastNeighbors.length - 1)];
    })()
    : (() => {
      const nodesNotInChild = parent.filter( // assume that mother and father have the same set of genes
        gene => !newChild.some(childGene => hashGene(gene) === hashGene(childGene)),
      );
      return nodesNotInChild[randomFromRange(0, nodesNotInChild.length - 1)];
    })();

  return newChild.length < parent.length
    ? appendRemainingGenesToChild(
      newChild,
      nextGene,
      newNeighborsMap,
      parent,
      hashGene,
      randomFromRange,
    )
    : newChild;
};

const createSingleChild = ([mother, father], hashGene, random) => {
  const randomFromRange = RandomFromRange(random);
  const neighborsMap = createNeighborsMap(mother, father, hashGene);
  const child = [];
  const currentGene = random() < 0.5 ? mother[0] : father[0];

  return appendRemainingGenesToChild(
    child,
    currentGene,
    neighborsMap,
    mother,
    hashGene,
    randomFromRange,
  );
};

const propTypes = {
  hashGene: { type: types.FUNCTION, isRequired: false },
};

const edgeRecombination = (options = {}) => {
  checkProps({
    functionName: 'Genemo.selection.rank',
    props: options,
    propTypes,
  });

  const {
    hashGene = gene => gene,
  } = options;

  return ([mother, father], random) => {
    const son = createSingleChild([mother, father], hashGene, random);
    const daughter = createSingleChild([mother, father], hashGene, random);
    return [son, daughter];
  };
};

module.exports = edgeRecombination;
module.exports.getNeighbors = getNeighbors;
module.exports.createNeighborsMap = createNeighborsMap;
module.exports.createSingleChild = createSingleChild;
