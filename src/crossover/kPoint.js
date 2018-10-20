const R = require('ramda');
const singlePoint = require('./singlePoint');

const kPoint = k => ([mother, father]) => {
  const [son, daugher] = R.range(0, k).reduce(
    pair => singlePoint(pair),
    [mother, father],
  );
  return [son, daugher];
};

module.exports = kPoint;
