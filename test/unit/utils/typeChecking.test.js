const Joi = require('joi');
const { withPropsChecking } = require('../../../src/utils/typeChecking');

describe('typeChecking', () => {
  test('Should throw an error when called with no arguments', () => {
    const mockFunc = () => {};

    const mockFuncWithTypeChecking = withPropsChecking(
      'mockFunc',
      mockFunc,
      { prop1: Joi.number().required(), prop2: Joi.string() },
    );
    const testFunc = () => mockFuncWithTypeChecking();
    expect(testFunc).toThrow(Error);
  });

  test('Should throw an error when called with wrong parameters', () => {
    const mockFunc = () => {};

    const mockFuncWithTypeChecking = withPropsChecking(
      'mockFunc',
      mockFunc,
      { prop1: Joi.number().required(), prop2: Joi.string() },
    );
    const testFunc = () => mockFuncWithTypeChecking({ prop1: 'wrong type' });
    expect(testFunc).toThrow(Error);
  });
});
