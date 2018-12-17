import { validateFieldsByDiff } from '../src/modules';
import { emailRule, passwordEqualRule, requiredRule } from './testUtils/testRules';

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
      repeatPassword: '12345',
    };
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false, false]
      },
      password: {
        value: '12345',
        showError: false,
        statuses: [false]
      },
      repeatPassword: {
        value: '1234',
        showError: false,
        statuses: [false, false]
      }
    };
    const insertedArgs = {passwordEqual: ['12345']};
    const ruleIdsInFields = {
      passwordEqual: ['repeatPassword']
    };

    const expected = {
      email: {
        showError: false,
        statuses: [false, false],
        value: ''
      },
      password: {
        showError: false,
        statuses: [false],
        value: '12345'
      },
      repeatPassword: {
        showError: true,
        statuses: [true,true],
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
