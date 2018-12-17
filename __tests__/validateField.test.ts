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
  test(`Field should be valid with many arguments rule`, () => {
    const value = 90;
    const rules = [
      {
        rule: requiredRule,
        message: 'Please enter amount'
      },
      {
        rule: allowToWithdrawRule,
        message: 'This amount can not be withdrawed',
        ruleId: 'allowToWithdraw'
      }
    ]
    const insertedArgs = {allowToWithdraw: [true, 100]};
    expect(validateField(value, rules, insertedArgs)).toEqual([true, true]);
  });

  test(`Field should be not valid with many arguments rule`, () => {
    const value = 110;
    const rules = [
      {
        rule: requiredRule,
        message: 'Please enter amount'
      },
      {
        rule: allowToWithdrawRule,
        message: 'This amount can not be withdrawed',
        ruleId: 'allowToWithdraw'
      }
    ]
    const insertedArgs = {allowToWithdraw: [true, 100]};
    expect(validateField(value, rules, insertedArgs)).toEqual([true, false]);
  });
});
