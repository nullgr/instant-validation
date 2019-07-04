# instant-validation

- quick setup
- framework agnostic
- zero dependencies
- tiny bundle size

**Size**: ~6.5k, ~1.7k gzip’d,

Why to use:

1. All the validation state management of your form is under the hood.
2. Incapsulation of all logic related to validation,
   you should only call needed method and library will care about details
3. Easy integration

```
$ npm install --save instant-validation
```

### A simple validator creation example

```js
import Validator from 'instant-validation';
import { requiredRule } from 'instant-validation/rules';

const validator = new Validator({
  name: [
    {
      rule: requiredRule,
      message: 'Please enter yout name'
    }
  ]
});
```

### Simple React Form example

Here is the example of a simple React form for creating an account

```js
import * as React from 'react';
import Validator from 'instant-validation';
import { requiredRule } from 'instant-validation/rules';
import { emailRule } from './validationRules';

const validator = new Validator({
  email: [
    {
      rule: requiredRule,
      message: 'Please enter an email'
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
    this.state = {
      email: '',
      password: '',
      passwordRepeat: ''
    };
  }

  onChange(e) {
    this.setState({ [name]: e.target.value });
  }

  render() {
    const { email, password, passwordRepeat } = this.state;
    const { errors } = validator
      // if you have some rules with many arguments, you can pass those arguments like this
      .insertArgs({
        passwordEqual: [password]
      })
      .validate(this.state);
    return (
      <form>
        <input name="email" value={email} onChange={this.onChange} />
        <div className="error">{errors.email}</div>

        <input name="password" value={password} onChange={this.onChange} />
        <div className="error">{errors.password}</div>

        <input
          name="passwordRepeat"
          value={passwordRepeat}
          onChange={this.onChange}
        />
        <div className="error">{errors.passwordRepeat}</div>

        <button
          onClick={this.onSubmit}
          type="submit"
          disabled={!validator.isFormValid()}
        >
          Enter
        </button>
      </form>
    );
  }
}

export default RegistrationForm;
```

## Api

### showAllErrors(show = true)

You can use this method, if you want to show all the untouched field errors. (For exmaple, if your submit-button is always enabled.)
To reset error higlighting to initial state (all error messages are hidden by default), you can invoke `showAllErrors(false)`.
Please, don't forget to manually re-render your form, after calling this method.
Here an example for React.js

```js
// submit button callback
onFormSend() {
  validator.showAllErrors();
  this.setState({ submitPressed: true }); // update component state, to invoke re-render
  if (!validator.isFormValid()) {
    return; // do no send invalid form
  }
  this.props.send(this.state.field);
};
```
