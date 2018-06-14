# react-validation-utils

[![npm version](https://badge.fury.io/js/react-validation-utils.svg)](https://badge.fury.io/js/react-validation-utils)

Validate react form components, based on their state.

Why to use:

1. All the state management is under the hood.
2. Incapsulation of all logic related to validation,
   you should only call needed method and library will care about details
3. Easy integration to existed components

Create the Validator class instance and describe the fields.

```js
const validator = new Validator({
  email: {
      rule: emailRules,
      message: 'Please enter a valid email'
    }
  }
});
```

Then you can use its own checking and state wrapping [methods](#api).

### Form example

Here is the example of a simple React form

```js
import * as React from "react";
import Validator from "react-validation-utils";
import { requiredRule, lengthRule } from "react-validation-utils/build/rules";

const validator = new Validator({
  login: [
    {
      rule: requiredRule,
      message: "Please fill out the login"
    },
    {
      rule: lengthRule(5),
      message: "Login should be at least 5 characters long"
    }
  ],
  password: [
    {
      rule: requiredRule,
      message: "Please fill out the password"
    },
    {
      rule: lengthRule(8),
      message: "Password should be at least 8 characters long"
    }
  ]
});

class RegistrationForm extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = validator.setInitialValues({
      login: "",
      password: ""
    });
  }

  onChange(e) {
    this.setState({ [name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    if (!Validator.isFormValid(this.state)) {
      return;
    }
    this.props.onSubmit(this.state);
  }

  render() {
    const { login, password, passwordRepeat } = this.state;
    const errors = validator.validate(this.state).getErrors();
    // By default error messages will appear on those invalid fields, which user has already touched (edited).
    return (
      <form>
        <input name="login" value={login} onChange={this.onChange} />
        <div className="error">{errors.login}</div>
        <input name="password" value={password} onChange={this.onChange} />
        <div className="error">{errors.password}</div>
        <input
          name="passwordRepeat"
          value={passwordRepeat}
          onChange={this.onChange}
        />
        <div className="error">{errors.passwordRepeat}</div>
        <button onClick={this.onSubmit} type="submit" disabled={!validator.isFormValid()} >
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
const minAmount = val => val > 10;
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
    message: "Please fill out the password"
  },
  {
    rule: lengthRule(8),
    message: "Password should be at least 8 characters long"
  }
];
```

If there are many rules, the their priority will be similar to the array order.

## Api

### constructor({FieldsDescription})

Describe in the constructor all the fields, that you will check. Like in the [example](#form-example).
You can describe for each field [1 or many rules](#creating-validation-rules).

### setInitialValues({state})

When you are creating the component state, you will need to store initial field values and do their initial validation.
Just pass the state and the validator will recognize and validate the fields, he need to work witdh.

### validate({state})

Each time you invoke the `validate` method, fields will be validated and their statuses will be updated.
Validating rules will be applied only to changed fields, because of their previous values and statuses memoization. (That's why we need `setInitialValues` method.)
In React the best way to use `validate` is in render() method.
It is useful to use `getErrors` or `getStatuses` chained to validate method like in [example](#form-example).

### getErrors()

This method will return an object with error-messages for those invalid fields, whose error-message-showing status is activated.

### getStatuses(forEveryRule = false)

This method will return an object with true or false values for valid or invalid fields.
You can use optional parameter `forEveryRule`, to get array's with every rule checking status.

### isFormValid()

Use this method to check, if the form is valid. It will return true, if all the fields in the form are valid. See the [example](#form-example)

### showErrors([fieldNames], show = true)

By default, error messages will appear for those invalid fields, which user has already touched (edited).
In rare cases you will need this method, if you want to show/hide errors for all fields.

```js
  validator.showErrors();
];
```

Or for some of the fields.

```js
  validator.showErrors(['name', 'message'], false);
];