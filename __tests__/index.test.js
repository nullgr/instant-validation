import Validation from '../src';
import { requiredRule, lengthRule } from '../src/rules';
const LENGTH_ERROR = 'Length should be minimum 5 characters';
const ERROR_EMPTY = 'This field should be filled';

describe('Unit tests for Validation class', () => {
  // here will be stored each updated store phase
  let state;

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
    ],
    password: [
      {
        rule: lengthRule(8),
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
        rule: lengthRule(8),
        message: LENGTH_ERROR
      },
      {
        id: 'repeatRule',
        rule: (val, state) => val === state.newPass || !val || !state.newPass,
        message: ''
      }
    ],
    accept: {
      rule: requiredRule,
      message: ERROR_EMPTY
    }
  });

  test('Validator.addValidation(state)', () => {
    const initState = Validator.addValidation({
      login: '',
      password: '',
      repeatPass: '',
      accept: false
    });

    // update state and compare to result
    state = {
      login: '',
      password: '',
      repeatPass: '',
      accept: false,
      validationStorage: {
        accept: ['prevalidation-failed'],
        login: ['prevalidation-failed', 'prevalidation-failed'],
        password: ['prevalidation-failed', 'validation-passed'],
        repeatPass: ['prevalidation-failed', 'validation-passed']
      }
    };

    expect(initState).toEqual(state);
  });

  test('getErrors after Validator.addValidation', () => {
    expect(Validator.getErrors(state)).toEqual({
      accept: '',
      login: '',
      password: '',
      repeatPass: ''
    });
  });

  test('Validator.validate({login: value})', () => {
    const value = 'pit';

    // create updater function from Validator to use the result in setState method
    const updater = Validator.validate({
      login: value
    });

    // call the updater function to check the result
    const result = updater(state);

    // update snapshot and compare to result
    const expected = {
      login: value,
      validationStorage: {
        accept: ['prevalidation-failed'],
        login: ['validation-passed', 'validation-failed'],
        password: ['prevalidation-failed', 'validation-passed'],
        repeatPass: ['prevalidation-failed', 'validation-passed']
      }
    };

    expect(result).toEqual(expected);
    // result of state updates
    state = Object.assign({}, state, result);
  });

  test('getErrors after Validator.validate({ login: value })', () => {
    expect(Validator.getErrors(state)).toEqual({
      accept: '',
      login: LENGTH_ERROR,
      password: '',
      repeatPass: ''
    });
  });

  test('Validator.validate({login, password, repeatPass})', () => {
    const loginVal = 'peterson';
    const passordVal = '123456789a';
    const passordRVal = '123456789a';
    const updater = Validator.validate({
      login: loginVal,
      password: passordVal,
      repeatPass: passordRVal
    });
    const result = updater(state);
    const expected = {
      login: loginVal,
      password: passordVal,
      repeatPass: passordRVal,
      validationStorage: {
        accept: ['prevalidation-failed'],
        login: ['validation-passed', 'validation-passed'],
        password: ['validation-passed', 'validation-passed'],
        repeatPass: ['validation-passed', 'validation-passed']
      }
    };
    expect(result).toEqual(expected);
    state = Object.assign({}, state, result);
  });

  test('getErrors after Validator.validate({login, password, repeatPass})', () => {
    expect(Validator.getErrors(state)).toEqual({
      accept: '',
      login: '',
      password: '',
      repeatPass: ''
    });
  });

  test('Validator.isFormValid(state) method equals false', () => {
    expect(Validator.isFormValid(state)).toEqual(false);
  });

  test('Validator.validate()', () => {
    const updater = Validator.validate();
    const result = updater(state);
    const expected = {
      validationStorage: {
        accept: ['validation-failed'],
        login: ['validation-passed', 'validation-passed'],
        password: ['validation-passed', 'validation-passed'],
        repeatPass: ['validation-passed', 'validation-passed']
      }
    };

    expect(result).toEqual(expected);
    state = Object.assign({}, state, result);
  });

  test('getErrors after Validator.validate()', () => {
    expect(Validator.getErrors(state)).toEqual({
      accept: ERROR_EMPTY,
      login: '',
      password: '',
      repeatPass: ''
    });
  });

  test('Validator.isFormValid(state) method equals true', () => {
    const updater = Validator.validate({
      accept: true
    });
    const result = updater(state);
    state = Object.assign({}, state, result);
    expect(Validator.isFormValid(state)).toEqual(true);
  });
});