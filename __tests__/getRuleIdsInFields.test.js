import { getRuleIdsInFields } from '../src/modules';
import {
  allowToWithdrawRule,
  allowToSelectBillRule,
  emailRule,
  requiredRule,
  passwordEqualRule
} from './testUtils/testRules';

describe('Unit tests for getRuleIdsInFields module', () => {
  test(`Testing for ruleId in one field`, () => {
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
    const expected = {
      passwordEqual: ['repeatPassword']
    };
    const result = getRuleIdsInFields(validationDescription);
    expect(result).toEqual(expected);
  });

  test(`Testing for same ruleId in two fields`, () => {
    const validationDescription = {
      name: [
        {
          rule: requiredRule,
          message: 'Please enter a valid email'
        }
      ],
      password: [
        {
          rule: requiredRule,
          message: 'Please enter password'
        },
        {
          rule: passwordEqualRule,
          message: 'Passwords are not equal',
          ruleId: 'passwordEqual'
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
    const expected = {
      passwordEqual: ['password', 'repeatPassword']
    };
    const result = getRuleIdsInFields(validationDescription);
    expect(result).toEqual(expected);
  });

  test(`Testing for two ruleIds in two fields`, () => {
    const validationDescription = {
      receiverCode: [
        {
          rule: requiredRule,
          message: 'Please enter a receiverCode'
        }
      ],
      withdrawAmount: [
        {
          rule: requiredRule,
          message: 'Please enter amount'
        },
        {
          rule: allowToWithdrawRule,
          message: 'You can not withraw this summ',
          ruleId: 'allowToWithraw'
        }
      ],
      currentBill: [
        {
          rule: allowToSelectBillRule,
          message: 'PleaseSelectYourBill',
          ruleId: 'allowToSelectBill'
        }
      ]
    };
    const expected = {
      allowToSelectBill: ['currentBill'],
      allowToWithraw: ['withdrawAmount']
    };
    const result = getRuleIdsInFields(validationDescription);
    expect(result).toEqual(expected);
  });
});
