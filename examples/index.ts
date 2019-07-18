import { lengthRule, requiredRule } from '../src/rules';
import Validator from '../src/validator/validator';

function passwordStrength(val: string): boolean {
  return /[&$!*()#]/i.test(val);
}

interface LoginFormFields {
  email: string;
  password: string;
}

const loginFormValidator = new Validator<LoginFormFields>({
  email: [
    {
      rule: requiredRule,
      message: 'Email is required!'
    }
  ],
  password: [
    {
      rule: lengthRule(8),
      message: 'Password should contains at least 8 chars'
    },
    {
      rule: passwordStrength,
      message: 'Password should contain at least on special char'
    }
  ]
});
loginFormValidator.setInitialValues({
  email: '',
  password: ''
});
