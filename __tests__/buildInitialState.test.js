import { buildInitialState } from '../src/modules';
import { emailRule, requiredRule } from './testUtils/testRules';

// TODO add more tests here
describe('Unit tests for buildInitialState module', () => {
  test(`Testing initial state run`, () => {
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
      ]
    };
    const initialState = {
      email: '',
      password: ''
    };
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false, false]
      },
      password: {
        value: '',
        showError: false,
        statuses: [false]
      }
    };
    const result = buildInitialState(
      initialState,
      validationDescription,
      {},
      {}
    );
    expect(result).toEqual(validationState);
  });
});
