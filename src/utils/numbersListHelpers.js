const min = array => array.reduce((acc, curr) => Math.min(acc, curr));
const max = array => array.reduce((acc, curr) => Math.max(acc, curr));
const mean = array => array.reduce((sum, curr) => sum + curr) / array.length;

module.exports = {
  min,
  max,
  mean,
};
