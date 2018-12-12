import { getErrorMessages } from '../src/modules';
import { emailRule, requiredRule } from './testRules';

// TODO add more tests here
describe('Unit tests for inner implementation of getErrorMessages module', () => {
  test(`Testing common case`, () => {
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
          },
        ],
        message: [
          {
            rule: requiredRule,
            message: 'Please enter a message'
          },
        ]
      }
    const validationState = {
        email: {
          value: 'some@@@mail',
          showError: true,
          statuses: [true, false]
        },
        password: {
          value: '',
          showError: false,
          statuses: [false]
        },
        message: {
          value: 'My message',
          showError: true,
          statuses: [true]
        }
    };
    const expected = {
      email: 'Please enter a valid email',
      password: '',
      message: ''
    }
    const result = getErrorMessages(validationState, validationDescription);
    expect(result).toEqual(expected);
  });
});
