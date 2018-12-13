import { validateField } from '../src/modules';
import { allowToWithdrawRule, emailRule, requiredRule } from './testUtils/testRules';

describe('Unit tests for validateField module', () => {
  test(`Field should be valid`, () => {
    const value = 'somemail@test.com';
    const rules = [
      {
        rule: requiredRule,
        message: 'Please enter an email'
      },
      {
        rule: emailRule,
        message: 'Please enter a valid email'
      }
    ]
    expect(validateField(value, rules, {})).toEqual([true, true]);
  });
  test(`Field should be not valid`, () => {
    const value = 'somemaiest.com';
    const rules = [
      {
        rule: requiredRule,
        message: 'Please enter an email'
      },
      {
        rule: emailRule,
        message: 'Please enter a valid email'
      }
    ]
    expect(validateField(value, rules, {})).toEqual([true, false]);
  });
});
