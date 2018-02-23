# react-validation-utils
[![npm version](https://badge.fury.io/js/react-validation-utils.svg)](https://badge.fury.io/js/react-validation-utils)

Validate react form components, based on their state.

All the state management is under the hood.

Create the Validation class instance and describe the fields.

```js
const Validator = new Validation({
  email: {
      rule: emailRules,
      message: 'Please enter a valid email'
    }
  }
});
```

Then you can use its own checking and state wrapping methods.

In example, simply add validation with `addValidation` method, when you are initing the state:

```js
this.state = Validator.addValidation({
  email: ''
});
```
That will create a state like `{ email: '', validationStorage: {...}}`.

`validate` is a wrapper, that returns an updater function, and pass it to `this.setState` method.

When you update the field value (or field values), you can add validation to it (to them).

```js
this.setState(
  Validator.validate({ email: value });
);
```
Afer this state will be like `{ email: peter@gmail.com, validationStorage: {email: [validation-passed]} }`.

Or you can simply validate all fields at the same time.
That will update validationStorage and rerender the component with all the error messages, that you can get from `getErrors` method.

```js
this.setState(Validator.validate());
```

Here is the example of a simple React form

```js
import * as React from 'react';
import Validation from 'react-validation-utils';
import { requiredRule, lengthRule } from 'react-validation-utils/build/rules';

const Validator = new Validation({
  login: [
    {
      rule: requiredRule,
      message: 'Please fill out the login'
    },
    {
      rule: lengthRule(5),
      message: 'Login should be at least 5 characters long'
    }
  ],
  password: [
    {
      rule: requiredRule,
      message: 'Please fill out the password'
    },
    {
      rule: lengthRule(8),
      message: 'Password should be at least 8 characters long'
    }
  ]
});

class LoginForm extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // add validation storage to state (this will create this.state.validationStorage object)
    // and prevalidate all fields
    this.state = Validator.addValidation({
      login: '',
      password: ''
    });
  }

  onChange(e) {
    const { name, value } = e.target;
    // validate the field and save results in validationStorage
    this.setState(Validator.validate({ [name]: value }));
  }

  onSubmit(e) {
    e.preventDefault();
    // check validated and prevalidated fields
    if (!Validator.isFormValid(this.state)) {
      // validate all fields in the state to show all error messages
      return this.setState(Validator.validate());
    }
    this.props.onSubmit(this.state);
  }

  render() {
    const { login, password } = this.state;
    // get error messages from invalid fields, if they were validated.
    // prevalidated fields will receive no error messages, but they cause Validator.isFormValid to return false
    const errors = Validator.getErrors(this.state);
    return (
      <form>
        <input name="login" value={login} onChange={this.onChange} />
        <div className="error">{errors.login}</div>
        <input name="password" value={password} onChange={this.onChange} />
        <div className="error">{errors.password}</div>
        <button onClick={this.onSubmit} type="submit">
          Enter
        </button>
      </form>
    );
  }
}

export default LoginForm;
```

## Creating validation rules

`Rule` is a function, that return true, if the field is valid.
```js
const minAmount = val => val > 10
```

To each field you can provide a single `RuleData` object
```js
amount: {
  rule: minAmount, 
  message: errorMessageText,
  id: 'amountRule' // id is an optional parameter (if you need to rewrite the rule dynamically)
};
```

Or, if there are many rules, you can provide an array of `RuleData`s.
```js
password: [
  {
    rule: requiredRule,
    message: 'Please fill out the password'
  },
  {
    rule: lengthRule(8),
    message: 'Password should be at least 8 characters long'
  }
]
```

To dynamically change the rule you can use `Validator.updateRules` method
```js
this.setState(
  Validator
   .updateRules({
      amount: {
        amountRule: value => value >= this.props.account
      },
    })
   .validate({ amount: e.target.value })
);
```

## Choose, how many fields should be validated

When you are adding a Validator with `Validator.addValidation` method, all the fields will be prevalidated.
Prevalidation means, that you will get no error message, if the field has not passed a validation rule. (`[prevalidation-failed]`)
Validation means, that you will get an error message, if the field has not passed a validation rule.(`[validation-failed]`)

In some cases, when you are updating a single field in state, you need to validate several fields at the same time
```js
this.setState(
  Validator
   .fieldsToValidate(['amount', 'bill'])
   .validate({ amount: e.target.value })
)
```

In some cases, you need to choose, where to show error messages.
```js
this.setState(
  Validator
   .fieldsToValidate(['amount', 'bill'])
   .showErrorsOnFields(['amount'])
   .validate({ amount: e.target.value })
);
```