export const min = (array: Array<number>) => array.reduce((acc, curr) => Math.min(acc, curr));
export const max = (array: Array<number>) => array.reduce((acc, curr) => Math.max(acc, curr));
export const mean = (array: Array<number>) => (
  array.reduce((sum, curr) => sum + curr) / array.length
);
