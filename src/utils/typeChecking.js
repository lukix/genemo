export const checkProps = ({ functionName, propTypes, props }) => {
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

  Object.keys(props).forEach((key) => {
    if (!propTypes[key]) {
      throw Error(`Property \`${key}\` is not allowed in \`${functionName}\``);
    }
  });
};

export const types = {
  FUNCTION: 'function',
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
};
