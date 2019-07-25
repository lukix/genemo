const R = require('ramda');
const singlePoint = require('./singlePoint')();

const kPoint = k => ([mother, father], random) => {
  const [son, daugher] = R.range(0, k).reduce(
    pair => singlePoint(pair, random),
    [mother, father],
  );
  return [son, daugher];
};

module.exports = kPoint;
