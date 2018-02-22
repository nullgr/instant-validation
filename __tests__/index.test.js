import Validation from '../src';
import { requiredRule, requiredRuleBool, lengthRule } from '../src/rules';
const LENGTH_ERROR = 'Length should be minimum 5 characters';
const ERROR_EMPTY = 'This field should be filled';

describe('Unit tests for Validation class', () => {
  // here will be stored each updated store phase
  let stateSnapShot;

  const Validator = new Validation({
    login: {
      rule: requiredRule,
      message: ERROR_EMPTY
    },
    password: [
      {
        rule: lengthRule(5),
        message: LENGTH_ERROR
      },
      {
        id: 'repeatRule',
        rule: (val, state) =>
          state.repeatPass === val || !val || !state.repeatPass,
        message: ''
      }
    ],
    repeatPass: [
      {
        rule: lengthRule(5),
        message: LENGTH_ERROR
      },
      {
        id: 'repeatRule',
        rule: (val, state) => val === state.newPass || !val || !state.newPass,
        message: ''
      }
    ],
    accept: {
      rule: requiredRuleBool,
      message: ERROR_EMPTY
    }
  });

  test('addValidation method test', () => {
    const initState = Validator.addValidation({
      login: '',
      password: '',
      repeatPass: '',
      accept: false
    });

    // update snapshot and compare to result
    stateSnapShot = {
      login: '',
      password: '',
      repeatPass: '',
      accept: false,
      validationStorage: {
        accept: ['prevalidation-failed'],
        login: ['prevalidation-failed'],
        password: ['prevalidation-failed', 'validation-passed'],
        repeatPass: ['prevalidation-failed', 'validation-passed']
      }
    };

    expect(initState).toEqual(stateSnapShot);
  });

  test('getErrors method on prevalidation test', () => {
    expect(Validator.getErrors(stateSnapShot)).toEqual({
      accept: '',
      login: '',
      password: '',
      repeatPass: ''
    });
  });

  test('validate method test', () => {
    // treat previously saved snapshot as a previous state
    const prevState = stateSnapShot;

    // create updater function from Validator to use the result in setState method
    const updater = Validator.fieldsToValidate([
      'login',
      'accept',
      'password',
      'repeatPass'
    ]).validate({
      login: 'vasia',
      password: '12345',
      repeatPass: '12345',
      accept: false
    });

    // call the updater function to check the result
    const updates = updater(prevState);

    // update snapshot and compare to result
    stateSnapShot = {
      login: 'vasia',
      password: '12345',
      repeatPass: '12345',
      accept: false,
      validationStorage: {
        accept: ['validation-failed'],
        login: ['validation-passed'],
        password: ['validation-passed', 'validation-passed'],
        repeatPass: ['validation-passed', 'validation-passed']
      }
    };

    expect(updates).toEqual(stateSnapShot);
  });

  test('getErrors method on validation test', () => {
    expect(Validator.getErrors(stateSnapShot)).toEqual({
      accept: ERROR_EMPTY,
      login: '',
      password: '',
      repeatPass: ''
    });
  });

  test('isFormValid method equals false', () => {
    expect(Validator.isFormValid(stateSnapShot)).toEqual(false);
  });

  test('isFormValid method equals true', () => {
    const updater = Validator.validate({
      login: 'vasia',
      password: '12345',
      repeatPass: '12345',
      accept: true
    });

    // update snapshot with all valid fields
    stateSnapShot = updater(stateSnapShot);

    expect(Validator.isFormValid(stateSnapShot)).toEqual(true);
  });
});
