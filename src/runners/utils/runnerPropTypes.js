const { types } = require('../../utils/typeChecking');

const runnerPropTypes = {
  generateInitialPopulation: { type: types.FUNCTION, isRequired: true },
  selection: { type: types.FUNCTION, isRequired: true },
  reproduce: { type: types.FUNCTION, isRequired: true },
  succession: { type: types.FUNCTION, isRequired: false },
  fitness: { type: types.FUNCTION, isRequired: true },
  random: { type: types.FUNCTION, isRequired: false },
};

module.exports = runnerPropTypes;