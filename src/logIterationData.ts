import { checkProps, types } from './utils/typeChecking';
import { mean } from './utils/numbersListHelpers';
import { RunReturnType } from './sharedTypes';

const iterationFormatter = (key: string, value: any) => `#${value}`;
const fitnessFormatter = (key: string, value: any) => `${key} = ${value}`;
const timeFormatter = (key: string, value: any) => `${key} = ${value.toFixed(2)}ms`;

const logIterationDataPropTypes = {
  include: { type: types.OBJECT, isRequired: true },
  customLogger: { type: types.FUNCTION, isRequired: false },
};

type FormatterType = (key: string, value: any) => string;
type IncludeItemType = { show: boolean; formatter?: FormatterType };
export interface LogIterationDataOptions {
  include: {
    iteration?: IncludeItemType;
    minFitness?: IncludeItemType;
    maxFitness?: IncludeItemType;
    avgFitness?: IncludeItemType;
    logsKeys?: Array<{ key: string; formatter?: FormatterType }>;
  };
  customLogger?: (value: string) => void;
}

const logIterationData = (options: LogIterationDataOptions) => {
  checkProps({
    functionName: 'Genemo.logIterationData',
    props: options,
    propTypes: logIterationDataPropTypes,
  });

  const {
    include,
    customLogger = console.log, // eslint-disable-line no-console
  } = options;

  return <Individual>({
    evaluatedPopulation,
    iteration,
    logs,
    getLowestFitnessIndividual,
    getHighestFitnessIndividual,
  }: RunReturnType<Individual>) => {
    const iterationNumber = {
      show: false,
      formatter: iterationFormatter,
      ...(include.iteration || {}),
    };
    const minFitness = { show: false, formatter: fitnessFormatter, ...(include.minFitness || {}) };
    const maxFitness = { show: false, formatter: fitnessFormatter, ...(include.maxFitness || {}) };
    const avgFitness = { show: false, formatter: fitnessFormatter, ...(include.avgFitness || {}) };
    const logsKeys = include.logsKeys || [];

    const texts = [
      iterationNumber.show && iterationNumber.formatter('iteration', iteration),
      minFitness.show && minFitness.formatter('minFitness', getLowestFitnessIndividual().fitness),
      maxFitness.show && maxFitness.formatter('maxFitness', getHighestFitnessIndividual().fitness),
      avgFitness.show && avgFitness.formatter(
        'avgFitness',
        mean(evaluatedPopulation.map(({ fitness }) => fitness)),
      ),
      ...logsKeys.map(({ key, formatter = timeFormatter }) => (
        logs[key] && formatter(key, logs[key].lastValue)
      )),
    ].filter(text => Boolean(text));

    customLogger(texts.join(', '));
  };
};

export default logIterationData;
