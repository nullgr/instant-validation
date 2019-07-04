import { validateFieldsByDiff } from '../src/validator/modules';
import {
  emailRule,
  passwordEqualRule,
  requiredRule
} from './testUtils/testRules';

// TODO add more tests here
describe('Unit tests for validateFieldsByDiff module', () => {
  test(`Test password confirmation case`, () => {
    const validationDescription = {
      email: [
        {
          rule: requiredRule,
          message: 'Please enter a valid email'
        },
        {
          rule: emailRule,
          message: 'Please enter a valid email'
        }
      ],
      password: [
        {
          rule: requiredRule,
          message: 'Please enter password'
        }
      ],
      repeatPassword: [
        {
          rule: requiredRule,
          message: 'Please repeat password'
        },
        {
          rule: passwordEqualRule,
          message: 'Passwords are not equal',
          ruleId: 'passwordEqual'
        }
      ]
    };
    const diff = {
      repeatPassword: '12345'
    };
    const validationState = {
      email: {
        value: '',
        showError: false,
        touched: false,
        statuses: [false, false]
      },
      password: {
        value: '12345',
        showError: false,
        touched: true,
        statuses: [false]
      },
      repeatPassword: {
        value: '1234',
        showError: false,
        touched: true,
        statuses: [false, false]
      }
    };
    const insertedArgs = { passwordEqual: ['12345'] };
    const ruleIdsInFields = {
      passwordEqual: ['repeatPassword']
    };

    const expected = {
      email: {
        showError: false,
        touched: false,
        statuses: [false, false],
        value: ''
      },
      password: {
        showError: false,
        touched: true,
        statuses: [false],
        value: '12345'
      },
      repeatPassword: {
        showError: true,
        touched: true,
        statuses: [true, true],
        value: '12345'
      }
    };
    expect(
      validateFieldsByDiff(
        diff,
        validationState,
        validationDescription,
        true,
        insertedArgs,
        ruleIdsInFields
      )
    ).toEqual(expected);
  });
});
