const Joi = require('joi');
const R = require('ramda');

const withPropsChecking = R.curry((funcName, func, propTypes) => (props) => {
  if (typeof props !== 'object') {
    throw Error(`Missing argument for ${funcName}`);
  }

  const validationResult = Joi.validate(props, Joi.object(propTypes));
  const { error } = validationResult;
  if (error) {
    const firstDetail = error.details[0];
    throw Error(`Invalid props passed to ${funcName}. ${firstDetail.message}`);
  }

  return func(props);
});

const checkProps = ({ functionName, propTypes, props }) => {
  if (typeof props !== 'object') {
    throw Error(`Missing argument for ${functionName}`);
  }

  Object.entries(propTypes).forEach(([key, { type, isRequired }]) => {
    const actualType = typeof props[key];
    if (actualType === 'undefined') {
      if (isRequired) {
        throw Error(`Property \`${key}\` is required in \`${functionName}\`, but received undefined`);
      }
    } else if (actualType !== type) {
      throw Error(`Invalid Property \`${key}\` supplied to \`${functionName}\`, expected ${type}, but received ${actualType}`);
    }
  });
};

const types = {
  FUNCTION: 'function',
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
};

module.exports = {
  withPropsChecking,
  checkProps,
  types,
};
