import { createValidator } from '../src/testUtils';

// This test method just checks if Public Api methods call right methods of
// Validator object, passing right arguments  and returning right values

const funcArgument = { someField: '' };
const funcReturnValue = { someField: 'Uasia' };

const mockValidatorObject = {
  addValidation: jest.fn(() => funcReturnValue),
  validate: jest.fn(() => funcReturnValue),
  updateRules: jest.fn(() => funcReturnValue),
  fieldsToValidate: jest.fn(() => funcReturnValue),
  showErrorsOnFields: jest.fn(() => funcReturnValue),
  getErrors: jest.fn(() => funcReturnValue),
  isFormValid: jest.fn(() => funcReturnValue),
  isFieldValid: jest.fn(() => funcReturnValue)
};

jest.mock('../src/validator', () => {
  return function() {
    return mockValidatorObject;
  };
});

describe(`Test if public api invokes correct validation library method 
          with right argument and return right value`, () => {
  testConcreteMethod('addValidation');
  testConcreteMethod('validate', 2);
  testConcreteMethod('updateRules');
  testConcreteMethod('fieldsToValidate');
  testConcreteMethod('showErrorsOnFields');
  testConcreteMethod('getErrors', 0);
  testConcreteMethod('isFormValid', 0);
  testConcreteMethod('isFieldValid');
});

function testConcreteMethod(methodName: string, numberOfArgs: number = 1) {
  test(`${methodName} method`, () => {
    const Validator = createValidator(true);

    const args = Array(numberOfArgs).fill(funcArgument);

    expect(Validator[methodName].apply(null, args)).toEqual(funcReturnValue);

    args.forEach((arg, index) => {
      expect(mockValidatorObject[methodName].mock.calls[0][index]).toEqual(arg);
    });
  });
}
