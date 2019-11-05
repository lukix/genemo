/* eslint-disable no-loop-func */

import { checkProps, types } from '../utils/typeChecking';
import { min } from '../utils/numbersListHelpers';
import RandomItem from '../utils/randomItem';

export const getNeighbors = (array, index) => {
  const neighborAIndex = index === 0
    ? array.length - 1
    : index - 1;

  const neighborBIndex = (index + 1) % array.length;

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

export const createNeighborsMap = (individualA, individualB, hashGene) => {
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
  randomItem,
) => {
  if (child.length >= parent.length) {
    return child;
  }

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

      const minNeighborsNumber = min(
        genesNeighbors.map(([, neighbors]) => neighbors.length),
      );
      const genesWithLeastNeighbors = genesNeighbors
        .filter(([, neighbors]) => neighbors.length === minNeighborsNumber)
        .map(([gene]) => gene);

      return randomItem(genesWithLeastNeighbors);
    })()
    : (() => {
      const nodesNotInChild = parent.filter(
        gene => !newChild.some(childGene => hashGene(gene) === hashGene(childGene)),
      );
      return randomItem(nodesNotInChild);
    })();

  return appendRemainingGenesToChild(
    newChild,
    nextGene,
    newNeighborsMap,
    parent,
    hashGene,
    randomItem,
  );
};

export const createSingleChild = ([mother, father], hashGene, random) => {
  const randomItem = RandomItem(random);
  const neighborsMap = createNeighborsMap(mother, father, hashGene);
  const child = [];
  const currentGene = random() < 0.5 ? mother[0] : father[0];

  return appendRemainingGenesToChild(
    child,
    currentGene,
    neighborsMap,
    mother,
    hashGene,
    randomItem,
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

export default edgeRecombination;
