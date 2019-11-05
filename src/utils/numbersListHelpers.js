export const min = array => array.reduce((acc, curr) => Math.min(acc, curr));
export const max = array => array.reduce((acc, curr) => Math.max(acc, curr));
export const mean = array => array.reduce((sum, curr) => sum + curr) / array.length;
