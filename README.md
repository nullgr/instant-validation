# react-validation-utils
[![npm version](https://badge.fury.io/js/react-validation-utils.svg)](https://badge.fury.io/js/react-validation-utils)

Validate react form components, based on their state.

All the state management is under the hood.

Simply create the Validation class instance and describe the fields.

```js
const Validator = new Validation({
  email: {
      rule: emailRules,
      message: 'Please enter a valid email'
    }
  },
});
```

Then you can use its own checking and state wrapping methods.

In example, simply add validationm when you are initing the state

```js
  this.state = Validator.addValidation({
    login: '',
    password: ''
  });
```

`validate` is a wrapper, that returns an updater function, and pass it to `this.setState` method

When you update the field value, you can add validation to it

```js
this.setState(
  Validator.validate({ login: value });
)
```

Or you can simply validate all fields at the same time, that will rerender the component

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
