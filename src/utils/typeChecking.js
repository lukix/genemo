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

module.exports = {
  withPropsChecking,
};
