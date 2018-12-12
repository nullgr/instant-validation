# react-validation-utils

[![npm version](https://badge.fury.io/js/react-validation-utils.svg)](https://badge.fury.io/js/react-validation-utils)

VERSION 2.0

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
  email: [
    {
      rule: requiredRule,
      message: 'Please enter a valid email'
    },
    {
      rule: lengthRule(10),
      message: 'Please enter a valid email'
    }
  ],
  password: [
    {
      rule: requiredRule,
      message: 'Please enter password'
    },
  ],
  repeatPassword: [
    {
      rule: requiredRule,
      message: 'Please repeat password',
    },
    {
      // passwrodOriginal will appear here trough the insertArgs method
      rule: (value, passwrodOriginal) => value === passwrodOriginal,
      message: 'Passwords are not equal',
      ruleId: 'passwordEqual'
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
    const { errors } = validator
        .insertArgs({
          passwordEqual: [password]
        })
        .validate(this.state);
    return (
      <form>
        <input name="login" value={login} onChange={this.onChange} />
        <div className="error">{errors.login}</div>

        <input name="password" value={password} onChange={this.onChange} />
        <div className="error">{errors.password}</div>

        <input name="passwordRepeat" value={passwordRepeat} onChange={this.onChange} />
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
