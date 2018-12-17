# instant-validation
- quick setup
- framework agnostic
- zero dependencies

Why to use:

1. All the state management is under the hood.
2. Incapsulation of all logic related to validation,
   you should only call needed method and library will care about details
3. Easy integration

```js
const validator = new Validator({
  email: {
      rule: emailRule,
      message: 'Please enter a valid email'
    }
  }
});
```

### Form example

Here is the example of a simple React form for creating an account

```js
import * as React from 'react';
import Validator from 'instant-validation';
import { requiredRule } from 'instant-validation/build/rules';
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
