import Validation from '../src';
import { requiredRule, lengthRule } from '../src/rules';

describe('Unit tests for wrong using of Validation class', () => {
  test("should throw error if Validator wasn't created correctly", () => {
    expect(() => {
      new Validation(123);
    }).toThrowError('Invalid fields parameter for fields, must be object');

    expect(() => {
      new Validation('122');
    }).toThrowError('Invalid fields parameter for fields, must be object');

    expect(() => {
      new Validation(() => {});
    }).toThrowError('Invalid fields parameter for fields, must be object');
  });

  test("shouldn't throw error if Validtor was created correctly", () => {
    new Validation({
      login: [
        {
          rule: requiredRule
        }
      ]
    });
  });
  testValidatorApi('isFormValid');
  testValidatorApi('isFieldValid');
});

function testValidatorApi(functionName) {
  const LENGTH_ERROR = 'Length should be minimum 5 characters';
  const ERROR_EMPTY = 'This field should be filled';

  const Validator = new Validation({
    login: [
      {
        rule: requiredRule,
        message: ERROR_EMPTY
      },
      {
        rule: lengthRule(5),
        message: LENGTH_ERROR
      }
    ]
  });
  const state = Validator.addValidation({ login: '' });

  test(`should throw error if Validator.${functionName} was invoked with wrong arguments`, () => {
    expect(() => {
      Validator[functionName](12);
    }).toThrowError('Invalid state parameter, must be object');

    expect(() => {
      Validator[functionName]({ login: '' });
    }).toThrowError(
      `State parameter doesn't contain ${Validator.validationStorageName}`
    );

    expect(() => {
      Validator[functionName]({
        login: '',
        [Validator.validationStorageName]: 'str'
      });
    }).toThrowError('Invalid storage object, must be object');
  });

  test(`shouldn't throw error if Validator.${functionName} was invoked with right arguments`, () => {
    Validator[functionName](state);
  });
}
