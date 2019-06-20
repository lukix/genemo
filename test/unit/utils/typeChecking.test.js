const Joi = require('joi');
const { withPropsChecking, checkProps, types } = require('../../../src/utils/typeChecking');

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

describe('checkProps', () => {
  test('Should not throw an error when called with correct parameters', () => {
    const testFunc = () => checkProps({
      functionName: 'test func',
      propTypes: {
        key1: { type: types.NUMBER, isRequired: true },
        key2: { type: types.STRING, isRequired: false },
        key3: { type: types.STRING, isRequired: false },
      },
      props: { key1: 5, key2: '5' },
    });
    expect(testFunc).not.toThrow();
  });

  test('Should throw an error when props is not an object', () => {
    const testFunc = () => checkProps({
      functionName: 'test func',
      propTypes: {},
      props: undefined,
    });
    expect(testFunc).toThrow(Error);
  });

  test('Should throw an error when called with wrong prop type', () => {
    const testFunc = () => checkProps({
      functionName: 'test func',
      propTypes: { key1: { type: types.NUMBER, isRequired: true } },
      props: { key1: '5' },
    });
    expect(testFunc).toThrow(Error);
  });

  test('Should throw an error when called with missing required prop', () => {
    const testFunc = () => checkProps({
      functionName: 'test func',
      propTypes: { key1: { type: types.NUMBER, isRequired: true } },
      props: {},
    });
    expect(testFunc).toThrow(Error);
  });
});
