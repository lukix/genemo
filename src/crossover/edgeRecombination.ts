/* eslint-disable no-loop-func */

import { checkProps, types } from '../utils/typeChecking';
import { min } from '../utils/numbersListHelpers';
import RandomItem from '../utils/randomItem';
import { Rng } from '../sharedTypes';

type HashGene<Gene> = (gene: Gene) => any;

export const getNeighbors = <T>(array: Array<T>, index: number) => {
  const neighborAIndex = index === 0
    ? array.length - 1
    : index - 1;

  const neighborBIndex = (index + 1) % array.length;

  return [...new Set([neighborAIndex, neighborBIndex])]
    .filter(neighborIndex => neighborIndex !== index)
    .map(neighborIndex => array[neighborIndex]);
};

const mergeGenesLists = <Gene>(
  genesA: Array<Gene>,
  genesB: Array<Gene>,
  hashGene: HashGene<Gene>,
) => {
  const comparisonFunc = (geneA: Gene, geneB: Gene) => hashGene(geneA) === hashGene(geneB);
  const genesBNotInA = genesB.filter(geneB => genesA.every(geneA => !comparisonFunc(geneA, geneB)));
  return [...genesA, ...genesBNotInA];
};

const insertNeighborsIntoMap = <Gene>(
  map: Map<any, Array<Gene>>,
  individual: Array<Gene>,
  hashGene: HashGene<Gene>,
) => (
    new Map(
      individual.map((gene: Gene, index: number) => {
        const hash = hashGene(gene);
        const exisitngNeighbors = map.get(hash) || [];
        return [
          hash,
          mergeGenesLists(exisitngNeighbors, getNeighbors(individual, index), hashGene),
        ];
      }),
    )
  );

export const createNeighborsMap = <Gene>(
  individualA: Array<Gene>,
  individualB: Array<Gene>,
  hashGene: HashGene<Gene>,
) => {
  const neighborsAMap = insertNeighborsIntoMap(new Map(), individualA, hashGene);
  const mergedNeighborsMap = insertNeighborsIntoMap(neighborsAMap, individualB, hashGene);

  return mergedNeighborsMap;
};

const appendRemainingGenesToChild = <Gene>(
  child: Array<Gene>,
  currentGene: Gene,
  neighborsMap: Map<any, Array<Gene>>,
  parent: Array<Gene>,
  hashGene: HashGene<Gene>,
  randomItem: <T>(array: Array<T>) => T,
): Array<Gene> => {
  if (child.length >= parent.length) {
    return child;
  }

  const currentGeneHash = hashGene(currentGene);
  const newChild = [...child, currentGene];

  // Remove currentGene from neighbor lists
  const newNeighborsMap = new Map([...neighborsMap.entries()].map(([hash, neighbors]) => [
    hash,
    neighbors.filter((neighbor: Gene) => hashGene(neighbor) !== currentGeneHash),
  ]));

  const neighborsOfCurrentGene = newNeighborsMap.get(currentGeneHash);
  const hasCurrentGeneAnyNeighbors = neighborsOfCurrentGene && neighborsOfCurrentGene.length > 0;

  const nextGene = hasCurrentGeneAnyNeighbors
    ? (() => {
      //   Determine neighbor of currentGene that has fewest neighbors
      const currentGeneNeighbors = newNeighborsMap.get(currentGeneHash) as Array<Gene>;
      const genesNeighbors = currentGeneNeighbors.map(
        (gene: Gene): [Gene, Array<Gene>] => [
          gene,
          newNeighborsMap.get(hashGene(gene)) as Array<Gene>,
        ],
      );

      const minNeighborsNumber = min(
        genesNeighbors.map(([, neighbors]: [Gene, Array<Gene>]) => neighbors.length),
      );
      const genesWithLeastNeighbors = genesNeighbors
        .filter(([, neighbors]: [Gene, Array<Gene>]) => neighbors.length === minNeighborsNumber)
        .map(([gene]: [Gene, Gene[]]) => gene);

      return randomItem(genesWithLeastNeighbors);
    })()
    : (() => {
      const nodesNotInChild = parent.filter(
        (gene: Gene) => !newChild.some(childGene => hashGene(gene) === hashGene(childGene)),
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

export const createSingleChild = <Gene>(
  [mother, father]: [Array<Gene>, Array<Gene>],
  hashGene: HashGene<Gene>,
  random: Rng,
) => {
  const randomItem = RandomItem(random);
  const neighborsMap = createNeighborsMap(mother, father, hashGene);
  const child: Array<Gene> = [];
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

const edgeRecombination = <Gene>(options: { hashGene?: HashGene<Gene> } = {}) => {
  checkProps({
    functionName: 'Genemo.selection.rank',
    props: options,
    propTypes,
  });

  const {
    hashGene = (gene: Gene) => gene,
  } = options;

  return ([mother, father]: [Array<Gene>, Array<Gene>], random: Rng) => {
    const son = createSingleChild([mother, father], hashGene, random);
    const daughter = createSingleChild([mother, father], hashGene, random);
    return [son, daughter];
  };
};

export default edgeRecombination;
